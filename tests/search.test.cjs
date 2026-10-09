const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../js/search.js'), 'utf8');
const entries = JSON.parse(fs.readFileSync(path.join(__dirname, '../index.json'), 'utf8'));
const dictionary = fs.readFileSync(path.join(__dirname, '../js/i18n-messages.js'), 'utf8');
const dictionaries = JSON.parse(dictionary.slice(dictionary.indexOf('{'), dictionary.lastIndexOf('}') + 1));

// Exercise the shipped script at its DOM event boundary, using the real index.
function searchUI({ locale = 'zh-CN', fetchIndex = async () => entries } = {}) {
  const messages = dictionaries[locale];
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
    querySelector() { return this.querySelectorAll()[0]; }
    click() { this.clicked = true; }
    scrollIntoView() {}
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
  document.createElementNS = () => new Element();
  const context = {
    document, navigator: { platform: 'MacIntel' },
    window: { siteI18n: {
      locale, prefix: locale === 'zh-CN' ? '' : '/' + locale,
      link: value => {
        const url = new URL(value, 'https://tommycheese.github.io');
        return (locale === 'zh-CN' ? '' : '/' + locale) + url.pathname + url.search + url.hash;
      },
      t: (key, values = {}) => messages[key].replace(/\{(\w+)\}/g, (_, name) => values[name])
    } },
    fetch: async () => ({ ok: true, json: fetchIndex })
  };
  vm.runInNewContext(source, context);
  return {
    input, results, status,
    options: () => results.querySelectorAll(),
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
  const initial = ui.titles();
  await ui.input.emit('compositionstart');
  ui.input.value = '整洁';
  await ui.input.emit('input', { isComposing: true });
  assert.deepEqual(ui.titles(), initial, 'unfinished IME text must retain the initial navigation');
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

test('opening search shows navigation and clearing a query restores it', async () => {
  const ui = searchUI();
  await ui.open();
  assert.deepEqual(ui.titles(), ['首页', '博客', '专题', '标签', '关于', '探索']);
  await ui.input.emit('keydown', { key: 'ArrowRight' });
  assert.equal(ui.input.attributes['aria-activedescendant'], ui.options()[1].id);
  await ui.input.emit('keydown', { key: 'ArrowDown' });
  assert.equal(ui.input.attributes['aria-activedescendant'], ui.options()[3].id);
  await ui.input.emit('keydown', { key: 'ArrowUp' });
  await ui.input.emit('keydown', { key: 'ArrowLeft' });
  assert.equal(ui.input.attributes['aria-activedescendant'], ui.options()[0].id);
  ui.input.value = '整洁';
  await ui.input.emit('input');
  ui.input.value = '';
  await ui.input.emit('input');
  assert.deepEqual(ui.titles(), ['首页', '博客', '专题', '标签', '关于', '探索']);
});

test('page keywords and aliases return the corresponding destinations', async () => {
  const ui = searchUI();
  await ui.open();
  for (const [query, href] of [['首页', '/'], ['博客', '/blogs/'], ['标签', '/tags/'], ['专题', '/topics/'], ['关于', '/#about'], ['探索', '/gallery/'], ['HOME', '/'], ['標籤', '/tags/']]) {
    ui.input.value = query;
    await ui.input.emit('input');
    assert.equal(ui.options()[0].href, href, query);
    assert.equal(ui.options()[0].className, 'spotlight-navigation');
  }
});

test('navigation and posts have distinct accessible groups and type labels', async () => {
  const ui = searchUI({ fetchIndex: async () => [{ title: '博客文章', description: '一篇文章', permalink: '/blogs/example/' }] });
  await ui.open();
  ui.input.value = '博客';
  await ui.input.emit('input');
  assert.deepEqual(ui.results.children.map(row => row.children[0].children[0].textContent), ['功能跳转', '文章搜索']);
  assert.deepEqual(ui.options().map(option => option.children[3].textContent), ['跳转', '文章']);
  assert.equal(ui.options()[0].href, '/blogs/');
  assert.equal(ui.options()[1].href, '/blogs/example/');
  assert.notEqual(ui.options()[0].id, ui.options()[1].id);
  await ui.input.emit('keydown', { key: 'ArrowDown' });
  assert.equal(ui.input.attributes['aria-activedescendant'], ui.options()[1].id);
  await ui.input.emit('keydown', { key: 'Enter' });
  assert.equal(ui.options()[1].clicked, true);
  await ui.input.emit('keydown', { key: 'ArrowDown' });
  await ui.input.emit('keydown', { key: 'Enter' });
  assert.equal(ui.options()[0].clicked, true);
});

test('each language uses its translated page name and keeps its language prefix', async () => {
  for (const locale of Object.keys(dictionaries)) {
    const ui = searchUI({ locale, fetchIndex: async () => [] });
    await ui.open();
    ui.input.value = dictionaries[locale]['nav.tags'];
    await ui.input.emit('input');
    assert.equal(ui.options()[0].href, (locale === 'zh-CN' ? '' : '/' + locale) + '/tags/');
    assert.equal(ui.titles()[0], dictionaries[locale]['nav.tags']);
  }
});

test('navigation works immediately and remains usable when the article index fails', async () => {
  let rejectIndex;
  const ui = searchUI({ fetchIndex: () => new Promise((_, reject) => { rejectIndex = reject; }) });
  await ui.open();
  ui.input.value = '首页';
  const pending = ui.input.emit('input');
  assert.equal(ui.options()[0].href, '/');
  await Promise.resolve();
  rejectIndex(new Error('offline'));
  await pending;
  assert.equal(ui.options()[0].href, '/');
  assert.equal(ui.status.textContent, dictionaries['zh-CN']['search.postsError']);
  await ui.input.emit('keydown', { key: 'Enter' });
  assert.equal(ui.options()[0].clicked, true);
});

test('a stale article response cannot replace the latest query', async () => {
  let resolveIndex;
  const ui = searchUI({ fetchIndex: () => new Promise(resolve => { resolveIndex = resolve; }) });
  await ui.open();
  ui.input.value = '博客';
  const pending = ui.input.emit('input');
  await Promise.resolve();
  ui.input.value = '';
  await ui.input.emit('input');
  resolveIndex([{ title: '博客文章', permalink: '/blogs/example/' }]);
  await pending;
  assert.deepEqual(ui.titles(), ['首页', '博客', '专题', '标签', '关于', '探索']);
});

test('the gallery index entry is not presented as an article', async () => {
  const ui = searchUI();
  await ui.open();
  ui.input.value = '探索';
  await ui.input.emit('input');
  assert.deepEqual(ui.titles(), ['探索']);
  assert.equal(ui.options()[0].className, 'spotlight-navigation');
});
