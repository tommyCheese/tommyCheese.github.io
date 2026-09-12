const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const script = fs.readFileSync(path.join(__dirname, '../js/i18n.js'), 'utf8');
const messages = fs.readFileSync(path.join(__dirname, '../js/i18n-messages.js'), 'utf8');

function run({ locale = 'zh-CN', url = 'https://tommycheese.github.io/', saved, languages = ['zh-CN'], storageBlocked = false, pagePath = '/' } = {}) {
  const location = new URL(url);
  const redirects = [];
  location.replace = value => redirects.push(value);
  const events = {};
  const anchors = ['zh-CN', 'en', 'ja', 'ru', 'zh-TW'].map(code => ({
    dataset: { language: code }, href: (code === 'zh-CN' ? '' : '/' + code) + '/blogs/example/',
    addEventListener(name, handler) { this[name] = handler; }
  }));
  const context = {
    URL, encodeURIComponent, location, navigator: { languages },
    localStorage: { getItem() { if (storageBlocked) throw Error(); return saved; }, setItem(key, value) { if (storageBlocked) throw Error(); saved = value; } },
    document: { documentElement: { lang: locale, dataset: { pagePath } }, querySelectorAll: selector => selector === '[data-language]' ? anchors : [], addEventListener() {} },
    addEventListener(name, handler) { events[name] = handler; }
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(messages, context);
  vm.runInContext(script, context);
  return { api: context.siteI18n, redirects, location, anchors, events, saved: () => saved };
}

test('language negotiation respects explicit URLs and saved preferences', () => {
  assert.deepEqual(run({ saved: 'ru', languages: ['en'] }).redirects, ['/ru/']);
  assert.deepEqual(run({ saved: 'zh-CN', languages: ['ru'] }).redirects, []);
  assert.deepEqual(run({ languages: ['fr-FR', 'ja-JP'] }).redirects, ['/ja/']);
  assert.deepEqual(run({ languages: ['zh-Hant-HK'] }).redirects, ['/zh-TW/']);
  assert.deepEqual(run({ locale: 'en', url: 'https://tommycheese.github.io/en/', saved: 'ru' }).redirects, []);
  assert.deepEqual(run({ url: 'https://tommycheese.github.io/blogs/example/', saved: 'ru' }).redirects, []);
  assert.deepEqual(run({ saved: 'invalid', languages: ['de'], storageBlocked: true }).redirects, []);
});

test('links preserve encoded article slugs, query and anchor without double prefixes', () => {
  const { api } = run({ locale: 'ja', url: 'http://localhost:8765/ja/' });
  assert.equal(api.link('https://tommycheese.github.io/en/blogs/%E9%98%85%E8%AF%BB/?q=x#part'), '/ja/blogs/%E9%98%85%E8%AF%BB/?q=x#part');
  assert.equal(api.link('/ru/blogs/example/', 'zh-CN'), '/blogs/example/');
  assert.equal(api.link('https://example.com/en/blogs/'), 'https://example.com/en/blogs/');
});

test('language switch tracks a later table-of-contents anchor and stores selection', () => {
  const state = run({ locale: 'en', url: 'https://tommycheese.github.io/en/blogs/example/?view=full#one' });
  assert.equal(state.anchors[3].href, '/ru/blogs/example/?view=full#one');
  state.location.hash = '#two';
  state.events.hashchange();
  assert.equal(state.anchors[3].href, '/ru/blogs/example/?view=full#two');
  state.anchors[3].click();
  assert.equal(state.saved(), 'ru');
});

test('all five dictionaries cover the same keys and interpolate reading time', () => {
  for (const locale of ['zh-CN', 'en', 'ja', 'ru', 'zh-TW']) {
    const { api } = run({ locale });
    assert.equal(api.t('missing.key'), 'missing.key');
    assert.match(api.t('reading.minutes', { count: 12 }), /12/);
    assert.doesNotMatch(api.t('search.noResults', { query: '<img onerror=alert(1)>' }), /\{query\}/);
  }
});

test('GitHub Pages root 404 selects the requested edition without redirect loops', () => {
  assert.deepEqual(run({ url: 'https://tommycheese.github.io/ja/missing/', pagePath: '/404.html' }).redirects,
    ['/ja/404.html?from=%2Fja%2Fmissing%2F']);
  assert.deepEqual(run({ locale: 'ja', url: 'https://tommycheese.github.io/ja/404.html', pagePath: '/404.html' }).redirects, []);
  assert.deepEqual(run({ url: 'https://tommycheese.github.io/missing/', pagePath: '/404.html' }).redirects, []);
});
