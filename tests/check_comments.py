"""Verify comment identity, localization and legacy cleanup in published HTML."""
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlsplit
import sys
from lxml import html

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from build_i18n import LOCALES, PREFIX, MESSAGES, UI_REVISION

pages = [ROOT / 'index.html', ROOT / '404.html']
for folder in ['blogs', 'tags', 'categories', 'gallery', 'topics']:
    pages.extend((ROOT / folder).rglob('*.html'))
count = 0
for locale in LOCALES:
    for source in pages:
        relative = source.relative_to(ROOT)
        file = ROOT / PREFIX[locale].lstrip('/') / relative
        doc = html.document_fromstring(file.read_text())
        name = str(file.relative_to(ROOT))
        assert not doc.xpath('//*[@id="disqus_thread" or @id="i18n-comments"]'), name
        assert not doc.xpath('//script[contains(., "disqus") or contains(@src, "disqus")]'), name
        assert not doc.xpath('//iframe[contains(@src, "disqus")]'), name
        section = doc.xpath('//*[@id="comments"]')
        article = doc.find('.//article')
        expected = article is not None or str(relative) in ['index.html', 'gallery/index.html']
        assert len(section) == int(expected), name
        runtime = doc.xpath('//script[@data-comments-layout="runtime"]/@src')
        backlink = doc.xpath('//meta[@name="giscus:backlink"]/@content')
        if not expected:
            assert not runtime and not backlink, name
            continue
        count += 1
        path = '/' if str(relative) == 'index.html' else '/' + str(relative).removesuffix('index.html')
        assert runtime == ['/js/comments.js?v=' + UI_REVISION], name
        assert len(backlink) == 1 and unquote(backlink[0]) == 'https://tommycheese.github.io' + path, name
        containers = section[0].xpath('.//*[@class="giscus"]')
        assert len(containers) == 1, name
        container = containers[0]
        assert container.get('data-term') == path, name
        assert container.get('data-lang') == locale, name
        assert container.get('data-repo') == 'tommyCheese/tommyCheese.github.io', name
        assert container.get('data-repo-id') == 'R_kgDOMRkVTw', name
        assert container.get('data-category-id') == 'DIC_kwDOMRkVT84DFgwq', name
        for node in section[0].xpath('.//*[@data-i18n]'):
            assert node.text_content() == MESSAGES[locale][node.get('data-i18n')], name
        fallback = section[0].xpath('.//a[@data-i18n="comments.onGitHub"]/@href')[0]
        assert parse_qs(urlsplit(fallback).query)['discussions_q'] == ['"' + path + '"'], name
        assert len(section[0].xpath('.//a[@data-i18n="comments.legacy"]')) == int(path == '/'), name
        assert len(doc.xpath('//body//noscript')) == 1, name
        if article is not None:
            assert not article.xpath('.//*[@id="comments"]'), name
            assert section[0].getprevious().get('data-reading-layout') == 'trail', name

assert count == 60, count
print(f'Passed comments checks: {len(pages) * len(LOCALES)} pages, {count} comment sections, shared identities and no Disqus embeds.')
