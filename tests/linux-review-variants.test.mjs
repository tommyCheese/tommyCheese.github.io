import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons,manuals,createLessonShell} from '../linux-lab/curriculum.mjs';
import {Shell,seedState,evaluate} from '../linux-lab/shell.mjs';
import {createReviewVariant,reviewRound,reviewRounds} from '../linux-lab/review-variants.mjs';
import {skillLabel} from '../linux-lab/review-exercises.mjs';
import {varyExercise,validExercise} from '../linux-lab/learning.mjs';
import {validState} from '../linux-lab/backup.mjs';

function run(source,variant,round) {
  const task=createReviewVariant(source,variant,round);
  const initial=createLessonShell(Shell,seedState,task);
  const varied=varyExercise(task,initial.state,variant), shell=new Shell(varied.state,manuals);
  assert.ok(validState(shell.state),source.id);
  const outputs=new Set();let result;
  for(const line of varied.lesson.solution) {
    result=shell.execute(line);
    assert.equal(result.stderr,'',source.id+': '+line);
    evaluate(varied.lesson.goals,shell.state,result).forEach((goal,index)=>{if(goal.type==='output'&&goal.done)outputs.add(index);});
  }
  const checks=evaluate(varied.lesson.goals,shell.state,result);
  assert.ok(checks.every((goal,index)=>goal.done||goal.type==='output'&&outputs.has(index)),JSON.stringify({id:source.id,variant,round,checks,solution:varied.lesson.solution}));
  assert.equal(task.title,source.title);assert.equal(task.id,source.id);assert.equal(skillLabel(task),source.title);
  assert.equal(task.command,source.command);
  return task;
}
for(const source of lessons) test('review variants retain lesson identity and remain solvable: '+source.id,()=>{
  const original=structuredClone(source);
  for(const round of [0,1,2,3,121]) for(const variant of [1,23,998]) run(source,variant,round);
  assert.deepEqual(source,original);
});

test('rounds rotate by practice history without depending on the truncated event log',()=>{
  assert.equal(reviewRound(),0);assert.equal(reviewRound({attempts:1}),0);
  assert.equal(reviewRound({attempts:125,memory:{history:[]}}),124);
  const records={'numeric-sort':{attempts:2}},rounds=reviewRounds(['numeric-sort','csv-column'],records);
  records['numeric-sort'].attempts++;
  assert.deepEqual(rounds,{'numeric-sort':1,'csv-column':0});
  assert.notDeepEqual(createReviewVariant(lessons.find(s=>s.id==='numeric-sort'),23,0).solution,createReviewVariant(lessons.find(s=>s.id==='numeric-sort'),23,1).solution);
});

test('wrong direction, broad matches and destructive shortcuts cannot complete a review',()=>{
  for(const [id,wrong] of [
    ['numeric-sort','sort -n items.txt > result.txt'],
    ['filter-errors','grep ERROR batch.log > result.txt'],
    ['csv-column','cut -d , -f 1,2 contacts.txt > result.txt'],
    ['copy-note','mkdir release; mv "handoff/candidate a.txt" release/final.txt'],
    ['cleanup-temp','rm handoff/*.tmp*'],
    ['stop-by-name','pkill worker'],
    ['append-note','echo "batch-23 ready" > result.txt']
  ]) {
    const task=createReviewVariant(lessons.find(s=>s.id===id),23,0),shell=createLessonShell(Shell,seedState,task);
    shell.execute(wrong);
    assert.ok(evaluate(task.goals,shell.state).some(goal=>goal.type!=='output'&&!goal.done),id);
  }
});

test('service inspection requires observed output and source procedures never pre-complete a task',()=>{
  for(const source of lessons)for(const round of [0,1,2]) {
    const task=createReviewVariant(source,23,round),shell=createLessonShell(Shell,seedState,task);
    assert.ok(evaluate(task.goals,shell.state).some(goal=>!goal.done),source.id);
  }
});

test('new review snapshots validate frozen rounds while legacy reviews stay readable',async()=>{
  const {validateBackup}=await import('../linux-lab/backup.mjs');
  const source=lessons[0],ids=new Set(lessons.map(item=>item.id));
  const exercise={kind:'review',reviewVersion:2,queue:[source.id],index:0,variant:23,rounds:{[source.id]:2},results:[]};
  assert.ok(validExercise(exercise,ids));
  for(const rounds of [undefined,{}, {[source.id]:-1},{[source.id]:1.5},{[source.id]:2,unknown:0}]) assert.equal(validExercise({...exercise,rounds},ids),false);
  for(const version of [undefined,1]) assert.ok(validExercise({...exercise,reviewVersion:version,rounds:undefined},ids));
  const task=createReviewVariant(source,23,exercise.rounds[source.id]);
  const state=varyExercise(task,createLessonShell(Shell,seedState,task).state,23).state;
  const data={version:2,format:'learn-linux-backup',mode:'learn',current:source.id,completed:[source.id],favorites:[],
    session:{revision:2,lesson:source.id,state,transcript:[],hint:0,outputs:[],undoRedo:{past:[],future:[]},exercise}};
  const restored=validateBackup(JSON.parse(JSON.stringify(data)),ids,new Set());
  assert.deepEqual(restored.session.exercise,exercise);
  assert.deepEqual(createReviewVariant(source,23,restored.session.exercise.rounds[source.id]),task);
});

test('every language can solve all three condition families without changing lesson titles',async()=>{
  const {readFileSync}=await import('node:fs');
  const {createTranslator}=await import('../linux-lab/i18n-core.mjs');
  const {createContentLocalizer}=await import('../linux-lab/content-i18n.mjs');
  const texts=[...Object.values(seedState().fs).map(node=>node.text||''),...lessons.flatMap(s=>Object.values(s.seed?.files||{}))];
  for(const locale of ['en','ja','ru','zh-TW']) {
    const catalog=JSON.parse(readFileSync(new URL('../linux-lab/locales/'+locale+'.json',import.meta.url)));
    const translate=createTranslator(catalog,locale),localize=createContentLocalizer(catalog,texts);
    class LocalShell extends Shell {constructor(state,manuals){super(localize(state),manuals,localize);}}
    for(const source of lessons)for(const round of [0,1,2]) {
      const task=localize(createReviewVariant(source,23,round,translate));
      assert.equal(task.title,localize(source).title);
      const initial=createLessonShell(LocalShell,seedState,task),varied=varyExercise(task,initial.state,23);
      const shell=new LocalShell(varied.state,manuals),outputs=new Set();let result;
      for(const line of varied.lesson.solution) {
        result=shell.execute(line);assert.equal(result.stderr,'',locale+': '+source.id+': '+line);
        evaluate(varied.lesson.goals,shell.state,result).forEach((goal,i)=>{if(goal.type==='output'&&goal.done)outputs.add(i);});
      }
      assert.ok(evaluate(varied.lesson.goals,shell.state,result).every((goal,i)=>goal.done||goal.type==='output'&&outputs.has(i)),locale+': '+source.id+': '+round);
      if(['en','ru'].includes(locale))for(const text of [...varied.lesson.goals.map(g=>g.label),...varied.lesson.hints.slice(0,2)]) assert.doesNotMatch(translate(text),/[\u3400-\u9fff]/,locale+': '+source.id);
    }
  }
});

test('new conditions still fulfil the promise in the unchanged lesson title',()=>{
  const lesson=id=>lessons.find(s=>s.id===id);
  for(const round of [0,1,2]) {
    const parent=createReviewVariant(lesson('parent-directory'),23,round);
    assert.equal(parent.goals.find(g=>g.type==='cwd').path,'/home/learner');
    assert.match(createReviewVariant(lesson('success-chain'),23,round).goals.find(g=>g.type==='cwd').path,/\/release$/);
    const head=createReviewVariant(lesson('preview-log'),23,round);
    assert.ok(head.goals.some(g=>g.type==='output'&&g.exact===head.seed.files['batch.log'].split('\n').slice(0,2).join('\n')));
    const tail=createReviewVariant(lesson('latest-error'),23,round);
    assert.ok(tail.goals.some(g=>g.type==='output'&&g.exact===tail.seed.files['batch.log'].trim().split('\n').at(-1)));
    const sort=createReviewVariant(lesson('numeric-sort'),23,round).goals.find(g=>g.type==='file'&&!g.preserve).text.trim().split('\n').map(Number);
    assert.deepEqual(sort,[...sort].sort((a,b)=>b-a));
    const sequence=createReviewVariant(lesson('number-sequence'),23,round).goals.find(g=>g.type==='file'&&!g.preserve).text.trim().split(/[,\n]/).map(Number);
    assert.deepEqual(sequence,[1,2,3,4,5]);
    assert.ok(createReviewVariant(lesson('step-sequence'),23,round).goals.find(g=>g.type==='file'&&!g.preserve).text.trim().split(',').map(Number).every((n,i,a)=>!i||n<a[i-1]));
  }
});
