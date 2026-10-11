// Reuse the site's GA4 property; keep local development out of visit reports.
(() => {
  if (['localhost', '127.0.0.1', '::1', '[::1]'].includes(location.hostname) || location.protocol === 'file:') return;
  const measurementId = 'G-RPQTR1FJGV';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.append(script);
  window.gtag('js', new Date());
  window.gtag('config', measurementId);
})();
