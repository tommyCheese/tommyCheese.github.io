const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../js/comments.js'), 'utf8');

function run({ dark = false, present = true, lang = 'zh-CN' } = {}) {
  const config = {
    'data-repo': 'tommyCheese/tommyCheese.github.io', 'data-repo-id': 'R_kgDOMRkVTw',
    'data-category': 'Announcements', 'data-category-id': 'test-category',
    'data-term': '/blogs/h/', 'data-lang': lang
  };
  const scripts = [], messages = [], observers = [];
  let frame, click, load;
  const container = {
    getAttribute: name => config[name],
    querySelector(selector) { assert.equal(selector, 'iframe.giscus-frame'); return frame; }
  };
  vm.runInNewContext(source, {
    document: {
      querySelector(selector) { assert.equal(selector, '#comments .giscus'); return present ? container : null; },
      createElement(tag) {
        assert.equal(tag, 'script');
        return { attributes: {}, setAttribute(name, value) { this.attributes[name] = value; } };
      },
      getElementById(id) {
        assert.equal(id, 'theme-toggle');
        return { addEventListener(event, handler) { assert.equal(event, 'click'); click = handler; } };
      },
      body: {
        classList: { contains(name) { assert.equal(name, 'dark'); return dark; } },
        appendChild(script) { scripts.push(script); }
      }
    },
    MutationObserver: class {
      constructor(callback) { this.callback = callback; observers.push(this); }
      observe(target, options) { assert.equal(target, container); assert.equal(options.childList, true); }
      disconnect() { this.disconnected = true; }
    }
  });
  return {
    scripts, messages, observers, config,
    toggle() { dark = !dark; click(); },
    insertFrame() {
      frame = {
        addEventListener(event, handler) { assert.equal(event, 'load'); load = handler; },
        contentWindow: { postMessage(message, origin) { messages.push({ message: JSON.parse(JSON.stringify(message)), origin }); } }
      };
      observers[0].callback();
    },
    loadFrame() { load(); }
  };
}

test('pages without a comments container do not load giscus', () => {
  const state = run({ present: false });
  assert.equal(state.scripts.length, 0);
  assert.equal(state.observers.length, 0);
});

test('giscus receives shared article identity, locale, and the applied initial theme', () => {
  for (const lang of ['zh-CN', 'en', 'ja', 'ru', 'zh-TW']) {
    for (const dark of [false, true]) {
      const state = run({ lang, dark });
      assert.equal(state.scripts.length, 1);
      const script = state.scripts[0];
      assert.equal(script.src, 'https://giscus.app/client.js');
      assert.equal(script.async, true);
      assert.deepEqual(script.attributes, {
        ...state.config,
        'data-mapping': 'specific', 'data-strict': '1', 'data-reactions-enabled': '1',
        'data-emit-metadata': '0', 'data-input-position': 'top',
        crossorigin: 'anonymous', 'data-theme': dark ? 'dark' : 'light'
      });
    }
  }
});

test('both theme toggles update the iframe through its exact origin', () => {
  const state = run();
  state.insertFrame();
  state.loadFrame();
  state.toggle();
  assert.equal(state.scripts[0].attributes['data-theme'], 'dark');
  state.toggle();
  assert.equal(state.scripts[0].attributes['data-theme'], 'light');
  assert.deepEqual(state.messages, ['light', 'dark', 'light'].map(theme => ({
    message: { giscus: { setConfig: { theme } } }, origin: 'https://giscus.app'
  })));
  assert.equal(state.observers[0].disconnected, true);
});

test('a theme toggle before asynchronous iframe insertion is applied on load', () => {
  const state = run();
  state.toggle();
  assert.equal(state.scripts[0].attributes['data-theme'], 'dark');
  assert.equal(state.messages.length, 0);
  state.insertFrame();
  state.loadFrame();
  assert.deepEqual(state.messages, [{
    message: { giscus: { setConfig: { theme: 'dark' } } }, origin: 'https://giscus.app'
  }]);
});
