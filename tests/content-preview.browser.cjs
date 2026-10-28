// Run with PUPPETEER_MODULE pointing to an installed puppeteer-core, plus Chrome.
const puppeteer = require(process.env.PUPPETEER_MODULE || 'puppeteer-core');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.PREVIEW_BASE_URL || 'http://127.0.0.1:8873';
(async () => {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true
  });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.evaluateOnNewDocument(() => localStorage.setItem('site-language', 'zh-CN'));
    for (const prefix of ['', '/en', '/ja', '/ru', '/zh-TW']) {
      for (const route of ['/news/', '/research/', '/']) {
        await page.setViewport({ width: prefix === '/ja' ? 390 : 1280, height: 900 });
        await page.goto(base + prefix + route, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('.news-main-link[aria-haspopup="dialog"]');
        const card = '.news-card';
        const expected = await page.$eval(card, card => ({
          title: card.querySelector('h3').textContent,
          summary: card.querySelector('p').textContent,
          source: card.dataset.previewSource,
          url: card.querySelector('.news-main-link').href
        }));
        await page.click(card + ' .news-main-link');
        await page.waitForSelector('#content-preview[open]');
        const actual = await page.evaluate(() => ({
          title: document.getElementById('content-preview-title').textContent,
          summary: document.querySelector('#content-preview-body p').textContent,
          body: document.querySelector('.editorial-body').textContent,
          source: document.querySelector('.content-preview-info').textContent,
          url: document.getElementById('content-preview-original').href,
          picture: !!document.querySelector('#content-preview-body > img, #content-preview-body svg, #content-preview-body .editorial-visual'),
          width: document.getElementById('content-preview').getBoundingClientRect().width,
          viewport: innerWidth
        }));
        assert.equal(actual.title, expected.title);
        assert.notEqual(actual.summary, expected.summary);
        assert.ok(actual.body.length > expected.summary.length * 2);
        assert.equal(actual.url, expected.url);
        assert.ok(actual.source.includes(expected.source));
        assert.ok(actual.picture && actual.width <= actual.viewport);
        for (let i = 0; i < 5; i++) {
          await page.keyboard.press('Tab');
          assert.ok(await page.evaluate(() => document.getElementById('content-preview').contains(document.activeElement)));
        }
        await page.keyboard.press('Escape');
        assert.ok(await page.$eval('#content-preview', dialog => !dialog.open));
        assert.ok(await page.evaluate(() => document.activeElement.matches('.news-main-link')));
        // Card tags still navigate/filter instead of opening a preview.
        if (route !== '/') {
          await page.click(card + ' .news-category');
          assert.ok((await page.url()).includes('tag='));
          assert.ok(await page.$eval('#content-preview', dialog => !dialog.open));
        }
      }
    }
    // Check the archive: homepage selections may all have full articles now.
    // This also remains valid once every historical article is complete.
    await page.goto(base + '/news/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.news-main-link[aria-haspopup="dialog"]');
    const archiveCards = await page.$$eval('.news-card', cards => cards.map(card => ({
      hasArticle: !!card.querySelector('template[data-editorial]'),
      opensPreview: card.querySelector('.news-main-link').getAttribute('aria-haspopup') === 'dialog'
    })));
    assert.ok(archiveCards.length > 0);
    for (const card of archiveCards) assert.equal(card.opensPreview, card.hasArticle);
    // Check mobile research, backdrop close and dark mode, plus a broken news cover.
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(base + '/research/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.news-main-link[aria-haspopup="dialog"]');
    await page.evaluate(() => document.body.classList.add('dark'));
    await page.click('.news-main-link');
    const out = process.env.PREVIEW_SCREENSHOTS;
    if (out) {
      fs.mkdirSync(out, { recursive: true });
      await page.screenshot({ path: out + '/research-mobile-dark.png' });
    }
    await page.click('[data-preview-close]');
    assert.ok(await page.$eval('#content-preview', dialog => !dialog.open));
    await page.click('.news-main-link');
    await page.mouse.click(1, 1);
    assert.ok(await page.$eval('#content-preview', dialog => !dialog.open));
    await page.goto(base + '/news/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.news-main-link[aria-haspopup="dialog"]');
    await page.$eval('.news-card > img', img => { img.src = '/missing-preview-test.png'; });
    await page.click('.news-main-link');
    await page.waitForSelector('#content-preview-body svg');
    assert.equal(await page.$('#content-preview-body .news-image-credit'), null);
    await page.keyboard.press('Escape');
    // The explicit source link opens the source, without opening the modal.
    const newTarget = new Promise(resolve => browser.once('targetcreated', resolve));
    await page.click('.news-card-action');
    const target = await newTarget;
    const popup = await target.page();
    await popup.close();
    assert.ok(await page.$eval('#content-preview', dialog => !dialog.open));
    // Full research summary remains visible without JavaScript, with both source links.
    await page.setJavaScriptEnabled(false);
    await page.goto(base + '/research/', { waitUntil: 'domcontentloaded' });
    assert.ok(await page.$eval('.news-main-link', a => a.href.startsWith('https://')));
    assert.ok(await page.$eval('.news-card-action', a => a.href.startsWith('https://')));
    assert.deepEqual(errors, []);
    console.log('Passed preview interaction checks: 15 localized pages, substantive full articles, references, images, focus, Escape, close/backdrop, tags, source links, mobile/dark mode and no-JS fallback.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
