import test from 'node:test';
import assert from 'node:assert/strict';
import { Shell, seedState, evaluate } from '../linux-lab/shell.mjs';
import { lessons, manuals, levels, chapters, createLessonShell } from '../linux-lab/curriculum.mjs';
const fresh = extra => new Shell(seedState(extra), manuals);
test('each tier contains all ten topics with unique documented assignments', () => {
  assert.deepEqual(levels.map(item=>item.title), ['常用','进阶','大师']);
  for (const level of levels) for (const chapter of chapters) assert.ok(lessons.some(item=>item.level===level.id&&item.chapter===chapter.id), `${level.id}/${chapter.id}`);
  for (const manual of manuals) assert.ok(levels.some(level=>level.id===manual.level),manual.name);
  for (const lesson of lessons) assert.ok(levels.some(level=>level.id===lesson.level),lesson.id);
});
test('temporary files are unique, private and require an existing parent', () => {
  const shell=fresh();
  assert.equal(shell.execute('mktemp').stdout,'/tmp/tmp.000001\n');
  assert.equal(shell.execute('mktemp').stdout,'/tmp/tmp.000002\n');
  assert.equal(shell.state.fs['/tmp/tmp.000001'].mode,'600');
  assert.equal(shell.execute('mktemp -d /tmp/work.XXXXXX').code,0);
  assert.equal(shell.state.fs['/tmp/work.000001'].mode,'700');
  assert.equal(shell.execute('mktemp /missing/file.XXXXXX').code,1);
});
test('comm handles duplicate records, rejects unsorted inputs and preserves shared column', () => {
  const shell=fresh({files:{'a':'a\nb\nb\n','b':'b\nc\n','bad':'z\na\n'}});
  assert.equal(shell.execute('comm -12 a b').stdout,'b\n');
  assert.equal(shell.execute('comm -23 a b').stdout,'a\nb\n');
  assert.equal(shell.execute('comm bad b').code,1);
});
test('text processing respects tab stops and exposes its Unicode subset', () => {
  const shell=fresh({files:{'tab':'ab\tc\n','unicode':'奶酪\n'}});
  assert.equal(shell.execute('expand -t 4 tab').stdout,'ab  c\n');
  assert.equal(shell.execute('rev unicode').stdout,'酪奶\n');
  assert.equal(shell.execute('truncate -s 1 unicode').code,1);
  assert.equal(shell.execute('truncate -s 5 empty').code,0);
  assert.equal(shell.read('empty'),'\0'.repeat(5));
});
test('realpath follows final links, detects loops and rejects missing targets', () => {
  const shell=fresh();
  shell.execute('ln -s projects/notes.txt a');shell.execute('ln -s a b');
  assert.equal(shell.execute('realpath b').stdout,'/home/learner/projects/notes.txt\n');
  shell.execute('ln -s cycle2 cycle1');shell.execute('ln -s cycle1 cycle2');
  assert.equal(shell.execute('realpath cycle1').code,1);
  assert.equal(shell.execute('realpath absent').code,1);
});
test('seq rejects unbounded or invalid values and supports descending sequences', () => {
  const shell=fresh();
  assert.equal(shell.execute('seq 3 -1 1').stdout,'3\n2\n1\n');
  assert.equal(shell.execute('seq 1 0 3').code,1);
  assert.equal(shell.execute('seq 1001').code,1);
  assert.equal(shell.execute('seq 999999999999999999999').code,1);
});
test('selective archive task omits private data', () => {
  const lesson=lessons.find(item=>item.id==='selective-archive');
  const shell=createLessonShell(Shell,seedState,lesson);
  assert.equal(shell.execute(lesson.solution[0]).code,0);
  assert.deepEqual(Object.keys(shell.state.archives['/home/learner/delivery.tar']).sort(),['README.txt','config/app.conf','docs/guide.txt']);
});
test('reference-only tools cannot silently report success', () => {
  const shell=fresh();
  for (const command of ['ssh user@server','jq . file.json','mkfs -t ext4 /dev/sdb1']) assert.equal(shell.execute(command).code,1);
});
test('basic inspection and navigation work in every lesson', () => {
  for (const lesson of lessons) {
    const shell=createLessonShell(Shell,seedState,lesson);
    for (const command of ['pwd','ls -la','cd ~','tree projects','cat /etc/app.conf','head -n 1 /etc/app.conf','stat /etc/app.conf','history']) assert.equal(shell.execute(command).code,0,`${lesson.id}: ${command}`);
  }
});
test('lessons accept file goals created through alternative commands and redirection', () => {
  const lesson=lessons.find(item=>item.id==='new-readme');
  const shell=createLessonShell(Shell,seedState,lesson);
  const result=shell.execute('printf "" > projects/README.md; printf "" > "projects/交接 包/README.md"');
  assert.equal(result.code,0);
  assert.ok(evaluate(lesson.goals,shell.state,result).every(item=>item.done));
});

test('lesson completion suggests all supported commands', () => {
  const lesson=lessons.find(item=>item.id==='new-readme');
  const shell=createLessonShell(Shell,seedState,lesson);
  assert.ok(shell.complete('p').includes('pwd'));
  assert.ok(shell.complete('l').includes('ls'));
  assert.ok(shell.complete('t').includes('touch'));
  assert.ok(shell.complete('m').includes('mkdir'));
  assert.equal(shell.execute('mkdir other').code,0);
});
