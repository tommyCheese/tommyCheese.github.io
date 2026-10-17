const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const script = fs.readFileSync(require('node:path').join(__dirname, '../js/reading.js'), 'utf8');

function setup({ now = '2026-10-14T17:00:00Z', href = 'http://localhost/news/', research = false } = {}) {
  function element(extra = {}) {
    return Object.assign({ hidden: false, disabled: false, value: '', events: {}, attrs: {},
      addEventListener(name, fn) { this.events[name] = fn; },
      setAttribute(key, value) { this.attrs[key] = value; },
      setCustomValidity(message) { this.error = message; },
      focus() {}, scrollIntoView() { this.scrolled = true; }
    }, extra);
  }
  const dates = ['2026-10-15', '2026-10-14', '2026-10-09', '2026-10-08'];
  const days = dates.map((date, index) => {
    const labels = research ? ['ai agents papers', 'ai conferences'] : ['ai', 'devices'];
    const cards = labels.map((label, i) => element({ dataset: { newsTags: index === 1 && i === 0 ? labels[1] : label } }));
    const count = element();
    return element({ id: (research ? 'research-' : 'news-') + date, dataset: { newsDate: date },
      cards, count, querySelectorAll: () => cards, querySelector: () => count });
  });
  const tags = ['all', ...(research ? ['ai', 'agents', 'papers', 'conferences'] : ['ai', 'devices'])]
    .map(tag => element({ dataset: { newsTag: tag } }));
  const cardTag = element({ dataset: { newsTag: research ? 'papers' : 'ai' } });
  const buttons = ['all', 'today', 'week', 'range'].map(mode => element({ dataset: { newsPeriod: mode } }));
  const ids = Object.fromEntries(['news-date-filter', 'news-start', 'news-end', 'news-custom-dates', 'news-filter-status', 'news-filter-empty', 'news-timeline'].map(id => [id, element()]));
  const form = ids['news-date-filter'];
  form.dataset = { catalog: research ? 'research' : 'news' };
  form.querySelectorAll = () => buttons;
  form.reportValidity = () => !ids['news-end'].error && [ids['news-start'], ids['news-end']].every(input => input.disabled || input.value);
  const events = {};
  const location = new URL(href);
  const historyEntries = [location.href]; let position = 0;
  const history = {
    pushState(_, __, url) { historyEntries.splice(++position); historyEntries.push(String(url)); location.href = String(url); },
    replaceState(_, __, url) { historyEntries[position] = location.href = String(url); },
    back() { if (position) { location.href = historyEntries[--position]; events.popstate(); } },
    forward() { if (position + 1 < historyEntries.length) { location.href = historyEntries[++position]; events.popstate(); } }
  };
  const context = {
    document: { getElementById: id => ids[id], querySelectorAll: selector => selector === '[data-news-date]' ? days : selector === '[data-news-tag]' ? [...tags, cardTag] : [] },
    window: { siteI18n: { t: (key, values) => values ? (key.endsWith('.count') ? String(values.count) : `${values.count}/${values.days}`) : key }, addEventListener: (event, handler) => { events[event] = handler; } },
    location, history, URL, Intl, Date: class extends Date { constructor(...args) { super(...(args.length ? args : [now])); } }
  };
  vm.runInNewContext(script, context);
  const click = (link, extra = {}) => link.events.click({ preventDefault() {}, ...extra });
  return { ids, days, buttons, tags, cardTag, events, location, history,
    choose: mode => buttons.find(button => button.dataset.newsPeriod === mode).events.click(),
    tag: value => click(tags.find(link => link.dataset.newsTag === value)),
    click,
    submit: () => form.events.submit({ preventDefault() {} }),
    visible: () => days.filter(day => !day.hidden).map(day => day.dataset.newsDate)
  };
}

test('today uses Shanghai date, and the last seven days include both boundaries', () => {
  const state = setup();
  assert.equal(state.ids['news-date-filter'].hidden, false);
  assert.equal(state.ids['news-filter-status'].textContent, '8/4');
  state.choose('today');
  assert.deepEqual(state.visible(), ['2026-10-15']);
  state.choose('week');
  assert.deepEqual(state.visible(), ['2026-10-15', '2026-10-14', '2026-10-09']);
  assert.equal(state.buttons.find(button => button.dataset.newsPeriod === 'week').attrs['aria-pressed'], 'true');
  state.choose('all');
  assert.equal(state.visible().length, 4);
});

test('single dates, inclusive ranges, invalid ranges and empty results', () => {
  const state = setup();
  state.choose('range');
  assert.equal(state.ids['news-end'].disabled, false);
  state.ids['news-start'].value = state.ids['news-end'].value = '2026-10-14';
  state.submit();
  assert.deepEqual(state.visible(), ['2026-10-14']);
  state.ids['news-start'].value = '2026-10-09';
  state.ids['news-end'].value = '2026-10-14';
  state.submit();
  assert.deepEqual(state.visible(), ['2026-10-14', '2026-10-09']);
  state.ids['news-start'].value = '2026-10-15';
  state.submit();
  assert.equal(state.ids['news-end'].error, 'news.filter.invalidRange');
  assert.deepEqual(state.visible(), ['2026-10-14', '2026-10-09']);
  state.ids['news-start'].value = '';
  state.submit();
  assert.equal(state.visible().length, 2);
  state.ids['news-start'].value = state.ids['news-end'].value = '2026-10-10';
  state.submit();
  assert.deepEqual(state.visible(), []);
  assert.equal(state.ids['news-filter-empty'].hidden, false);
  assert.equal(state.ids['news-timeline'].hidden, true);
  state.choose('all');
  assert.equal(state.ids['news-filter-empty'].hidden, true);
  assert.equal(state.ids['news-timeline'].hidden, false);
});

test('hash navigation restores a day hidden by an active filter', () => {
  const state = setup();
  state.choose('today');
  state.location.hash = '#news-2026-10-08';
  state.events.hashchange();
  assert.equal(state.visible().length, 4);
  assert.equal(state.days.at(-1).scrolled, true);
});

test('clickable tags intersect dates, hide empty groups and update counts', () => {
  const state = setup();
  state.tag('ai');
  assert.deepEqual(state.visible(), ['2026-10-15', '2026-10-09', '2026-10-08']);
  assert.equal(state.ids['news-filter-status'].textContent, '3/3');
  assert.equal(state.days[0].count.textContent, '1');
  assert.equal(state.tags[1].attrs['aria-current'], 'true');
  state.choose('today');
  assert.equal(state.ids['news-filter-status'].textContent, '1/1');
  state.tag('devices');
  assert.equal(state.ids['news-filter-status'].textContent, '1/1');
  state.choose('all'); state.choose('range');
  state.ids['news-start'].value = state.ids['news-end'].value = '2026-10-14'; state.submit();
  state.tag('ai');
  assert.equal(state.ids['news-filter-empty'].hidden, false);
  state.tag('all');
  assert.equal(state.ids['news-filter-status'].textContent, '2/1');
});

test('shared URL and reload restore tag plus inclusive range in any language', () => {
  const href = 'http://localhost/ja/news/?v=abc&tag=ai&period=range&start=2026-10-09&end=2026-10-14';
  const state = setup({ href });
  assert.deepEqual(state.visible(), ['2026-10-09']);
  assert.equal(state.ids['news-start'].value, '2026-10-09');
  state.tag('devices');
  const url = state.location;
  assert.equal(url.pathname, '/ja/news/'); assert.equal(url.searchParams.get('v'), 'abc');
  assert.equal(url.searchParams.get('period'), 'range');
  assert.equal(url.searchParams.get('start'), '2026-10-09');
  assert.equal(setup({ href: url.href }).ids['news-filter-status'].textContent, '3/2');
});

test('back and forward restore filters, card tags work, modifier clicks stay native', () => {
  const state = setup();
  state.click(state.cardTag, { ctrlKey: true });
  assert.equal(state.location.search, '');
  state.click(state.cardTag);
  state.choose('today');
  state.history.back(); assert.equal(state.ids['news-filter-status'].textContent, '3/3');
  state.history.back(); assert.equal(state.ids['news-filter-status'].textContent, '8/4');
  state.history.forward(); assert.equal(state.ids['news-filter-status'].textContent, '3/3');
  state.location.hash = '#news-2026-10-14'; state.events.hashchange();
  assert.equal(state.ids['news-filter-status'].textContent, '8/4');
  assert.equal(state.location.searchParams.has('tag'), false);
});

test('research supports overlapping tags and the same date controls', () => {
  const state = setup({ research: true, href: 'http://localhost/research/?tag=agents' });
  assert.equal(state.ids['news-filter-status'].textContent, '3/3');
  state.tag('conferences'); assert.equal(state.ids['news-filter-status'].textContent, '5/4');
  state.choose('today'); assert.equal(state.ids['news-filter-status'].textContent, '1/1');
  state.click(state.cardTag); assert.equal(state.location.searchParams.get('tag'), 'papers');
  assert.equal(state.location.pathname, '/research/');
});

test('invalid or unknown URL filters fall back safely without losing unrelated parameters', () => {
  for (const query of ['tag=unknown&period=wrong', 'period=range&start=2026-02-30&end=2026-10-15', 'period=range&start=2026-10-15&end=2026-10-14']) {
    const state = setup({ href: 'http://localhost/news/?v=abc&' + query });
    assert.equal(state.ids['news-filter-status'].textContent, '8/4');
    assert.equal(state.location.search, '?v=abc');
  }
});
