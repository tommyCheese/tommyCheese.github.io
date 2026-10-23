const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '..');
const research = JSON.parse(readFileSync(join(root, 'i18n/research.json'), 'utf8'));
const read = (...parts) => readFileSync(join(root, ...parts), 'utf8');
const section = (page, id) => page.match(new RegExp(`<section\\b[^>]*id="${id}"[^>]*>([\\s\\S]*?)<\\/section>`))[1];
const articles = page => page.match(/<article\b[\s\S]*?<\/article>/g) || [];
const postLinks = fragment => [...fragment.matchAll(/<a\b[^>]*href="([^"]+)"/g)]
  .map(match => match[1].split('?')[0]).filter(href => /\/blogs\/[^/]+\/$/.test(href));

for (const locale of ['', 'en', 'ja', 'ru', 'zh-TW']) {
  test(`homepage offers distinct reading choices and keeps research dates accurate: ${locale || 'zh-CN'}`, () => {
    const home = read(locale, 'index.html');
    const featured = postLinks(section(home, 'featured-posts'));
    const more = postLinks(section(home, 'recent-posts'));
    assert.equal(featured.length, 3);
    assert.equal(more.length, 5);
    assert.equal(new Set([...featured, ...more]).size, 8);

    const flow = ['hero', 'home-updates', 'today-news', 'frontier-research', 'home-essays', 'featured-posts', 'recent-posts']
      .map(id => home.indexOf(`id="${id}"`));
    flow.push(home.indexOf('data-reading-layout="topics"'));
    assert.ok(flow.every((position, index) => position >= 0 && (!index || position > flow[index - 1])));
    assert.match(home, /<section\b[^>]*id="home-essays"[^>]*aria-labelledby="essays-heading"/);
    assert.match(home, /<h2\b[^>]*id="essays-heading"/);
    for (const name of ['updates', 'personal']) {
      assert.match(home, new RegExp(`<section\\b[^>]*id="home-${name}"[^>]*aria-labelledby="${name}-heading"`));
      assert.match(home, new RegExp(`<h2\\b[^>]*id="${name}-heading"`));
    }
    for (const id of ['news-heading', 'research-heading', 'featured-heading', 'recent-heading', 'topics-heading', 'comments-heading']) {
      assert.match(home, new RegExp(`<h3\\b[^>]*id="${id}"`));
    }

    const archive = articles(read(locale, 'research/index.html'));
    for (const preview of articles(section(home, 'frontier-research'))) {
      const id = preview.match(/data-research-id="([^"]+)"/)[1];
      const item = research.items.find(item => item.id === id);
      const day = item.collected_at || item.published_at;
      assert.ok(preview.includes(`href="${item.url.replaceAll('&', '&amp;')}"`));
      assert.deepEqual([...preview.matchAll(/<time\b[^>]*datetime="([^"]+)"/g)].map(match => match[1]), [day]);

      const full = archive.find(article => article.includes(`data-research-id="${id}"`));
      assert.ok(full, `Archive entry missing: ${id}`);
      assert.ok(full.includes(`datetime="${item.published_at}"`));
      if (item.collected_at) assert.ok(full.includes(`datetime="${item.collected_at}"`));
      assert.ok(full.includes('class="research-venue"') === Boolean(item.venue));
    }
  });
}
