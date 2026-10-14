/* Apply before paint; share the preference across practice and reference pages. */
(() => {
  const key = 'learn-linux-theme';
  const system = matchMedia('(prefers-color-scheme: dark)');
  let preference;
  try { preference = localStorage.getItem(key); } catch {}
  if (!['light', 'dark'].includes(preference)) preference = null;
  const apply = () => {
    const dark = (preference || (system.matches ? 'dark' : 'light')) === 'dark';
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    const button = document.getElementById('theme-toggle');
    if (button) {
      button.textContent = dark ? '☀' : '☾';
      button.setAttribute('aria-label', dark ? '切换为明亮模式' : '切换为暗色模式');
      button.setAttribute('aria-pressed', String(dark));
      button.title = dark ? '切换为明亮模式' : '切换为暗色模式';
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#252a28' : '#edf1eb');
  };
  apply();
  system.addEventListener('change', () => { if (!preference) apply(); });
  window.addEventListener('storage', event => {
    if (event.key !== key) return;
    preference = ['light', 'dark'].includes(event.newValue) ? event.newValue : null;
    apply();
  });
  document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('header nav');
    if (!nav) return;
    const button = document.createElement('button');
    button.id = 'theme-toggle'; button.type = 'button';
    button.addEventListener('click', () => {
      preference = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, preference); } catch {}
      apply();
    });
    nav.append(button); apply();
  });
})();
