import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons,manuals,createLessonShell} from '../linux-lab/curriculum.mjs';
import {Shell,seedState,evaluate} from '../linux-lab/shell.mjs';
import {createReviewLesson} from '../linux-lab/review-exercises.mjs';
import {recordPractice,migrateLearning,recallProbability,reviewPlan,varyExercise,validLearning,validExercise,mastery} from '../linux-lab/learning.mjs';
const DAY=86400000, now=Date.UTC(2026,9,16,12), clean={maxHint:0,errors:0,activeSeconds:60,graded:false};
const ids=new Set(lessons.map(item=>item.id));
for (const source of lessons) test('adaptive review remains solvable: '+source.id,()=>{
  for (const variant of [1,6,23]) {
    const exercise=createReviewLesson(source,variant),seed=createLessonShell(Shell,seedState,exercise);
    const varied=varyExercise(exercise,seed.state,variant),shell=new Shell(varied.state,manuals);
    const outputs=new Set();let result;
    for (const line of varied.lesson.solution) {
      result=shell.execute(line);assert.equal(result.stderr,'',line);
      evaluate(varied.lesson.goals,shell.state,result).forEach((goal,i)=>{if(goal.type==='output'&&goal.done) outputs.add(i);});
    }
    const checks=evaluate(varied.lesson.goals,shell.state,result);
    assert.ok(checks.every((goal,i)=>goal.done||goal.type==='output'&&outputs.has(i)),JSON.stringify({id:source.id,variant,result,checks}));
    assert.equal(varied.lesson.id,source.id);
  }
});
test('legacy migration keeps due dates and counters and is idempotent',()=>{
  const original={'where-am-i':{attempts:4,passes:3,independent:0,retrievals:1,stage:3,errors:0,hints:0,solutions:0,lastAt:now,dueAt:now+7*DAY,lastOutcome:'hinted',days:[1,2]}};
  const migrated=migrateLearning(original);
  assert.equal(migrated['where-am-i'].dueAt,original['where-am-i'].dueAt);
  assert.equal(migrated['where-am-i'].memory.history.length,0);
  assert.deepEqual(migrateLearning(migrated),migrated);assert.ok(validLearning(migrated,ids));
  assert.equal(original['where-am-i'].memory,undefined);
});
test('actual delayed retrieval affects intervals, repeated same-day success does not',()=>{
  const records={};recordPractice(records,'where-am-i',clean,'lesson',now);
  const due=records['where-am-i'].dueAt,h=records['where-am-i'].memory.halfLife;
  recordPractice(records,'where-am-i',clean,'review',now+1000);
  assert.equal(records['where-am-i'].dueAt,due);assert.equal(records['where-am-i'].memory.halfLife,h);
  assert.equal(records['where-am-i'].retrievals,0);
  const early=structuredClone(records),late=structuredClone(records);
  recordPractice(early,'where-am-i',clean,'review',now+DAY);
  recordPractice(late,'where-am-i',clean,'review',now+7*DAY);
  assert.ok(late['where-am-i'].memory.halfLife>early['where-am-i'].memory.halfLife);
  assert.equal(early['where-am-i'].retrievals,1);
  assert.equal(late['where-am-i'].memory.history.at(-1).elapsedDays,7);
  assert.ok(late['where-am-i'].memory.history.at(-1).probability<early['where-am-i'].memory.history.at(-1).probability);
  assert.ok(recallProbability(late['where-am-i'],now+30*DAY)<recallProbability(late['where-am-i'],now+8*DAY));
});
test('explicit relearning schedules tomorrow without treating immediate completion as delayed recall',()=>{
  const records={};recordPractice(records,'where-am-i',clean,'lesson',now);
  recordPractice(records,'where-am-i',clean,'review',now+7*DAY,false);
  assert.equal(mastery(records['where-am-i'],now+7*DAY),'待巩固');
  const halfLife=records['where-am-i'].memory.halfLife,due=records['where-am-i'].dueAt;
  recordPractice(records,'where-am-i',clean,'review',now+7*DAY+60000);
  assert.equal(records['where-am-i'].memory.halfLife,halfLife);assert.equal(records['where-am-i'].dueAt,due);
  assert.equal(records['where-am-i'].retrievals,0);
});
test('hints and command errors do not change the scheduling outcome',()=>{
  const a={},b={};recordPractice(a,'where-am-i',clean,'lesson',now);recordPractice(b,'where-am-i',{...clean,maxHint:3,errors:9},'lesson',now);
  assert.deepEqual(a,b);
});
test('all due skills are queued by memory state with mixed topics and no time limit',()=>{
  const pool=lessons.slice(0,20),done=new Set(pool.map(item=>item.id));
  const plan=reviewPlan(pool,done,{},now);
  assert.equal(plan.due.length,20);assert.equal(plan.queue.length,20);
  assert.ok(validExercise({kind:'review',queue:plan.queue,index:0,variant:1},ids));
  const records={};recordPractice(records,pool[0].id,clean,'lesson',now);
  assert.ok(!reviewPlan(pool,done,records,now).queue.includes(pool[0].id));
  assert.equal(reviewPlan(pool,new Set(),records,now).due.length,0);
});
test('review puts weaker due memories first and leaves future reviews out',()=>{
  const pool=lessons.slice(0,3).map(item=>({...item,chapter:'same-topic'})),records={};
  recordPractice(records,pool[0].id,clean,'lesson',now-2*DAY);
  recordPractice(records,pool[1].id,clean,'lesson',now-10*DAY);
  recordPractice(records,pool[2].id,clean,'lesson',now);
  assert.deepEqual(reviewPlan(pool,new Set(pool.map(item=>item.id)),records,now).queue,[pool[1].id,pool[0].id]);
});
test('untrusted new memory, rounds and timing are rejected',()=>{
  const records={};recordPractice(records,'where-am-i',clean,'lesson',now);
  for (const value of [NaN,Infinity,-1,1e20]) {
    const broken=structuredClone(records);broken['where-am-i'].memory.halfLife=value;assert.equal(validLearning(broken,ids),false);
  }
  const round={kind:'review',reviewVersion:1,budget:300,results:[],variant:23,queue:['where-am-i'],index:0};
  assert.ok(validExercise(round,ids));assert.equal(validExercise({...round,results:[{id:'bad',outcome:'passed'}]},ids),false);
  assert.equal(validExercise({...round,budget:-300},ids),false);
});

test('adaptive memory and in-progress relearning survive validated backup without crediting other skills',async()=>{
  const {validateBackup}=await import('../linux-lab/backup.mjs');
  const source=lessons[0],shell=createLessonShell(Shell,seedState,source),records={};
  recordPractice(records,source.id,clean,'lesson',now);recordPractice(records,source.id,clean,'review',now+3*DAY,false);
  const data={version:2,format:'learn-linux-backup',mode:'learn',current:source.id,completed:[source.id],favorites:[],reviewBudget:180,learning:records,
    session:{revision:2,lesson:source.id,state:shell.state,transcript:[],hint:3,outputs:[],undoRedo:{past:[],future:[]},
      attempt:{...clean,graded:true,relearning:true},exercise:{kind:'review',reviewVersion:1,budget:180,variant:8,queue:[source.id],index:0,results:[{id:source.id,outcome:'relearn'}]}}};
  const restored=validateBackup(JSON.parse(JSON.stringify(data)),ids,new Set(manuals.map(item=>item.name)));
  assert.deepEqual(restored.learning,records);assert.ok(restored.session.attempt.relearning);
  assert.equal(Object.keys(restored.learning).length,1);
  assert.throws(()=>validateBackup({...data,reviewBudget:200},ids,new Set()));
  const mismatched=structuredClone(records);mismatched[source.id].memory.dueAt++;
  assert.equal(validLearning(mismatched,ids),false);
});
test('content variants change task data and reject incomplete or destructive deliveries',()=>{
  const source=lessons.find(item=>item.id==='filter-errors'),a=createReviewLesson(source,1),b=createReviewLesson(source,6);
  assert.notEqual(a.seed.files['batch.log'],b.seed.files['batch.log']);
  const shell=createLessonShell(Shell,seedState,a);
  shell.execute('grep ERROR batch.log > failures.txt');
  assert.equal(evaluate(a.goals,shell.state)[0].done,false);
  const copy=createReviewLesson(lessons.find(item=>item.id==='copy-note'),1),other=createLessonShell(Shell,seedState,copy);
  other.execute('mv manifest.txt manifest.bak');
  assert.ok(evaluate(copy.goals,other.state).some(goal=>!goal.done));
});

test('round duration respects language plural forms',async()=>{
  const {createTranslator}=await import('../linux-lab/i18n-core.mjs');
  assert.equal(createTranslator({},'en')('1 分钟'),'1 minute');
  assert.equal(createTranslator({},'ru')('3 分钟'),'3 минуты');
  assert.equal(createTranslator({},'ja')('5 分钟'),'5 分');
});

test('legacy review timing remains readable without limiting the queue',()=>{
  const round={kind:'review',reviewVersion:1,budget:180,spentSeconds:120,variant:8,queue:['where-am-i'],index:0};
  assert.ok(validExercise(round,ids));assert.equal(validExercise({...round,spentSeconds:-1},ids),false);
});

test('backup keeps a paused review independently of the active lesson and validates its snapshot',async()=>{
  const {validateBackup}=await import('../linux-lab/backup.mjs');
  const snapshot=source=>({revision:2,lesson:source.id,state:createLessonShell(Shell,seedState,source).state,
    transcript:[],hint:0,outputs:[],undoRedo:{past:[],future:[]}});
  const reviewSession={...snapshot(lessons[0]),exercise:{kind:'review',reviewVersion:1,queue:lessons.map(item=>item.id),index:0,variant:8,results:[]}};
  const data={version:2,format:'learn-linux-backup',mode:'learn',current:lessons[1].id,completed:lessons.map(item=>item.id),favorites:[],
    session:snapshot(lessons[1]),reviewSession};
  assert.deepEqual(validateBackup(JSON.parse(JSON.stringify(data)),ids,new Set()).reviewSession,reviewSession);
  for (const mutate of [d=>{d.reviewSession.state.fs={};},d=>{d.reviewSession.exercise.index=1;},d=>{d.reviewSession.exercise.kind='quiz';},d=>{d.reviewSession.undoRedo.past=[{}];}]) {
    const broken=structuredClone(data);mutate(broken);assert.throws(()=>validateBackup(broken,ids,new Set()));
  }
});
