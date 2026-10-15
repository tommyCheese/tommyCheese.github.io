import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

// Exercise the actual layout animation without wall-clock or browser timing noise.
const app = readFileSync(new URL('../linux-lab/app.mjs', import.meta.url), 'utf8');
const source = app.slice(app.indexOf('function animateGuideLayout('), app.indexOf('function setGuideVisible('));
function animate(shown) {
  const motions = new Map();
  const ids = ['world-area', 'practice-area', 'terminal-resize'];
  const nodes = new Map([...ids, 'mission-window'].map(id => [id, {
    clientWidth: 348,
    style: { setProperty() {} },
    getBoundingClientRect: () => ({ x: 100, y: 0, width: 430 }),
    animate(frames, options) {
      const motion = { frames, options, finished: new Promise(() => {}) };
      motions.set(id, motion);
      return motion;
    }
  }]));
  nodes.set('workspace', { classList: { add() {} } });
  runInNewContext(source + '\nanimateGuideLayout(before, shown);', {
    $: id => nodes.get(id), guideLayoutIds: ids, activeMotions: new Map(),
    before: new Map(ids.map(id => [id, { x: 0, y: 0, width: 610 }])),
    shown, updateTerminalResize() {}
  });
  return motions;
}

test('guide grows leftward with a fixed right edge, in sync with the terminal', () => {
  const motions = animate(true);
  const guide = motions.get('mission-window');
  for (const motion of motions.values()) assert.deepEqual(motion.options, guide.options);
  assert.equal(guide.options.delay ?? 0, 0);
  assert.equal(guide.frames[0].width, '0px');
  assert.equal(guide.frames.at(-1).width, '430px');
  for (const progress of [0, .25, .5, .75, 1]) {
    const width = parseFloat(guide.frames.at(-1).width) * progress;
    const shift = parseFloat(guide.frames[0].translate) * (1 - progress);
    assert.equal(width + shift, 430, 'guide right edge must stay fixed throughout the slide');
  }
  assert.ok(guide.frames.every(frame => frame.opacity === undefined && frame.scale === undefined && frame.clipPath === undefined));
});

test('closing reverses the guide slide while the workspace expands', () => {
  const opening = animate(true), closing = animate(false);
  assert.deepEqual(Array.from(closing.get('mission-window').frames, frame => frame.width), Array.from(opening.get('mission-window').frames, frame => frame.width).reverse());
  assert.deepEqual(closing.get('practice-area').options, closing.get('mission-window').options);
});
