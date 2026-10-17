// Native details remain usable without JavaScript; close after choosing a chapter.
document.querySelectorAll('.mobile-toc a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    link.closest('details').open = false;
    const heading = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  });
});

// Both archives share tag/date filtering; static content remains readable without JS.
(() => {
  const form = document.getElementById('news-date-filter');
  if (!form || !window.siteI18n) return;
  const t = window.siteI18n.t;
  const collection = form.dataset.catalog;
  const days = [...document.querySelectorAll('[data-news-date]')];
  const tags = [...document.querySelectorAll('[data-news-tag]')];
  const buttons = [...form.querySelectorAll('[data-news-period]')];
  const start = document.getElementById('news-start');
  const end = document.getElementById('news-end');
  const custom = document.getElementById('news-custom-dates');
  const status = document.getElementById('news-filter-status');
  const empty = document.getElementById('news-filter-empty');
  const allowedTags = new Set(tags.map(link => link.dataset.newsTag));
  const periods = new Set(buttons.map(button => button.dataset.newsPeriod));
  let tag = 'all', period = 'all', rangeStart = '', rangeEnd = '';
  const today = () => new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date());
  const validDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value || '') &&
    !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;

  function showMode(mode) {
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.newsPeriod === mode)));
    custom.hidden = mode !== 'range';
    start.disabled = end.disabled = custom.hidden;
    end.setCustomValidity('');
  }

  function writeURL(push = true) {
    const url = new URL(location.href);
    ['tag', 'period', 'start', 'end'].forEach(key => url.searchParams.delete(key));
    if (tag !== 'all') url.searchParams.set('tag', tag);
    if (period !== 'all') url.searchParams.set('period', period);
    if (period === 'range') {
      url.searchParams.set('start', rangeStart);
      url.searchParams.set('end', rangeEnd);
    }
    if (push) url.hash = '';
    if (url.href !== location.href) history[push ? 'pushState' : 'replaceState'](null, '', url);
  }

  function render() {
    let from = '', to = '';
    if (period === 'range') {
      from = rangeStart; to = rangeEnd;
    } else if (period === 'today' || period === 'week') {
      from = to = today();
      if (period === 'week') {
        const first = new Date(from + 'T00:00:00Z');
        first.setUTCDate(first.getUTCDate() - 6);
        from = first.toISOString().slice(0, 10);
      }
    }
    let count = 0, dateCount = 0;
    days.forEach(day => {
      const date = day.dataset.newsDate;
      const inDate = !((from && date < from) || (to && date > to));
      const cards = [...day.querySelectorAll('[data-news-tags]')];
      cards.forEach(card => {
        card.hidden = !inDate || (tag !== 'all' && !card.dataset.newsTags.split(' ').includes(tag));
      });
      const visible = cards.filter(card => !card.hidden).length;
      day.hidden = !visible;
      day.querySelector('.news-day-count').textContent = t(collection + '.count', { count: visible });
      if (visible) { count += visible; dateCount++; }
    });
    tags.forEach(link => link.setAttribute('aria-current', String(link.dataset.newsTag === tag)));
    status.textContent = t(collection + '.filter.results', { count, days: dateCount });
    empty.hidden = count > 0;
    document.getElementById('news-timeline').hidden = !count;
  }

  function readURL() {
    const params = new URL(location.href).searchParams;
    tag = allowedTags.has(params.get('tag')) ? params.get('tag') : 'all';
    period = periods.has(params.get('period')) ? params.get('period') : 'all';
    rangeStart = params.get('start'); rangeEnd = params.get('end');
    if (period === 'range' && (!validDate(rangeStart) || !validDate(rangeEnd) || rangeStart > rangeEnd)) period = 'all';
    start.value = period === 'range' ? rangeStart : today();
    end.value = period === 'range' ? rangeEnd : today();
    showMode(period);
    render();
  }

  buttons.forEach(button => button.addEventListener('click', () => {
    const mode = button.dataset.newsPeriod;
    showMode(mode);
    if (mode === 'range') start.focus();
    else { period = mode; render(); writeURL(); }
  }));
  tags.forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button > 0) return;
    event.preventDefault();
    tag = link.dataset.newsTag;
    render(); writeURL();
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    end.setCustomValidity(start.value && end.value && start.value > end.value ? t('news.filter.invalidRange') : '');
    if (!form.reportValidity() || !validDate(start.value) || !validDate(end.value)) return;
    period = 'range'; rangeStart = start.value; rangeEnd = end.value;
    showMode(period); render(); writeURL();
  });
  form.addEventListener('input', () => end.setCustomValidity(''));
  // A date anchor must remain reachable even after a tag/date filter hid its group.
  function revealAnchor() {
    const target = days.find(day => '#' + day.id === location.hash);
    if (target?.hidden) {
      tag = period = 'all';
      showMode(period); render(); writeURL(false);
      target.scrollIntoView();
    }
  }
  window.addEventListener('popstate', () => { readURL(); revealAnchor(); });
  window.addEventListener('hashchange', revealAnchor);
  readURL();
  revealAnchor();
  writeURL(false);
  form.hidden = false;
})();
