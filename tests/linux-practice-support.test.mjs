import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons, manuals, createLessonShell } from '../linux-lab/curriculum.mjs';
import { Shell, seedState, evaluate } from '../linux-lab/shell.mjs';
import { starterRoute, goalDifference, explainCommand, alternativeSolutions } from '../linux-lab/practice-support.mjs';
import { varyExercise, bossChallenges } from '../linux-lab/learning.mjs';
import { createBossLesson } from '../linux-lab/bosses.mjs';
import { validateBackup } from '../linux-lab/backup.mjs';

test('starter route reuses 24 unique lessons with foundations before combined tasks', () => {
  assert.equal(starterRoute.length,24); assert.equal(new Set(starterRoute).size,24);
  assert.ok(starterRoute.every(id => lessons.some(item => item.id === id)));
  assert.ok(starterRoute.indexOf('read-welcome') < starterRoute.indexOf('filter-errors'));
  assert.ok(starterRoute.indexOf('write-note') < starterRoute.indexOf('append-note'));
  assert.ok(starterRoute.indexOf('lookup-copy') < starterRoute.indexOf('copy-note'));
  assert.ok(starterRoute.indexOf('preview-log') < starterRoute.indexOf('numeric-sort'));
});
test('differences explain missing files, incorrect content, permissions and output length', () => {
  const state = seedState();
  assert.match(goalDifference({type:'file',path:'missing.txt',text:'hello'},state,{}).summary,/还缺/);
  assert.deepEqual(goalDifference({type:'mode',path:'README.txt',value:'640'},state,{}),{summary:'目标权限 640，当前 644',expected:'640',actual:'644'});
  const difference = goalDifference({type:'file',path:'README.txt',text:'hello\n'},state,{});
  assert.equal(difference.expected,'hello\n'); assert.match(difference.actual,/欢迎/);
  assert.match(goalDifference({type:'output',exact:'a\nb'},state,{stdout:'a\nb\nc\n',code:0}).summary,/目标 2 行，实际 3 行/);
  assert.equal(goalDifference({type:'file',done:true},state,{}),null);
});
test('archive diagnosis distinguishes missing and unwanted entries', () => {
  const state = seedState();state.archives['/home/learner/test.tar'] = {'a.txt':{type:'file',text:'hello'}};
  assert.match(goalDifference({type:'archive',path:'test.tar',entries:['a.txt','b.txt']},state,{}).summary,/还缺：b.txt/);
  assert.match(goalDifference({type:'archive',path:'test.tar',entries:[],exact:true},state,{}).summary,/多出：a.txt/);
});
test('command explanations respect quoted operators, options, pipes and input redirects', () => {
  const parts = explainCommand('grep -in "ERROR|WARN" logs/app.log | wc -l > errors.txt', seedState());
  assert.match(parts.find(item => item.token === '-in').description,/忽略大小写.*行号/);
  assert.equal(parts.filter(item => item.description.includes('标准输出送')).length,1);
  assert.match(parts.find(item => item.token === '"ERROR|WARN"').description,/模式/);
  assert.match(parts.at(-1).description,/重定向/);
  assert.match(explainCommand('head -n 2 < logs/app.log',seedState())[2].description,/参数的值/);
  assert.equal(explainCommand('echo "unclosed',seedState()).length,0);
});
test('alternatives use the actual seeded variant instead of unrenamed default paths', () => {
  const source = lessons.find(item => item.id === 'read-welcome');
  const varied = varyExercise(source,createLessonShell(Shell,seedState,source).state,23);
  const solutions = alternativeSolutions(varied.lesson,varied.state);
  assert.ok(solutions.length >= 2);
  assert.ok(solutions.every(item => item.command.includes('GUIDE-23.txt')));
});
test('starter route metadata survives backup and rejects unknown routes', () => {
  const backup = {version:1,courseRoute:'starter',completed:[],favorites:[]};
  assert.equal(validateBackup(backup,new Set(starterRoute),new Set()).courseRoute,'starter');
  assert.throws(()=>validateBackup({...backup,courseRoute:'invalid'},new Set(starterRoute),new Set()),/学习路线/);
});
test('Boss reference solutions remain valid in transformed training environments', () => {
  for (const boss of bossChallenges(lessons)) {
    const source = createBossLesson(boss,boss.prerequisites[0]);
    const varied = varyExercise(source,createLessonShell(Shell,seedState,source).state,23);
    assert.ok(alternativeSolutions(varied.lesson,varied.state).length >= 1,boss.id);
  }
});
for (const lesson of lessons) test('every displayed alternative really completes '+lesson.id, () => {
  const initial = createLessonShell(Shell,seedState,lesson).state;
  const solutions = alternativeSolutions(lesson);
  assert.ok(solutions.length >= 1 && solutions.length <= 3);
  for (const candidate of solutions) {
    const shell = new Shell(initial,manuals); const outputGoals = new Set();let result;
    for (const line of candidate.command.split('\n')) {
      result = shell.execute(line);
      evaluate(lesson.goals,shell.state,result).forEach((goal,index) => {if (goal.type === 'output' && goal.done) outputGoals.add(index);});
    }
    assert.ok(evaluate(lesson.goals,shell.state,result).every((goal,index) => goal.done || goal.type === 'output' && outputGoals.has(index)),candidate.command);
  }
  assert.deepEqual(initial,createLessonShell(Shell,seedState,lesson).state);
});
