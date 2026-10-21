import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons, manuals, chapters, createLessonShell } from '../linux-lab/curriculum.mjs';
import { Shell, seedState, evaluate, HOME } from '../linux-lab/shell.mjs';
import { starterPhases, starterRoute } from '../linux-lab/practice-support.mjs';
import { reviewQueue } from '../linux-lab/learning.mjs';
import { restoreFlowAssets, restoreFlowSnapshot } from '../linux-lab/lesson-flow.mjs';

test('each task has several purposeful steps and one reference command does not complete it',()=>{
  for (const lesson of lessons) {
    assert.equal(lesson.steps.length,2,lesson.id);
    assert.ok(lesson.solution.length >= 2 && lesson.solution.length <= 5,lesson.id);
    assert.ok(lesson.reviewCommands.every(name=>manuals.some(manual=>manual.name===name)),lesson.id);
    const shell = createLessonShell(Shell,seedState,lesson);
    assert.ok(!evaluate(lesson.goals,shell.state,shell.execute(lesson.solution[0])).every(goal=>goal.done),lesson.id);
  }
});
test('the starter route introduces tools before combining them across four stages',()=>{
  assert.equal(starterPhases.length,4);
  assert.deepEqual(starterPhases.map(phase=>phase.lessons.length),[6,6,6,6]);
  for (const [before,after] of [['lookup-copy','copy-note'],['create-workspace','copy-note'],['write-note','append-note'],['filter-errors','count-lines'],['preview-log','numeric-sort'],['filter-errors','csv-column']]) assert.ok(starterRoute.indexOf(before)<starterRoute.indexOf(after));
  assert.ok(chapters.findIndex(item=>item.id==='shell')<chapters.findIndex(item=>item.id==='text'));
});
test('removing empty directories does not ask learners to create an already seeded report directory',()=>{
  const lesson=lessons.find(item=>item.id==='remove-empty'), shell=createLessonShell(Shell,seedState,lesson);
  assert.ok(shell.state.fs[HOME+'/reports/remove-empty/obsolete']);
  assert.ok(lesson.solution.every(command=>!command.startsWith('mkdir')));
  assert.ok(!lesson.reviewCommands.includes('mkdir'));
  for(const command of lesson.solution) assert.equal(shell.execute(command).code,0);
  assert.ok(evaluate(lesson.goals,shell.state).every(goal=>goal.done));
});
test('a full observation alone does not pass: the focused report must exclude irrelevant records',()=>{
  const lesson=lessons.find(item=>item.id==='process-list'),shell=createLessonShell(Shell,seedState,lesson);
  for (const line of lesson.solution) shell.execute(line);
  const report=lesson.goals.find(goal=>goal.type==='file');
  assert.equal(shell.read(report.path).includes('bash'),false);
  assert.equal(evaluate([report],shell.state)[0].done,true);
  shell.state.fs[report.path].text=shell.execute('ps aux').stdout;
  assert.equal(evaluate([report],shell.state)[0].done,false);
});
test('due reviews start with the oldest gap and interleave topics without pulling future tasks forward',()=>{
  const course=[{id:'a',chapter:'files'},{id:'b',chapter:'files'},{id:'c',chapter:'text'},{id:'d',chapter:'system'},{id:'e',chapter:'text'}];
  const completed=new Set(course.map(item=>item.id));
  const records={a:{dueAt:1},b:{dueAt:2},c:{dueAt:3},d:{dueAt:4},e:{dueAt:100}};
  assert.deepEqual(reviewQueue(course,completed,records,10),['a','c','d','b']);
});
test('socket observations follow the transformed worker PID and disappear when it stops',()=>{
  const state=seedState();state.processes.find(item=>item.name==='worker').pid=777;
  const shell=new Shell(state,manuals);
  assert.match(shell.execute('ss -tulpn').stdout,/pid=777/);
  shell.execute('kill 777'); assert.ok(!shell.execute('ss -tulpn').stdout.includes('worker'));
});
test('legacy sessions receive new teaching assets without overwriting learner work',()=>{
  const lesson=lessons.find(item=>item.id==='create-workspace'), initial=createLessonShell(Shell,seedState,lesson).state;
  const state=seedState(), asset=lesson.flowAssets[0];
  delete state.fs[HOME+'/projects/notes.txt'];
  restoreFlowAssets(state,initial,lesson);
  assert.deepEqual(state.fs[asset],initial.fs[asset]);
  assert.equal(state.fs[HOME+'/projects/notes.txt'],undefined);
  state.fs[asset].text='my work';
  restoreFlowAssets(state,initial,lesson);
  assert.equal(state.fs[asset].text,'my work');
  assert.notEqual(initial.fs[asset].text,'my work');
  const blocked=seedState(); blocked.fs[HOME+'/reports']={type:'file',text:'keep',mode:'644',owner:'learner'};
  restoreFlowAssets(blocked,initial,lesson);
  assert.equal(blocked.fs[asset],undefined);
  assert.equal(blocked.fs[HOME+'/reports'].text,'keep');
});
test('legacy undo snapshots gain new goals while retaining already observed outputs',()=>{
  const lesson=lessons.find(item=>item.id==='where-am-i'), initial=createLessonShell(Shell,seedState,lesson).state;
  const snapshot={state:structuredClone(initial),goalChecks:[{...lesson.goals[0],done:true}],lastResult:{stdout:'',code:0}};
  restoreFlowSnapshot(snapshot,initial,lesson);
  assert.equal(snapshot.goalChecks.length,lesson.goals.length);
  assert.equal(snapshot.goalChecks[0].done,true);
  assert.equal(snapshot.goalChecks.at(-1).done,false);
  assert.ok(!snapshot.goalChecks.every(goal=>goal.done));
});
