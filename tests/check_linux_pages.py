"""Validate generated static Linux reference pages and their crawlable URLs."""
from pathlib import Path
from urllib.parse import urlsplit
from lxml import html, etree

ROOT = Path(__file__).resolve().parents[1]
LAB = ROOT / 'linux-lab'
NS = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
urls = etree.parse(str(LAB / 'sitemap.xml')).xpath('//s:loc/text()', namespaces=NS)
assert len(urls) == len(set(urls))
base = html.parse(str(LAB / 'index.html')).xpath('//link[@rel="canonical"]/@href')[0]
assert base in urls
for url in urls:
    assert url.startswith(base), url
    path = LAB / url[len(base):] / 'index.html'
    assert path.is_file(), path
    doc = html.parse(str(path))
    assert doc.xpath('//link[@rel="canonical"]/@href') == [url], path
    assert len(doc.xpath('//title')) == 1, path
    assert doc.xpath('//meta[@name="google-site-verification"]/@content') == ['FhZOCWP05JMExYmal-76Ljqmg_0pqKjVu4QuqmwX8cQ'], path
    assert doc.xpath('//meta[@name="description"]/@content'), path
    relative = url[len(base):]
    locale = relative.split('/')[0] if relative.split('/')[0] in ['en','ja','ru','zh-TW'] else 'zh-CN'
    assert doc.getroot().get('lang') == locale, path
    assert len(doc.xpath('//link[@rel="alternate"][@hreflang]')) == 6, path
    assert set(doc.xpath('//link[@rel="alternate"]/@hreflang')) == {'zh-CN','en','ja','ru','zh-TW','x-default'}, path
    if locale != 'zh-CN' and '/commands/' in url and relative.count('/') >= 3:
        original = html.parse(str(LAB / relative.split('/',1)[1] / 'index.html'))
        assert doc.xpath('//pre/code/text()')[1:] == original.xpath('//pre/code/text()')[1:], path
    if relative not in ['', 'en/', 'ja/', 'ru/', 'zh-TW/']:
        assert len(doc.xpath('//h1')) == 1, path
        assert len(doc.xpath('//script')) == 3, path  # Appearance, optional controls and analytics; content stays static.
        assert doc.xpath('//script/@src') == ['../' * len(url[len(base):].strip('/').split('/')) + name for name in ['theme.js', 'analytics.js', 'reference.mjs']], path
        assert doc.xpath('//meta[@property="og:url"]/@content') == [url], path
    for href in doc.xpath('//a/@href | //link[@rel="stylesheet"]/@href | //link[@rel="icon"]/@href | //script[@src]/@src'):
        parsed = urlsplit(href)
        if parsed.scheme or parsed.netloc or not parsed.path:
            continue
        assert not parsed.path.startswith('/'), (path, href)
        target = (path.parent / parsed.path).resolve()
        assert target.is_relative_to(LAB), (path, href)
        if target.is_dir():
            target /= 'index.html'
        assert target.is_file(), (path, href)
root_urls = etree.parse(str(ROOT / 'sitemap.xml')).xpath('//s:loc/text()', namespaces=NS)
assert set(urls).issubset(root_urls)
entry = html.parse(str(LAB / 'index.html'))
assert not entry.xpath('//a[@href="/"]')
assert all('Tommy' not in value for value in entry.xpath('//title/text()'))
assert 'Sitemap: ' + base + 'sitemap.xml' in (ROOT / 'robots.txt').read_text()
print(f'Verified {len(urls)} indexable URLs, static content, metadata, assets and internal links.')
