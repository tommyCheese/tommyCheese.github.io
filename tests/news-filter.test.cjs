const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const script = fs.readFileSync(require('node:path').join(__dirname, '../js/reading.js'), 'utf8');

function setup(now = '2026-10-14T17:00:00Z') {
  function element(extra = {}) {
    return Object.assign({ hidden: false, disabled: false, value: '', events: {}, attrs: {},
      addEventListener(name, fn) { this.events[name] = fn; },
      setAttribute(key, value) { this.attrs[key] = value; },
      setCustomValidity(message) { this.error = message; },
      focus() {}, scrollIntoView() { this.scrolled = true; }
    }, extra);
  }
  const dates = ['2026-10-15', '2026-10-14', '2026-10-09', '2026-10-08'];
  const days = dates.map(date => element({ id: 'news-' + date, dataset: { newsDate: date }, querySelectorAll: () => [{}, {}] }));
  const buttons = ['all', 'today', 'week', 'range'].map(mode => element({ dataset: { newsPeriod: mode } }));
  const ids = Object.fromEntries(['news-date-filter', 'news-start', 'news-end', 'news-end-field', 'news-custom-dates', 'news-filter-status', 'news-filter-empty', 'news-timeline'].map(id => [id, element()]));
  const form = ids['news-date-filter'];
  form.querySelectorAll = () => buttons;
  form.reportValidity = () => !ids['news-end'].error && [ids['news-start'], ids['news-end']].every(input => input.disabled || input.value);
  const events = {};
  const location = { hash: '' };
  const context = {
    document: { getElementById: id => ids[id], querySelectorAll: selector => selector === '[data-news-date]' ? days : [] },
    window: { siteI18n: { t: (key, values) => values ? `${values.count}/${values.days}` : key }, addEventListener: (event, handler) => { events[event] = handler; } },
    location, Intl, Date: class extends Date { constructor(...args) { super(...(args.length ? args : [now])); } }
  };
  vm.runInNewContext(script, context);
  return { ids, days, buttons, events, location,
    choose: mode => buttons.find(button => button.dataset.newsPeriod === mode).events.click(),
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
