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
  function openSearch() {
    if (!dialog.open) {
      returnFocus = document.activeElement;
      dialog.showModal();
      document.body.classList.add('spotlight-open');
      showStatus(t('search.prompt'));
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
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      select(selected + (event.key === 'ArrowDown' ? 1 : -1), true);
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
      const normalize = value => String(value || '').normalize('NFKC').toLocaleLowerCase(locale);
      const needle = normalize(query);
      const matches = entries.map(item => {
        const fields = [item.title, (item.tags || []).join(' '), item.description, item.content];
        return { item, rank: fields.findIndex(value => normalize(value).includes(needle)) };
      }).filter(match => match.rank >= 0).sort((a, b) => a.rank - b.rank);
      if (!matches.length) { showStatus(t('search.noResults', { query })); return; }
      showStatus(t('search.results', { count: matches.length }));
      matches.forEach(({ item }, index) => {
        const row = document.createElement('li');
        row.setAttribute('role', 'presentation');
        const option = document.createElement('a');
        option.id = `search-option-${index}`;
        option.href = link(item.permalink);
        option.setAttribute('role', 'option');
        option.setAttribute('aria-selected', 'false');
        option.tabIndex = -1;
        const heading = document.createElement('span');
        heading.className = 'spotlight-title';
        heading.textContent = item.title;
        const description = document.createElement('span');
        description.className = 'spotlight-description';
        description.textContent = item.description;
        option.append(heading, description);
        row.append(option);
        results.append(row);
      });
      input.setAttribute('aria-expanded', 'true');
      select(0);
    } catch (_) {
      if (currentRequest === request && dialog.open) showStatus(t('search.error'));
    }
  }
  input.addEventListener('input', event => {
    if (!event.isComposing) return search();
  });
  input.addEventListener('compositionend', search);
})();
