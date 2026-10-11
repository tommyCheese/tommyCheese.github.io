import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Shell, HOME, seedState, evaluate } from '../linux-lab/shell.mjs';
import { lessons, chapters, manuals, createLessonShell } from '../linux-lab/curriculum.mjs';
const fresh = () => new Shell(seedState(), manuals);

test('curriculum has unique IDs, documented commands and isolated unsolved initial states', () => {
  assert.equal(lessons.length, new Set(lessons.map(item => item.id)).size);
  assert.equal(manuals.length, new Set(manuals.map(item => item.name)).size);
  for (const lesson of lessons) {
    assert.ok(chapters.some(item => item.id === lesson.chapter), lesson.id);
    assert.equal(lesson.hints.length, 3);
    assert.equal(lesson.commands.length, 1);
    assert.equal(lesson.command, lesson.commands[0]);
    for (const name of lesson.commands) assert.ok(manuals.some(item => item.name === name && item.practice), `${lesson.id}: ${name}`);
    const shell = createLessonShell(Shell, seedState, lesson);
    assert.ok(!evaluate(lesson.goals, shell.state).every(item => item.done), lesson.id + ' initially solved');
  }
});
for (const lesson of lessons) test('complete scenario: ' + lesson.id, () => {
  const shell = createLessonShell(Shell, seedState, lesson); let result;
  for (const command of lesson.solution) {
    result = shell.execute(command); assert.equal(result.stderr, '', `${lesson.id}: ${result.stderr}`);
    assert.ok(result.code === 0 || lesson.goals.some(goal => goal.code === result.code), lesson.id);
  }
  assert.ok(evaluate(lesson.goals, shell.state, result).every(goal => goal.done), lesson.id);
});
test('judges filesystem outcomes instead of requiring a specific command string', () => {
  const lesson = lessons.find(item => item.id === 'copy-note'); const shell = createLessonShell(Shell, seedState, lesson);
  const result = shell.execute('cp ./projects/notes.txt ./projects/notes.bak');
  assert.ok(evaluate(lesson.goals, shell.state, result).every(item => item.done));
  shell.state.fs[HOME + '/projects/notes.bak'].text = 'wrong';
  assert.ok(!evaluate(lesson.goals, shell.state).every(item => item.done));
});
test('every practice command has a dedicated level and wrong commands cannot mutate a level', () => {
  for (const manual of manuals.filter(item => item.practice)) assert.ok(lessons.some(item => item.command === manual.name), manual.name);
  const shell = createLessonShell(Shell, seedState, lessons[0]);
  assert.notEqual(shell.execute('touch wrong.txt').code, 0); assert.ok(!shell.state.fs[HOME + '/wrong.txt']);
  assert.equal(shell.execute('man pwd').code, 0);
});
test('output goals cannot be solved by just echoing the expected answer', () => {
  const lesson = lessons[0]; const shell = fresh();
  assert.ok(!evaluate(lesson.goals, shell.state, shell.execute('echo /home/learner')).every(item => item.done));
});
test('a fresh task cannot inherit a previous task filesystem', () => {
  const a = createLessonShell(Shell, seedState, lessons[0]); a.execute('touch leaked.txt');
  const b = createLessonShell(Shell, seedState, lessons[1]); assert.ok(!b.state.fs[HOME + '/leaked.txt']);
});
test('quotes preserve operators, empty strings, UTF-8 and escaped whitespace', () => {
  const shell = fresh();
  assert.equal(shell.execute('echo "a | b > c"').stdout, 'a | b > c\n');
  assert.equal(shell.execute('printf "%s\\n" "中文"').stdout, '中文\n');
  assert.equal(shell.execute('echo -e "a\\nb"').stdout, 'a\nb\n');
  assert.equal(shell.execute('touch "file with spaces.txt"').code, 0);
  assert.equal(shell.execute('echo ok > file\\ with\\ spaces.txt').code, 0);
  assert.equal(shell.read('file with spaces.txt'), 'ok\n');
  assert.equal(shell.execute('printf "%s" ""').stdout, '');
  assert.equal(shell.execute("echo '$HOME'").stdout, '$HOME\n');
});
test('variables expand at execution time across a command chain', () => {
  const shell = fresh();
  assert.equal(shell.execute('export NAME=cheese && echo "$NAME"').stdout, 'cheese\n');
  assert.equal(shell.execute('cd projects && echo "$PWD"').stdout, HOME + '/projects\n');
});
test('wildcards are relative to cwd and quoted patterns reach find unchanged', () => {
  const shell = fresh(); shell.execute('touch a.tmp b.tmp'); shell.execute('rm *.tmp');
  assert.ok(!shell.state.fs[HOME + '/a.tmp']); assert.ok(!shell.state.fs[HOME + '/b.tmp']);
  assert.equal(shell.execute('find . -name "*.log"').stdout, './logs/app.log\n');
  shell.execute('touch "*.txt"'); assert.ok(shell.state.fs[HOME + '/*.txt']);
});
test('redirection, append, stdin and pipelines retain stream semantics', () => {
  const shell = fresh(); shell.execute('echo first > result.txt'); shell.execute('echo second >> result.txt');
  assert.equal(shell.execute('cat < result.txt').stdout, 'first\nsecond\n');
  assert.equal(shell.execute('grep ERROR logs/app.log | wc -l').stdout, '2\n');
  assert.equal(shell.execute('cat result.txt > result.txt').code, 0); assert.equal(shell.read('result.txt'), '');
});
test('conditional chains respect exit status and malformed commands fail explicitly', () => {
  const shell = fresh(); assert.equal(shell.execute('false && touch bad.txt || touch good.txt').code, 0);
  assert.ok(!shell.state.fs[HOME + '/bad.txt']); assert.ok(shell.state.fs[HOME + '/good.txt']);
  for (const command of ['echo "broken', 'echo x |', 'echo x >', 'echo $(whoami)', 'ls --unknown', 'ssh user@server', 'echo hi &']) assert.notEqual(shell.execute(command).code, 0, command);
});
test('symlinks read their target, detect cycles, and rm removes just the link', () => {
  const shell = fresh(); shell.execute('ln -s projects/notes.txt link'); assert.equal(shell.read('link'), 'draft\n');
  shell.execute('echo changed > link'); assert.equal(shell.read('projects/notes.txt'), 'changed\n');
  shell.execute('rm link'); assert.ok(shell.state.fs[HOME + '/projects/notes.txt']);
  shell.execute('ln -s b a'); shell.execute('ln -s a b'); assert.notEqual(shell.execute('cat a').code, 0);
});
test('archives survive copy and move and restore nested content', () => {
  const shell = fresh(); shell.execute('tar -cf p.tar projects'); shell.execute('cp p.tar copy.tar'); shell.execute('mv copy.tar final.tar');
  shell.execute('rm -r projects'); shell.execute('tar -xf final.tar'); assert.equal(shell.read('projects/notes.txt'), 'draft\n');
  assert.equal(shell.execute('tar -tf final.tar').stdout, 'projects\nprojects/notes.txt\n');
});
test('moving a current directory keeps subsequent relative writes usable', () => {
  const shell = fresh(); assert.equal(shell.execute('cd projects; mv ../projects ../work; touch todo.txt').code, 0);
  assert.equal(shell.state.cwd, HOME + '/work'); assert.ok(shell.state.fs[HOME + '/work/todo.txt']);
});
test('permission modifications and umask are applied to new files only', () => {
  const shell = fresh(); shell.execute('chmod go-r deploy.sh'); assert.equal(shell.node('deploy.sh').mode, '600');
  shell.execute('umask 077; touch private.txt; mkdir private'); assert.equal(shell.node('private.txt').mode, '600'); assert.equal(shell.node('private').mode, '700');
  assert.equal(shell.node('README.txt').mode, '644');
});
test('service enable does not start it; teaching URLs never accept arbitrary hosts', () => {
  const shell = fresh(); shell.execute('systemctl enable nginx'); assert.equal(shell.state.services.nginx.active, false);
  assert.equal(shell.execute('systemctl status nginx').code, 3);
  assert.notEqual(shell.execute('curl https://other.example.com/').code, 0);
  shell.execute('systemctl start nginx'); assert.equal(shell.execute('systemctl status nginx').code, 0);
});
test('Tab completion uses supported commands and current virtual paths', () => {
  const shell = fresh(); assert.deepEqual(shell.complete('mkdi'), ['mkdir']); assert.deepEqual(shell.complete('cd pro'), ['projects/']);
  assert.deepEqual(shell.complete('cat logs/ap'), ['logs/app.log']);
});
test('shell state serializes and restores without sharing mutations', () => {
  const shell = fresh(); shell.execute('export PROJECT=demo; touch keep.txt'); const restored = new Shell(JSON.parse(JSON.stringify(shell.state)), manuals);
  restored.execute('rm keep.txt'); assert.ok(shell.state.fs[HOME + '/keep.txt']); assert.equal(restored.state.env.PROJECT, 'demo');
});
