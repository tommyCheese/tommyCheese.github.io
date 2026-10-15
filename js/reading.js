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

// The static timeline remains complete when JavaScript is unavailable.
(() => {
  const form = document.getElementById('news-date-filter');
  if (!form) return;
  const t = window.siteI18n.t;
  const days = [...document.querySelectorAll('[data-news-date]')];
  const buttons = [...form.querySelectorAll('[data-news-period]')];
  const start = document.getElementById('news-start');
  const end = document.getElementById('news-end');
  const custom = document.getElementById('news-custom-dates');
  const status = document.getElementById('news-filter-status');
  const empty = document.getElementById('news-filter-empty');
  let mode = 'all';
  const today = () => new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date());
  start.value = end.value = today();

  function apply() {
    let from = '', to = '';
    end.setCustomValidity('');
    if (mode === 'range') {
      if (start.value && end.value && start.value > end.value) {
        end.setCustomValidity(t('news.filter.invalidRange'));
      }
      if (!form.reportValidity()) return;
      from = start.value;
      to = end.value;
    } else if (mode === 'today' || mode === 'week') {
      from = to = today();
      if (mode === 'week') {
        const first = new Date(from + 'T00:00:00Z');
        first.setUTCDate(first.getUTCDate() - 6);
        from = first.toISOString().slice(0, 10);
      }
    }
    let count = 0, dateCount = 0;
    days.forEach(day => {
      const date = day.dataset.newsDate;
      day.hidden = Boolean((from && date < from) || (to && date > to));
      if (!day.hidden) {
        count += day.querySelectorAll('[data-news-id]').length;
        dateCount++;
      }
    });
    status.textContent = t('news.filter.results', { count, days: dateCount });
    empty.hidden = count > 0;
    document.getElementById('news-timeline').hidden = !count;
  }

  function select(value) {
    mode = value;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.newsPeriod === mode)));
    custom.hidden = mode !== 'range';
    start.disabled = custom.hidden;
    end.disabled = custom.hidden;
    end.setCustomValidity('');
    if (custom.hidden) apply();
    else start.focus();
  }
  buttons.forEach(button => button.addEventListener('click', () => select(button.dataset.newsPeriod)));
  form.addEventListener('submit', event => { event.preventDefault(); apply(); });
  // Clear a previous validation message as soon as either boundary is edited.
  form.addEventListener('input', () => end.setCustomValidity(''));
  // Browser back/forward navigation must never land on a filtered-out day.
  window.addEventListener('hashchange', () => {
    const target = days.find(day => '#' + day.id === location.hash);
    if (target?.hidden) {
      select('all');
      target.scrollIntoView();
    }
  });
  select('all');
  form.hidden = false;
})();
