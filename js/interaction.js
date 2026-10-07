(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Keep the document visible if JS or an animation API is unavailable.
  if ('IntersectionObserver' in window && Element.prototype.animate) {
    const running = new Set();
    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (reducedMotion.matches) return;
        const animation = entry.target.animate([
          { opacity: 0, translate: '0 10px' },
          { opacity: 1, translate: '0 0' }
        ], { duration: 420, delay: Math.min(index * 45, 135), easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'backwards' });
        running.add(animation);
        animation.finished.then(() => running.delete(animation), () => running.delete(animation));
      });
    }, { threshold: .08 });
    document.querySelectorAll('.intro-layout, .home-section, #about .row, .experience-container, .topic-directory > section')
      .forEach(element => observer.observe(element));
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) running.forEach(animation => animation.cancel());
    });
  }

  const segments = document.getElementById('pills-tab');
  if (!segments) return;
  const tabs = [...segments.querySelectorAll('[role="tab"]')];
  function syncSelection() {
    const active = tabs.find(tab => tab.classList.contains('active'));
    if (!active) return;
    tabs.forEach(tab => {
      tab.tabIndex = tab === active ? 0 : -1;
      tab.setAttribute('aria-selected', String(tab === active));
    });
    const surface = segments.getBoundingClientRect();
    const selection = active.getBoundingClientRect();
    segments.style.setProperty('--tab-x', `${selection.left - surface.left - segments.clientLeft}px`);
    segments.style.setProperty('--tab-y', `${selection.top - surface.top - segments.clientTop}px`);
    segments.style.setProperty('--tab-width', `${selection.width}px`);
    segments.style.setProperty('--tab-height', `${selection.height}px`);
    segments.classList.add('ui-segments');
  }
  syncSelection();
  segments.addEventListener('shown.bs.tab', syncSelection);
  if ('ResizeObserver' in window) new ResizeObserver(syncSelection).observe(segments);
  else window.addEventListener('resize', syncSelection, { passive: true });
  document.fonts?.ready.then(syncSelection);

  segments.addEventListener('keydown', event => {
    const current = tabs.indexOf(event.target.closest('[role="tab"]'));
    if (current < 0 || !window.bootstrap?.Tab) return;
    let next;
    if (event.key === 'ArrowRight') next = (current + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (event.key === 'Enter' || event.key === ' ') next = current;
    if (next === undefined) return;
    event.preventDefault();
    window.bootstrap.Tab.getOrCreateInstance(tabs[next]).show();
    tabs[next].focus();
  });
})();
