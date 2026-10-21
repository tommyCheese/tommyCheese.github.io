import test from 'node:test';
import assert from 'node:assert/strict';
import {createBossLesson} from '../linux-lab/bosses.mjs';
import {bossChallenges,varyExercise,validExercise} from '../linux-lab/learning.mjs';
import {lessons,manuals,createLessonShell} from '../linux-lab/curriculum.mjs';
import {Shell,seedState,evaluate,HOME} from '../linux-lab/shell.mjs';
import {validState,validateBackup} from '../linux-lab/backup.mjs';
const bosses=bossChallenges(lessons);
test('Boss answer backups retain separate tiers and reject malformed answer records',()=>{
  const ids=new Set(lessons.map(item=>item.id)), names=new Set(manuals.map(item=>item.name));
  const data={version:1,completed:[],favorites:[],bossAnswers:{
    'common/navigation':{title:'Boss',commands:['cp draft final']},
    'advanced/navigation':{title:'进阶 Boss',commands:['cp draft final','pwd > route.txt']}
  }};
  assert.deepEqual(validateBackup(JSON.parse(JSON.stringify(data)),ids,names).bossAnswers,data.bossAnswers);
  for(const invalid of [null,[],{'unknown/boss':data.bossAnswers['common/navigation']},
    {'common/navigation':null},{'common/navigation':{title:'Boss',commands:[{}]}},
    {'common/navigation':{title:'Boss',commands:Array(201).fill('pwd')}},
    {'common/navigation':{title:'Boss',commands:['x'.repeat(4097)]}}]) {
    assert.throws(()=>validateBackup({...data,bossAnswers:invalid},ids,names),/Boss 挑战记录无效/);
  }
});
for(const boss of bosses) test('integrated Boss is solvable in multiple variants: '+boss.id,()=>{
  for(const variant of [23,871]) {
    const source=createBossLesson(boss,boss.prerequisites[0]);
    const original=createLessonShell(Shell,seedState,source);
    assert.ok(!evaluate(source.goals,original.state).every(goal=>goal.done));
    const varied=varyExercise(source,original.state,variant);
    assert.ok(validState(varied.state));
    const shell=new Shell(varied.state,manuals);
    let result;
    for(const line of varied.lesson.solution) {result=shell.execute(line);assert.equal(result.code,0,boss.id+': '+line+' '+result.stderr);}
    assert.ok(evaluate(varied.lesson.goals,shell.state,result).every(goal=>goal.done),boss.id);
    // Partial work cannot satisfy the integrated task.
    const partial=new Shell(varied.state,manuals);
    assert.ok(!evaluate(varied.lesson.goals,partial.state,partial.execute(varied.lesson.solution[0])).every(goal=>goal.done));
  }
});
test('Boss difficulty increases in every topic without limiting available commands',()=>{
  assert.equal(bosses.length,30);
  for(const chapter of new Set(bosses.map(boss=>boss.chapter))) {
    const tasks=['common','advanced','master'].map(level=>createBossLesson(bosses.find(boss=>boss.chapter===chapter&&boss.level===level),lessons[0].id));
    assert.ok(tasks[0].goals.length<tasks[1].goals.length,chapter);
    assert.ok(tasks[1].goals.length<tasks[2].goals.length,chapter);
    assert.ok(tasks.every(task=>task.solution.length>=2));
  }
});
test('archive grading rejects leaked secrets and wrong archived content',()=>{
  const boss=bosses.find(boss=>boss.id==='common/archives'), source=createBossLesson(boss,boss.prerequisites[0]);
  const shell=createLessonShell(Shell,seedState,source);
  for(const line of source.solution) assert.equal(shell.execute(line).code,0);
  const archiveGoal=source.goals.find(goal=>goal.type==='archive');
  assert.ok(evaluate([archiveGoal],shell.state)[0].done);
  const entries=shell.state.archives[HOME+'/delivery.tar.gz'];
  entries['.secret']={type:'file',text:'private\n',mode:'644',owner:'learner'};
  assert.equal(evaluate([archiveGoal],shell.state)[0].done,false);
  delete entries['.secret'];entries['config/app.conf'].text='wrong\n';
  assert.equal(evaluate([archiveGoal],shell.state)[0].done,false);
});
test('system Boss requires preserving unrelated processes and original evidence',()=>{
  const boss=bosses.find(boss=>boss.id==='common/system'),source=createBossLesson(boss,boss.prerequisites[0]);
  const shell=createLessonShell(Shell,seedState,source);
  shell.execute('pkill worker');shell.execute('mkdir reports');shell.execute('ps aux > reports/processes.txt');shell.execute('df -h > reports/disk.txt');
  assert.ok(!evaluate(source.goals,shell.state).every(goal=>goal.done));
  shell.state.processes=shell.state.processes.filter(process=>process.name!=='bash');
  assert.equal(evaluate(source.goals,shell.state).find(goal=>goal.type==='processPresent'&&goal.name==='bash').done,false);
});
test('integrated challenge survives backup and retains all objective metadata',()=>{
  const boss=bosses.find(boss=>boss.id==='master/archives'),id=boss.prerequisites[0],source=createBossLesson(boss,id), shell=createLessonShell(Shell,seedState,source);
  const exercise={kind:'quiz',boss:boss.id,challengeVersion:1,variant:23,queue:[id],index:0};
  const ids=new Set(lessons.map(lesson=>lesson.id));assert.ok(validExercise(exercise,ids));
  const data={version:2,format:'learn-linux-backup',mode:'learn',current:id,completed:boss.prerequisites,favorites:[],session:{revision:2,lesson:id,state:shell.state,transcript:[],hint:0,outputs:source.goals.map(()=>false),undoRedo:{past:[],future:[]},exercise,attempt:{maxHint:0,errors:0,graded:false}}};
  const restored=validateBackup(JSON.parse(JSON.stringify(data)),ids,new Set(manuals.map(item=>item.name)));
  assert.deepEqual(restored.session.exercise,exercise);
  assert.equal(validExercise({...exercise,queue:[id,id]},ids),false);
  assert.equal(validExercise({...exercise,boss:undefined},ids),false);
});
