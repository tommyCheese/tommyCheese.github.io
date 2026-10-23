// Run in the rendered page via tab.playwright.evaluate(), in each theme and scroll position.
export default function assertPageBackground() {
  const body = document.body;
  const footer = document.querySelector('body > footer');
  const bodyStyle = getComputedStyle(body);
  const rootStyle = getComputedStyle(document.documentElement);
  const checks = {
    bodyStartsAtTop: Math.abs(body.getBoundingClientRect().top + scrollY) < .5,
    footerIsTransparent: getComputedStyle(footer).backgroundColor === 'rgba(0, 0, 0, 0)',
    rootSharesGradient: rootStyle.backgroundImage === bodyStyle.backgroundImage && rootStyle.backgroundImage !== 'none',
    rootSharesBaseColor: rootStyle.backgroundColor === bodyStyle.backgroundColor,
    fillsViewport: body.getBoundingClientRect().height >= innerHeight
  };
  if (Object.values(checks).some(value => !value)) {
    throw new Error('Page background discontinuity: ' + JSON.stringify(checks));
  }
  return { theme: body.className, scrollY, ...checks };
}
