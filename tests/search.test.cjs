const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../js/search.js'), 'utf8');
const entries = JSON.parse(fs.readFileSync(path.join(__dirname, '../index.json'), 'utf8'));
const dictionary = fs.readFileSync(path.join(__dirname, '../js/i18n-messages.js'), 'utf8');
const messages = JSON.parse(dictionary.slice(dictionary.indexOf('{'), dictionary.lastIndexOf('}') + 1))['zh-CN'];

// Exercise the shipped script at its DOM event boundary, using the real index.
function searchUI() {
  class Element {
    constructor() {
      this.children = [];
      this.attributes = {};
      this.events = {};
      this.value = '';
      const classes = new Set();
      this.classList = {
        add: name => classes.add(name),
        remove: name => classes.delete(name),
        toggle: (name, enabled) => enabled ? classes.add(name) : classes.delete(name)
      };
    }
    addEventListener(type, handler) { (this.events[type] ??= []).push(handler); }
    async emit(type, properties = {}) {
      for (const handler of this.events[type] || []) {
        await handler({ target: this, preventDefault() {}, stopPropagation() {}, ...properties });
      }
    }
    setAttribute(name, value) { this.attributes[name] = value; }
    removeAttribute(name) { delete this.attributes[name]; }
    append(...children) { this.children.push(...children); }
    replaceChildren(...children) { this.children = children; }
    querySelectorAll() {
      return this.children.flatMap(child => [child, ...child.querySelectorAll()])
        .filter(child => child.attributes.role === 'option');
    }
    focus() { document.activeElement = this; }
    select() {}
  }
  const dialog = new Element();
  const input = new Element();
  const results = new Element();
  const status = new Element();
  const close = new Element();
  dialog.querySelector = () => close;
  dialog.showModal = () => { dialog.open = true; };
  dialog.close = () => { dialog.open = false; };
  const elements = { 'search-content': dialog, 'spotlight-query': input, 'search-results': results, 'search-status': status };
  const document = new Element();
  document.body = new Element();
  document.getElementById = id => elements[id];
  document.querySelectorAll = () => [];
  document.createElement = () => new Element();
  const context = {
    document, navigator: { platform: 'MacIntel' },
    window: { siteI18n: {
      locale: 'zh-CN', prefix: '', link: value => value,
      t: (key, values = {}) => messages[key].replace(/\{(\w+)\}/g, (_, name) => values[name])
    } },
    fetch: async () => ({ ok: true, json: async () => entries })
  };
  vm.runInNewContext(source, context);
  return {
    input, results, status,
    open: () => document.emit('keydown', { ctrlKey: true, key: 'k' }),
    titles: () => results.querySelectorAll().map(option => option.children[0].textContent)
  };
}

test('ordinary Chinese input immediately displays matching posts', async () => {
  const ui = searchUI();
  await ui.open();
  ui.input.value = '整洁';
  await ui.input.emit('input', { isComposing: false });
  assert.ok(ui.titles().some(title => title.includes('整洁')));
});

test('confirming IME text displays posts without deleting a character', async () => {
  const ui = searchUI();
  await ui.open();
  await ui.input.emit('compositionstart');
  ui.input.value = '整洁';
  await ui.input.emit('input', { isComposing: true });
  assert.equal(ui.results.children.length, 0);
  await ui.input.emit('compositionend');
  assert.ok(ui.titles().some(title => title.includes('整洁')), 'IME confirmation must trigger results immediately');
});

test('a final non-composing input event after confirmation retains the results', async () => {
  const ui = searchUI();
  await ui.open();
  await ui.input.emit('compositionstart');
  ui.input.value = '整洁';
  await ui.input.emit('input', { isComposing: true });
  await ui.input.emit('compositionend');
  const confirmed = ui.titles();
  await ui.input.emit('input', { isComposing: false });
  assert.ok(confirmed.length > 0);
  assert.deepEqual(ui.titles(), confirmed);
});

test('deleting a character after IME confirmation triggers matching posts', async () => {
  const ui = searchUI();
  await ui.open();
  await ui.input.emit('compositionstart');
  ui.input.value = '整洁';
  await ui.input.emit('input', { isComposing: true });
  await ui.input.emit('compositionend');
  ui.input.value = '整';
  await ui.input.emit('input', { isComposing: false });
  assert.ok(ui.titles().some(title => title.includes('整洁')));
});
