import test from 'node:test';
import assert from 'node:assert/strict';
import { editTerminalLine as edit } from '../linux-lab/terminal-keys.mjs';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

function terminalInput(value = '') {
  const listeners = {}, input = {
    value, selectionStart:value.length, selectionEnd:value.length,
    addEventListener(name, callback) { listeners[name] = callback; },
    setSelectionRange(start, end) { this.selectionStart = start; this.selectionEnd = end; }
  };
  const state = {history:['echo first','echo second'],cwd:'/home/learner'};
  const app = readFileSync(new URL('../linux-lab/app.mjs', import.meta.url),'utf8');
  const source = app.slice(app.indexOf("let killBuffer = ''"),app.indexOf('function updateHint('));
  const context = { $:()=>input, editTerminalLine:edit, shell:{state},
    historyCursor:state.history.length, draft:'', transcript:[], HOME:'/home/learner',
    appendTranscript() {}, renderTranscript() {}, persist() {}, announce() {} };
  runInNewContext(source,context);
  return {input,state,context,press(key,extra={}) {
    let prevented = false;
    listeners.keydown({key,ctrlKey:true,target:input,preventDefault(){prevented=true;},...extra});
    return prevented;
  }};
}

test('Ctrl+U and Ctrl+K cut only their side of the cursor and Ctrl+Y restores the text', () => {
  const value = 'echo hello world';
  const left = edit(value, 5, 5, 'u');
  assert.equal(left.value, 'hello world');
  assert.equal(left.killed, 'echo ');
  assert.equal(edit(left.value, 0, 0, 'y', left.killed).value, value);
  const right = edit(value, 5, 5, 'k');
  assert.equal(right.value, 'echo ');
  assert.equal(right.killed, 'hello world');
  assert.equal(edit(right.value, 5, 5, 'y', right.killed).value, value);
});

test('Ctrl+W uses whitespace boundaries, keeps paths intact and handles trailing spaces', () => {
  const value = 'cat ~/项目/a.txt   next';
  const result = edit(value, value.indexOf('next'), value.indexOf('next'), 'w');
  assert.equal(result.value, 'cat next');
  assert.equal(result.killed, '~/项目/a.txt   ');
  assert.equal(edit('   ', 3, 3, 'w').value, '');
  assert.equal(edit('abc', 0, 0, 'w').value, 'abc');
});

test('character movement and deletion never split surrogate pairs', () => {
  const value = 'a🧀中';
  assert.equal(edit(value, 3, 3, 'b').start, 1);
  assert.equal(edit(value, 1, 1, 'f').start, 3);
  assert.equal(edit(value, 3, 3, 'h').value, 'a中');
  assert.equal(edit(value, 1, 1, 'd').value, 'a中');
  assert.equal(edit(value, 3, 3, 'a').start, 0);
  assert.equal(edit(value, 0, 0, 'e').start, value.length);
});

test('editing respects selections and no-ops at empty boundaries', () => {
  assert.equal(edit('echo hello', 5, 10, 'w').value, 'echo ');
  assert.equal(edit('echo hello', 5, 10, 'y', 'world').value, 'echo world');
  for (const key of ['u','k','w','h','d','b','f','y']) {
    assert.equal(edit('', 0, 0, key).value, '');
    assert.equal(edit('', 0, 0, key).start, 0);
  }
  assert.equal(edit('echo', 0, 0, 'r'), null);
});

test('real key handler combines consecutive cuts across modifier presses and cancels without execution', () => {
  const terminal = terminalInput('echo one two');
  for (let i=0;i<2;i++) { terminal.press('Control'); assert.equal(terminal.press('w'),true); }
  assert.equal(terminal.input.value,'echo ');
  terminal.press('Control'); terminal.press('y');
  assert.equal(terminal.input.value,'echo one two');
  assert.equal(terminal.press('c'),true);
  assert.equal(terminal.input.value,'');
  assert.deepEqual(terminal.state.history,['echo first','echo second']);
  assert.match(terminal.context.transcript.at(-1).message,/echo one two\^C$/);
});

test('history shortcuts restore drafts, while copy and input methods retain their own keys', () => {
  const terminal = terminalInput('draft');
  terminal.press('p'); assert.equal(terminal.input.value,'echo second');
  terminal.press('p'); assert.equal(terminal.input.value,'echo first');
  terminal.press('n'); terminal.press('n'); assert.equal(terminal.input.value,'draft');
  assert.equal(terminal.press('u',{isComposing:true}),false);
  assert.equal(terminal.press('c',{shiftKey:true}),false);
  assert.equal(terminal.press('u',{altKey:true}),false);
  assert.equal(terminal.input.value,'draft');
});
