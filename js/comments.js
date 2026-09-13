(() => {
  const container = document.querySelector('#comments .giscus');
  if (!container) return;

  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.async = true;
  for (const name of ['repo', 'repo-id', 'category', 'category-id', 'term', 'lang']) {
    script.setAttribute('data-' + name, container.getAttribute('data-' + name));
  }
  for (const [name, value] of Object.entries({
    'data-mapping': 'specific', 'data-strict': '1', 'data-reactions-enabled': '1',
    'data-emit-metadata': '0', 'data-input-position': 'top',
    crossorigin: 'anonymous'
  })) script.setAttribute(name, value);

  function syncTheme() {
    const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
    script.setAttribute('data-theme', theme);
    container.querySelector('iframe.giscus-frame')?.contentWindow?.postMessage(
      { giscus: { setConfig: { theme } } }, 'https://giscus.app'
    );
  }

  // The client inserts its iframe asynchronously; synchronize once it has loaded.
  const observer = new MutationObserver(() => {
    const frame = container.querySelector('iframe.giscus-frame');
    if (!frame) return;
    frame.addEventListener('load', syncTheme);
    observer.disconnect();
  });
  observer.observe(container, { childList: true });
  document.getElementById('theme-toggle')?.addEventListener('click', syncTheme);
  syncTheme();
  document.body.appendChild(script);
})();
