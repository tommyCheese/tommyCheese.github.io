import test from 'node:test';
import assert from 'node:assert/strict';
import { PracticeHistory } from '../linux-lab/history.mjs';
import { Shell, seedState } from '../linux-lab/shell.mjs';
test('undo and redo restore independent filesystem snapshots', () => {
  const history = new PracticeHistory();
  const shell = new Shell(seedState());
  history.record(shell.state);
  shell.execute('touch sample.txt');
  const restored = history.undo(shell.state);
  assert.equal(restored.fs['/home/learner/sample.txt'], undefined);
  assert.equal(history.redo(restored).fs['/home/learner/sample.txt'].type, 'file');
});
test('new actions discard redo and retained history is bounded', () => {
  const history = new PracticeHistory(2);
  history.record({ n: 0 }); history.record({ n: 1 }); history.record({ n: 2 });
  assert.deepEqual(history.undo({ n: 3 }), { n: 2 });
  history.record({ n: 4 });
  assert.equal(history.redo({ n: 5 }), undefined);
  assert.deepEqual(history.undo({ n: 5 }), { n: 4 });
  assert.deepEqual(history.undo({ n: 4 }), { n: 1 });
  assert.equal(history.undo({ n: 1 }), undefined);
  history.clear(); assert.equal(history.redo({}), undefined);
});
