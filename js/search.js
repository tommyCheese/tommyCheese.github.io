(() => {
  'use strict';
  const dialog = document.getElementById('search-content');
  const input = document.getElementById('spotlight-query');
  const results = document.getElementById('search-results');
  const status = document.getElementById('search-status');
  if (!dialog || !input || !window.siteI18n) return;
  const { t, prefix, link, locale } = window.siteI18n;
  const triggers = [...document.querySelectorAll('[data-search-open]')];
  let indexPromise;
  let request = 0;
  let selected = -1;
  let returnFocus;
  const normalize = value => String(value || '').normalize('NFKC').toLocaleLowerCase(locale);
  const iconPaths = {
    home: ['M3 10.5 12 3l9 7.5', 'M5 9v11h5v-6h4v6h5V9'],
    book: ['M12 5.5C9 3.5 5 3.5 3 4v15c3-.7 6-.4 9 1.5 3-1.9 6-2.2 9-1.5V4c-2-.5-6-.5-9 1.5Z', 'M12 5.5v15'],
    layers: ['m12 3 9 5-9 5-9-5 9-5Z', 'm3 12 9 5 9-5', 'm3 16 9 5 9-5'],
    tag: ['M3 4v6l10 10a2 2 0 0 0 3 0l4-4a2 2 0 0 0 0-3L10 3H4a1 1 0 0 0-1 1Z', 'M7.5 7.5h.01'],
    user: ['M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z', 'M4 21v-2a8 8 0 0 1 16 0v2'],
    compass: ['M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z', 'm16 8-2.5 5.5L8 16l2.5-5.5L16 8Z'],
    article: ['M14 3H5v18h14V8l-5-5Z', 'M14 3v5h5', 'M8 12h8', 'M8 16h6']
  };
  const destinations = [
    { title: 'page.home', path: '/', icon: 'home', aliases: ['首页', '主页', '首頁', '主頁', 'home'] },
    { title: 'nav.blogs', path: '/blogs/', icon: 'book', aliases: ['博客', '部落格', 'blog', 'posts'] },
    { title: 'nav.topics', path: '/topics/', icon: 'layers', aliases: ['专题', '專題', 'topics'] },
    { title: 'nav.tags', path: '/tags/', icon: 'tag', aliases: ['标签', '標籤', 'tags'] },
    { title: 'nav.about', path: '/#about', icon: 'user', aliases: ['关于', '關於', 'about'] },
    { title: 'nav.gallery', path: '/gallery/', icon: 'compass', aliases: ['探索', '相册', '相簿', 'explore', 'gallery'] }
  ];

  function createIcon(name) {
    const icon = document.createElement('span');
    icon.className = `spotlight-result-icon spotlight-icon-${name}`;
    icon.setAttribute('aria-hidden', 'true');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.8');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('focusable', 'false');
    iconPaths[name].forEach(data => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', data);
      svg.append(path);
    });
    icon.append(svg);
    return icon;
  }
  function showStatus(message) {
    status.textContent = message;
  }
  function clearResults() {
    results.replaceChildren();
    selected = -1;
    input.removeAttribute('aria-activedescendant');
    input.setAttribute('aria-expanded', 'false');
  }
  function select(index, scroll = false) {
    const options = [...results.querySelectorAll('[role="option"]')];
    if (!options.length) return;
    selected = (index + options.length) % options.length;
    options.forEach((option, position) => {
      const active = position === selected;
      option.classList.toggle('is-selected', active);
      option.setAttribute('aria-selected', String(active));
    });
    input.setAttribute('aria-activedescendant', options[selected].id);
    if (scroll) options[selected].scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }
  function appendGroup(items, navigation) {
    if (!items.length) return;
    const row = document.createElement('li');
    row.setAttribute('role', 'presentation');
    const group = document.createElement('div');
    group.setAttribute('role', 'group');
    const label = document.createElement('div');
    label.id = navigation ? 'search-navigation-heading' : 'search-posts-heading';
    label.className = 'spotlight-group-heading';
    label.textContent = t(navigation ? 'search.navigation' : 'search.posts');
    group.setAttribute('aria-labelledby', label.id);
    const list = document.createElement('ul');
    list.setAttribute('role', 'presentation');
    list.className = 'spotlight-group-list';
    const offset = results.querySelectorAll('[role="option"]').length;
    items.forEach((item, index) => {
      const entry = document.createElement('li');
      entry.setAttribute('role', 'presentation');
      const option = document.createElement('a');
      option.id = `search-option-${offset + index}`;
      option.className = navigation ? 'spotlight-navigation' : 'spotlight-post';
      option.href = link(item.path || item.permalink);
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', 'false');
      option.tabIndex = -1;
      const heading = document.createElement('span');
      heading.className = 'spotlight-title';
      heading.textContent = navigation ? t(item.title) : item.title;
      const description = document.createElement('span');
      description.className = 'spotlight-description';
      description.textContent = navigation ? t('search.goTo', { page: t(item.title) }) : item.description;
      const icon = createIcon(navigation ? item.icon : 'article');
      const type = document.createElement('span');
      type.className = 'spotlight-result-type';
      type.textContent = t(navigation ? 'search.navigate' : 'search.article');
      option.append(heading, description, icon, type);
      entry.append(option);
      list.append(entry);
    });
    group.append(label, list);
    row.append(group);
    results.append(row);
    input.setAttribute('aria-expanded', 'true');
    if (selected < 0) select(0);
  }
  function openSearch() {
    if (!dialog.open) {
      returnFocus = document.activeElement;
      dialog.showModal();
      document.body.classList.add('spotlight-open');
      search();
    }
    input.focus({ preventScroll: true });
    input.select();
  }
  function closeSearch() {
    if (!dialog.open) return;
    dialog.close();
    ++request;
    document.body.classList.remove('spotlight-open');
    input.value = '';
    clearResults();
    showStatus(t('search.prompt'));
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  }
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !event.isComposing) {
      event.preventDefault();
      event.stopPropagation();
      closeSearch();
      return;
    }
    if (event.key !== 'Tab') return;
    const close = dialog.querySelector('[data-search-close]');
    if (event.shiftKey && document.activeElement === input) {
      event.preventDefault();
      close.focus();
    } else if (!event.shiftKey && document.activeElement === close) {
      event.preventDefault();
      input.focus();
    }
  });
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    closeSearch();
  });
  dialog.querySelector('[data-search-close]').addEventListener('click', closeSearch);
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeSearch();
  });
  const onMac = /Mac|iPhone|iPad/.test(navigator.platform);
  triggers.forEach(trigger => {
    trigger.disabled = false;
    trigger.querySelector('[data-search-shortcut]').textContent = onMac ? '⌘ K' : 'Ctrl K';
    trigger.addEventListener('click', openSearch);
  });
  document.addEventListener('keydown', event => {
    if (!event.isComposing && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openSearch();
    }
  });
  input.addEventListener('keydown', event => {
    if (event.isComposing || !results.children.length) return;
    const suggestions = !input.value.trim();
    const step = suggestions ? 2 : 1;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      select(selected + (event.key === 'ArrowDown' ? step : -step), true);
    } else if (suggestions && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault();
      select(selected + (event.key === 'ArrowRight' ? 1 : -1), true);
    } else if (event.key === 'Enter') {
      const option = results.querySelectorAll('[role="option"]')[selected];
      if (option) { event.preventDefault(); option.click(); }
    }
  });
  results.addEventListener('click', event => {
    if (event.target.closest('a')) closeSearch();
  });
  async function search() {
    const query = input.value.trim();
    const currentRequest = ++request;
    clearResults();
    dialog.classList.toggle('spotlight-suggestions', !query);
    const needle = normalize(query);
    const navigation = destinations.filter(item => !needle ||
      [t(item.title), ...item.aliases].some(value => normalize(value).includes(needle)));
    appendGroup(navigation, true);
    if (!query) { showStatus(t('search.prompt')); return; }
    showStatus(t('search.loading'));
    try {
      if (!indexPromise) {
        indexPromise = fetch(prefix + '/index.json').then(response => {
          if (!response.ok) throw new Error('Search index unavailable');
          return response.json();
        }).catch(error => { indexPromise = undefined; throw error; });
      }
      const entries = await indexPromise;
      if (currentRequest !== request || !dialog.open) return;
      const matches = entries.filter(item => link(item.permalink).startsWith(prefix + '/blogs/')).map(item => {
        const fields = [item.title, (item.tags || []).join(' '), item.description, item.content];
        return { item, rank: fields.findIndex(value => normalize(value).includes(needle)) };
      }).filter(match => match.rank >= 0).sort((a, b) => a.rank - b.rank);
      const count = navigation.length + matches.length;
      showStatus(count ? t('search.results', { count }) : t('search.noResults', { query }));
      appendGroup(matches.map(({ item }) => item), false);
    } catch (_) {
      if (currentRequest === request && dialog.open) showStatus(t(navigation.length ? 'search.postsError' : 'search.error'));
    }
  }
  input.addEventListener('input', event => {
    if (!event.isComposing) return search();
  });
  input.addEventListener('compositionend', search);
})();
