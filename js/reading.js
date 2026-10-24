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

// One native dialog serves archive cards and homepage previews in the current edition.
(() => {
  const dialog = document.getElementById('content-preview');
  if (!dialog || typeof dialog.showModal !== 'function' || !window.siteI18n) return;
  const t = window.siteI18n.t;
  const body = document.getElementById('content-preview-body');
  const original = document.getElementById('content-preview-original');
  const kind = document.getElementById('content-preview-kind');
  let trigger;
  const element = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  function illustration(research) {
    const figure = element('figure', '', 'content-preview-illustration');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 720 260');
    svg.setAttribute('aria-hidden', 'true');
    // Decorative document/network motif, not a figure from the source paper.
    for (const [tag, attrs] of [
      ['path', { d: 'M150 130H280M440 130H570M360 65V195', stroke: 'currentColor', 'stroke-width': '2', 'stroke-dasharray': '6 8', fill: 'none' }],
      ['rect', { x: '280', y: '40', width: '160', height: '180', rx: '16', fill: 'var(--background-color)', stroke: 'currentColor', 'stroke-width': '2' }],
      ['path', { d: 'M310 78H375M310 102H410M310 126H410M310 150H380M310 174H397', stroke: 'currentColor', 'stroke-width': '5', 'stroke-linecap': 'round', opacity: '.5' }],
      ...[[150, 130], [570, 130], [220, 65], [500, 195]].map(([cx, cy]) => ['circle', { cx, cy, r: '16', fill: 'var(--background-color)', stroke: 'currentColor', 'stroke-width': '3' }])
    ]) {
      const shape = document.createElementNS('http://www.w3.org/2000/svg', tag);
      Object.entries(attrs).forEach(([key, value]) => shape.setAttribute(key, value));
      svg.append(shape);
    }
    figure.append(svg, element('figcaption', t(research ? 'content.illustration' : 'content.newsIllustration')));
    return figure;
  }
  function open(card, link) {
    trigger = link;
    const copy = card.querySelector('.news-copy').cloneNode(true);
    copy.className = 'content-preview-copy';
    copy.querySelector('.news-meta').remove();
    const heading = element('h2', card.querySelector('h3').textContent);
    heading.id = 'content-preview-title';
    copy.querySelector('h3').replaceWith(heading);
    copy.querySelectorAll('.news-category').forEach(tag => {
      tag.replaceWith(element('span', tag.textContent, 'news-category'));
    });
    const summary = copy.querySelector('p');
    summary.replaceWith(card.querySelector('template[data-editorial]').content.cloneNode(true));
    const info = element('section', '', 'content-preview-info');
    info.append(element('h3', t('content.sourceDetails')));
    const details = element('dl');
    for (const [field, label] of [
      ['previewSource', 'content.source'], ['previewPublishedAt', 'research.published'],
      ['previewCollectedAt', 'research.collected'], ['previewVenue', 'content.venue']
    ]) {
      const value = card.dataset[field];
      if (!value) continue;
      const entry = element('dd');
      if (field.endsWith('At')) {
        const date = element('time', value);
        date.dateTime = value;
        entry.append(date);
      } else entry.textContent = value;
      details.append(element('dt', t(label)), entry);
    }
    info.append(details);
    copy.append(info);
    const image = card.querySelector(':scope > img');
    let cover = illustration(Boolean(card.dataset.researchId));
    if (image) {
      cover = image.cloneNode(true);
      cover.classList.add('content-preview-cover');
      cover.loading = 'eager';
      cover.alt = t('content.cover');
      cover.addEventListener('error', () => {
        cover.replaceWith(illustration(Boolean(card.dataset.researchId)));
        copy.querySelector('.news-image-credit')?.remove();
      }, { once: true });
    }
    body.replaceChildren(...(image ? [cover, copy] : [copy]));
    original.href = link.href;
    kind.textContent = t(card.dataset.researchId ? 'content.researchPreview' : 'content.newsPreview');
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('content-preview-open');
  }
  document.querySelectorAll('.news-card').forEach(card => {
    const link = card.querySelector('.news-main-link');
    if (!card.querySelector('template[data-editorial]')) return;
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-controls', 'content-preview');
    card.querySelector('.news-preview-hint').hidden = false;
    card.addEventListener('click', event => {
      if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const interactive = event.target.closest('a, button, input, select');
      if (interactive && interactive !== link) return;
      event.preventDefault();
      open(card, link);
    });
  });
  const close = dialog.querySelector('[data-preview-close]');
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const stops = [...dialog.querySelectorAll('button, a[href]')];
    const first = stops[0], last = stops[stops.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });
  let backdropPress = false;
  const outside = event => {
    const rect = dialog.getBoundingClientRect();
    return event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom);
  };
  dialog.addEventListener('pointerdown', event => { backdropPress = outside(event); });
  dialog.addEventListener('click', event => { if (backdropPress && outside(event)) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('content-preview-open');
    body.replaceChildren();
    trigger?.focus({ preventScroll: true });
  });
})();
