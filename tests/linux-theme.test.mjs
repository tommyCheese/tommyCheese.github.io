import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../linux-lab/theme.js', import.meta.url), 'utf8');
test('appearance follows system, persists explicit choice and tolerates unavailable storage', () => {
  for (const [saved, systemDark, blocked, expected] of [
    [null, false, false, 'light'], [null, true, false, 'dark'],
    ['light', true, false, 'light'], ['dark', false, false, 'dark'],
    ['invalid', false, false, 'light'], [null, true, true, 'dark']
  ]) {
    const listeners = {}; const attributes = {}; let stored = saved;
    const button = { setAttribute: (key, value) => { attributes[key] = value; }, addEventListener: (key, fn) => { listeners[key] = fn; } };
    const document = {
      documentElement: { dataset: {} }, getElementById: () => button,
      createElement: () => button,
      querySelector: selector => selector === 'header nav' ? { append() {} } : null,
      addEventListener: (_, fn) => fn()
    };
    const system = { matches: systemDark, addEventListener: (_, fn) => { listeners.system = fn; } };
    runInNewContext(source, { document, matchMedia: () => system,
      localStorage: { getItem: () => { if (blocked) throw Error(); return stored; }, setItem: (_, value) => { if (blocked) throw Error(); stored = value; } },
      window: { addEventListener: (_, fn) => { listeners.storage = fn; } }
    });
    assert.equal(document.documentElement.dataset.theme, expected);
    system.matches = !systemDark; listeners.system();
    assert.equal(document.documentElement.dataset.theme, ['light','dark'].includes(saved) ? expected : system.matches ? 'dark' : 'light');
    const before = document.documentElement.dataset.theme;
    listeners.click();
    const chosen = before === 'dark' ? 'light' : 'dark';
    assert.equal(document.documentElement.dataset.theme, chosen);
    assert.equal(attributes['aria-pressed'], String(chosen === 'dark'));
    if (!blocked) assert.equal(stored, chosen);
    system.matches = !system.matches; listeners.system();
    assert.equal(document.documentElement.dataset.theme, chosen);
    listeners.storage({ key:'learn-linux-theme', newValue:'dark' });
    assert.equal(document.documentElement.dataset.theme, 'dark');
  }
});
