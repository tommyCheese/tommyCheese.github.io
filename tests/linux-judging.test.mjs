import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Shell, seedState, evaluate } from '../linux-lab/shell.mjs';
import { lessons, manuals, createLessonShell } from '../linux-lab/curriculum.mjs';

const quote = text => "'" + text.replaceAll("'", "'\\''") + "'";
const exercise = id => {
  const lesson = lessons.find(item => item.id === id);
  return { lesson, shell: createLessonShell(Shell, seedState, lesson) };
};

test('observation goals require output from the workspace', () => {
  const { lesson, shell } = exercise('look-around');
  const goal = lesson.goals.find(goal => goal.type === 'output');
  const text = goal.exact ?? goal.includes;
  for (const line of [`echo ${quote(text)}`, `printf '%s\\n' ${quote(text)}`, `pwd; echo ${quote(text)}`, `pwd | echo ${quote(text)}`, `echo ${quote(text)} | cat`, `echo ${quote(text)} > /tmp/answer; cat /tmp/answer`, `mkdir -p /tmp/unrelated; touch /tmp/unrelated/foo; ls /tmp/unrelated > /tmp/answer; echo ${quote(text)} >> /tmp/answer; cat /tmp/answer`]) {
    assert.equal(evaluate([goal], shell.state, shell.execute(line))[0].done, false, line);
  }
});

test('a report must contain the result of reading its input', () => {
  const { lesson, shell } = exercise('numeric-sort');
  const goal = lesson.goals.find(goal => goal.type === 'file' && goal.path.includes('/reports/'));
  shell.execute('mkdir -p ' + quote(goal.path.slice(0, goal.path.lastIndexOf('/'))));
  shell.execute('printf ' + quote(goal.text) + ' > ' + quote(goal.path));
  assert.equal(evaluate([goal], shell.state)[0].done, false);
});

test('file and pipeline copies retain their output origins after serialization', () => {
  const { lesson, shell } = exercise('read-welcome');
  const goal = lesson.goals.find(goal => goal.type === 'output' && goal.exact === 'draft');
  for (const line of [
    "echo draft | tee /tmp/answer",
    "echo draft > /tmp/answer; cp /tmp/answer /tmp/copy; cat /tmp/copy",
    "echo draft > /tmp/answer; mv /tmp/answer /tmp/moved; cat /tmp/moved",
    "echo draft > /tmp/answer; tar -cf /tmp/answer.tar -C /tmp answer; mkdir -p /tmp/restored; tar -xf /tmp/answer.tar -C /tmp/restored; cat /tmp/restored/answer",
    "echo draft > /tmp/answer; gzip /tmp/answer; gunzip /tmp/answer.gz; cat /tmp/answer",
    "/usr/bin/echo draft | grep draft",
    "sudo echo draft | sort"
  ]) {
    assert.equal(evaluate([goal],shell.state,shell.execute(line))[0].done,false,line);
  }
  const restored = new Shell(JSON.parse(JSON.stringify(shell.state)),manuals);
  assert.equal(evaluate([goal],restored.state,restored.execute('cat /tmp/answer'))[0].done,false);
  assert.equal(evaluate([goal],restored.state,restored.execute('head projects/notes.txt'))[0].done,true);
});

test('ordinary, review and Boss goals reject manually supplied observation and report text', async () => {
  const { createReviewVariant } = await import('../linux-lab/review-variants.mjs');
  const { createBossLesson } = await import('../linux-lab/bosses.mjs');
  const { bossChallenges } = await import('../linux-lab/learning.mjs');
  const tasks = [...lessons,
    ...lessons.flatMap(lesson => [0,1,2].map(round => createReviewVariant(lesson,7,round))),
    ...bossChallenges(lessons).map(boss => createBossLesson(boss,'boss-test'))];
  let checks = 0;
  for (const lesson of tasks) {
    const shell = createLessonShell(Shell,seedState,lesson);
    for (const goal of lesson.goals) {
      if (!goal.sources?.length || goal.sources.some(sources => !sources.length || sources.every(source => source === 'literal'))) continue;
      if (goal.type === 'output') {
        const text = goal.exact ?? goal.includes;
        for (const line of [`echo ${quote(text)}`,`printf '%s\\n' ${quote(text)} | cat`]) {
          assert.equal(evaluate([goal],shell.state,shell.execute(line))[0].done,false,lesson.id+': '+line);
          checks++;
        }
      } else if (goal.type === 'file' && (goal.text || goal.includes)) {
        const path = goal.path.startsWith('/') ? goal.path : '/home/learner/' + goal.path;
        shell.execute('mkdir -p ' + quote(path.slice(0,path.lastIndexOf('/'))));
        shell.execute('printf ' + quote(goal.text ?? goal.includes) + ' > ' + quote(path));
        assert.equal(evaluate([goal],shell.state)[0].done,false,lesson.id+': '+path);
        checks++;
      }
    }
  }
  assert.ok(checks > 1000);
});

test('text-writing exercises and equivalent reading and filtering solutions still work', () => {
  for (const id of ['write-note','append-note','format-greeting','uppercase']) {
    const {lesson,shell} = exercise(id), outputs = new Set();
    for (const line of lesson.solution) {
      const result = shell.execute(line);
      evaluate(lesson.goals,shell.state,result).forEach((goal,index) => {
        if (goal.type === 'output' && goal.done) outputs.add(index);
      });
    }
    assert.ok(evaluate(lesson.goals,shell.state).every((goal,index) => goal.done || outputs.has(index)),id);
  }
  const {lesson,shell} = exercise('numeric-sort');
  const goal = lesson.goals.find(goal => goal.type === 'file' && goal.path.includes('/reports/'));
  shell.execute('mkdir -p ' + quote(goal.path.slice(0,goal.path.lastIndexOf('/'))));
  shell.execute('cat quantities.txt | sort -nr | head -n 3 > ' + quote(goal.path));
  assert.equal(evaluate([goal],shell.state)[0].done,true);
});

test('restoring old output flags rechecks observations without losing workspace files', async () => {
  const {restoreFlowSnapshot} = await import('../linux-lab/lesson-flow.mjs');
  const {lesson,shell} = exercise('look-around');
  const snapshot = {state:structuredClone(shell.state),lastResult:shell.execute("echo 'notes.txt README.txt'"),
    goalChecks:lesson.goals.map(({sources,...goal}) => ({...goal,done:true}))};
  restoreFlowSnapshot(snapshot,shell.state,lesson);
  assert.ok(snapshot.goalChecks.filter(goal => goal.type === 'output').every(goal => !goal.done));
  assert.ok(snapshot.state.fs['/home/learner/projects/notes.txt']);
  snapshot.lastResult = shell.execute('ls; ls projects');
  snapshot.goalChecks = evaluate(lesson.goals,shell.state,snapshot.lastResult);
  snapshot.lastResult = {stdout:'',code:0};
  restoreFlowSnapshot(snapshot,shell.state,lesson);
  assert.ok(snapshot.goalChecks.filter(goal => goal.type === 'output').every(goal => goal.done));
});

test('backup validation accepts origins and rejects malformed metadata', async () => {
  const {validState} = await import('../linux-lab/backup.mjs');
  const {shell} = exercise('read-welcome');
  assert.equal(validState(shell.state),true);
  for (const sources of ['file:/tmp/input',[{}],Array(10001).fill('x')]) {
    const state = structuredClone(shell.state);
    state.fs['/home/learner/projects/notes.txt'].sources = sources;
    assert.equal(validState(state),false);
  }
});
