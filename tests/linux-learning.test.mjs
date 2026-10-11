import test from 'node:test';
import assert from 'node:assert/strict';
import { recordPractice, mastery, reviewQueue, quizQueue, varyExercise, validLearning } from '../linux-lab/learning.mjs';
import { lessons, manuals, createLessonShell } from '../linux-lab/curriculum.mjs';
import { Shell, seedState, evaluate } from '../linux-lab/shell.mjs';
import { validateBackup, validState } from '../linux-lab/backup.mjs';
const clean = {maxHint:0, errors:0, graded:false};
const DAY=86400000, now=20*DAY;
test('mastery follows successful goals across days regardless of hints and retries',()=>{
  const records={}; recordPractice(records,'a',clean,'lesson',now);
  assert.equal(mastery(records.a),'已完成');
  recordPractice(records,'a',clean,'review',now+1000);
  assert.equal(mastery(records.a),'已完成');
  recordPractice(records,'a',clean,'review',now+DAY);
  assert.equal(mastery(records.a),'已掌握');
  assert.equal(records.a.dueAt,now+4*DAY);
  recordPractice(records,'a',{maxHint:3,errors:1},'review',now+5*DAY);
  assert.equal(mastery(records.a),'已掌握'); assert.equal(records.a.stage,3);
  assert.equal(records.a.lastOutcome,'passed');
  assert.equal(records.a.dueAt,now+12*DAY);
});
test('due queue prioritizes unmeasured progress without penalizing assisted answers',()=>{
  const records={}; recordPractice(records,'a',clean,'lesson',now); recordPractice(records,'b',{maxHint:1,errors:0},'lesson',now);
  const course=['a','b','c','d'].map(id=>({id})), done=new Set(['a','b','c']);
  assert.deepEqual(reviewQueue(course,done,records,now),['c']);
  assert.deepEqual(reviewQueue(course,done,records,now+DAY),['c','a','b']);
});
test('success has the same assessment after hints or retries and legacy backups remain valid',()=>{
  const records={};
  recordPractice(records,'a',clean,'lesson',now);
  recordPractice(records,'b',{maxHint:3,errors:5},'lesson',now);
  assert.deepEqual(records.a,records.b);
  for (const outcome of ['independent','hinted','solution','retry']) {
    const legacy={...records.a,lastOutcome:outcome};
    assert.ok(validLearning({a:legacy},new Set(['a'])));
    assert.equal(mastery(legacy),'已完成');
  }
});
test('quiz picks only completed lessons in selected topic without duplication',()=>{
  const queue=quizQueue(lessons,new Set(lessons.slice(0,8).map(item=>item.id)),'navigation',()=>.1);
  assert.equal(queue.length,3); assert.equal(new Set(queue).size,3);
  assert.ok(queue.every(id=>lessons.slice(0,8).some(item=>item.id===id&&item.chapter==='navigation')));
});
for(const source of lessons) test('varied exercise remains solvable: '+source.id,()=>{
  const original=createLessonShell(Shell,seedState,source);
  const varied=varyExercise(source,original.state,23);
  assert.ok(validState(varied.state));
  const shell=new Shell(varied.state,manuals);
  let result;
  for(const line of varied.lesson.hints[2].split('\n')) result=shell.execute(line);
  const checks=evaluate(varied.lesson.goals,shell.state,result);
  assert.ok(checks.every(item=>item.done),JSON.stringify({solution:varied.lesson.hints[2],result,checks}));
});
test('assessment allows all supported commands and pipelines',()=>{
  const shell=new Shell(seedState(),manuals);
  assert.equal(shell.execute('cp projects/notes.txt backup.txt').code,0);
  assert.equal(shell.execute('grep ERROR logs/app.log | tee errors.txt').code,0);
  assert.equal(shell.execute('rm README.txt').code,0);
  assert.ok(shell.complete('c').includes('cp')); assert.ok(shell.complete('r').includes('rm'));
});
test('learning and active review survive backup, malformed metadata is rejected',()=>{
  const source=lessons[0],shell=createLessonShell(Shell,seedState,source), records={}; recordPractice(records,source.id,clean,'lesson',now);
  const ids=new Set(lessons.map(item=>item.id)), names=new Set(manuals.map(item=>item.name));
  const data={version:2,format:'learn-linux-backup',mode:'learn',current:source.id,completed:[source.id],favorites:[],learning:records,transfer:{files:{done:true,at:now}},session:{revision:2,lesson:source.id,state:shell.state,transcript:[],hint:0,outputs:[],undoRedo:{past:[],future:[]},exercise:{kind:'review',variant:23,queue:[source.id],index:0},attempt:clean}};
  assert.deepEqual(validateBackup(JSON.parse(JSON.stringify(data)),ids,names).learning,records);
  assert.ok(validLearning(records,ids));
  assert.throws(()=>validateBackup({...data,learning:{bad:{}}},ids,names));
  assert.throws(()=>validateBackup({...data,session:{...data.session,exercise:{...data.session.exercise,index:3}}},ids,names));
});
test('abandoned assisted attempts affect review but never count as a pass',()=>{
  const records={}; recordPractice(records,'a',{maxHint:3,errors:2},'review',now,false);
  assert.equal(records.a.passes,0); assert.equal(records.a.attempts,1); assert.equal(records.a.retrievals,0); assert.equal(records.a.dueAt,now+DAY);
});
test('copy assessments require retaining the source',()=>{
  const source=lessons.find(item=>item.command==='cp'&&item.solution[0].includes('projects/notes.txt'));
  const varied=varyExercise(source,createLessonShell(Shell,seedState,source).state,23);
  const shell=new Shell(varied.state,manuals);
  const result=shell.execute(varied.lesson.solution[0].replace(/^cp /,'mv '));
  assert.ok(evaluate(varied.lesson.goals,shell.state,result).some(item=>!item.done));
});
test('local terminal exercise scripts have valid Bash syntax',async()=>{
  const {terminalLabs}=await import('../linux-lab/terminal-labs.mjs');
  const {spawnSync}=await import('node:child_process');
  assert.equal(Object.keys(terminalLabs).length,10);
  for(const [chapter,lab] of Object.entries(terminalLabs)) {
    assert.equal(spawnSync('bash',['-n'],{input:lab.setup+'\n'+lab.solution,encoding:'utf8'}).status,0,chapter);
  }
});
test('Boss unlock requires every ordinary lesson in its topic',async()=>{
  const {bossChallenges,bossUnlocked}=await import('../linux-lab/learning.mjs');
  const bosses=bossChallenges(lessons), boss=bosses.find(item=>item.id==='common/navigation');
  assert.deepEqual(boss.prerequisites,boss.lessons);
  const other=new Set(boss.lessons.slice(0,3));
  assert.equal(bossUnlocked(boss,other),false);
  boss.prerequisites.forEach(id=>other.add(id)); assert.equal(bossUnlocked(boss,other),true);
  other.delete(boss.prerequisites[0]); assert.equal(bossUnlocked(boss,other),false);
  assert.equal(new Set(bosses.map(item=>item.id)).size,bosses.length);
  assert.ok(bosses.every(item=>item.prerequisites.every(id=>lessons.some(task=>task.id===id&&task.level===item.level&&task.chapter===item.chapter))));
});
test('Boss completion and active challenge metadata survive backup',async()=>{
  const source=lessons[0], shell=createLessonShell(Shell,seedState,source);
  const data={version:2,format:'learn-linux-backup',mode:'learn',current:source.id,completed:[source.id],favorites:[],bossCompleted:['common/navigation'],session:{revision:2,lesson:source.id,state:shell.state,transcript:[],hint:0,outputs:[],undoRedo:{past:[],future:[]},exercise:{kind:'quiz',boss:'common/navigation',variant:23,queue:[source.id],index:0},attempt:clean}};
  const ids=new Set(lessons.map(item=>item.id)),names=new Set(manuals.map(item=>item.name));
  assert.deepEqual(validateBackup(data,ids,names).bossCompleted,['common/navigation']);
  assert.throws(()=>validateBackup({...data,bossCompleted:['bogus/level']},ids,names));
  assert.throws(()=>validateBackup({...data,session:{...data.session,exercise:{...data.session.exercise,boss:'bogus/level'}}},ids,names));
});
