// Run against the local site with an existing Puppeteer installation:
// PUPPETEER_MODULE=/absolute/path/to/puppeteer-core CHROME_PATH=/path/to/chrome node tests/motion.browser.cjs
const assert = require('node:assert/strict');
const puppeteer = require(process.env.PUPPETEER_MODULE || 'puppeteer-core');
const base = process.env.BASE_URL || 'http://localhost:8873';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    // Puppeteer's hidden scrollbars otherwise mask long-to-short page layout shifts.
    ignoreDefaultArgs: ['--hide-scrollbars'],
    headless: true
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1000 });
    // External feeds and analytics are unrelated to snapshot geometry.
    await page.setRequestInterception(true);
    page.on('request', request => new URL(request.url()).origin === new URL(base).origin ? request.continue() : request.abort());
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('site-language', 'zh-CN');
      localStorage.setItem('pref-theme', 'light');
      window.addEventListener('pageswap', () => {
        const content = document.getElementById('content');
        const named = getComputedStyle(content).viewTransitionName !== 'none';
        sessionStorage.setItem('motion-source', JSON.stringify({
          name: named ? getComputedStyle(content).viewTransitionName : 'root',
          width: named ? content.getBoundingClientRect().width : innerWidth
        }));
      });
      window.addEventListener('pagereveal', event => {
        window.motionSettled = event.viewTransition?.finished.catch(() => {}) || Promise.resolve();
        if (!event.viewTransition) return;
        const source = JSON.parse(sessionStorage.getItem('motion-source'));
        const navStarts = [], widths = [];
        document.addEventListener('animationstart', animation => {
          if (animation.target.matches('#profileHeader .navbar')) navStarts.push(animation.animationName);
        });
        let finished = false;
        function sample() {
          const width = parseFloat(getComputedStyle(document.documentElement, `::view-transition-old(${source.name})`).width);
          if (width > 100) widths.push(width);
          if (!finished) requestAnimationFrame(sample);
        }
        event.viewTransition.ready.then(() => requestAnimationFrame(sample), () => {});
        event.viewTransition.finished.then(() => {
          finished = true;
          // Catch an entrance that restarts after :active-view-transition stops matching.
          setTimeout(() => sessionStorage.setItem('motion-result', JSON.stringify({
            path: location.pathname, source, widths, navStarts
          })), 450);
        });
      });
    });
    await page.goto(base + '/', { waitUntil: 'load' });
    for (const [key, path] of [['nav.gallery', '/gallery/'], ['nav.news', '/news/']]) {
      await page.evaluate(() => sessionStorage.removeItem('motion-result'));
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'load' }),
        page.click(`#profileHeader [data-i18n="${key}"]`)
      ]);
      await page.waitForFunction(() => sessionStorage.getItem('motion-result'), { timeout: 15000 });
      const result = await page.evaluate(() => JSON.parse(sessionStorage.getItem('motion-result')));
      assert.equal(result.path, path);
      assert.deepEqual(result.navStarts, [], 'header must not replay its entrance after navigation');
      assert.ok(result.widths.length, 'test must observe real transition frames');
      assert.ok(Math.max(...result.widths) <= result.source.width + 1,
        `outgoing snapshot enlarged from ${result.source.width} to ${Math.max(...result.widths)}`);
      console.log(`${path}: header stable; outgoing snapshot ${Math.max(...result.widths)}px / original ${result.source.width}px`);
    }
    const headerGeometry = () => page.evaluate(() => ({
      scrolls: document.documentElement.scrollHeight > innerHeight,
      items: [...document.querySelectorAll('#profileHeader, #profileHeader .navbar-brand, #profileHeader .nav-link, #profileHeader .navbar-toggler, #theme-toggle')]
        .map(element => {
          const { x, y, width, height } = element.getBoundingClientRect();
          return { x, y, width, height };
        })
    }));
    for (const width of [1440, 1196, 390]) {
      await page.setViewport({ width, height: 1314 });
      await page.goto(base + '/tags/', { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const before = await headerGeometry();
      assert.ok(before.scrolls, 'tag directory must exercise a scrolling page');
      await page.evaluate(() => sessionStorage.removeItem('motion-result'));
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'load' }),
        page.click('.tag-card[href*="/tags/agent"]')
      ]);
      // Scrollbar changes can make the browser skip a transition; geometry still matters.
      await page.evaluate(async () => { await document.fonts.ready; await window.motionSettled; });
      const after = await headerGeometry();
      assert.equal(after.scrolls, false, 'single-article tag must exercise a short page');
      const assertStable = state => state.items.forEach((item, index) => {
        for (const key of ['x', 'y', 'width', 'height']) {
          assert.ok(Math.abs(item[key] - before.items[index][key]) < .5,
            `${width}px tag navigation: header item ${index} ${key} changed from ${before.items[index][key]} to ${item[key]}`);
        }
      });
      assertStable(after);
      await page.goBack({ waitUntil: 'load' });
      assertStable(await headerGeometry());
      console.log(`${width}px: header geometry stable across long/short tag pages and back`);
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
