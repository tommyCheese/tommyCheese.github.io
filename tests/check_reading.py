"""Regression checks for static discovery and reading navigation."""
from pathlib import Path
from urllib.parse import urlsplit, unquote
import subprocess
import sys
from lxml import html

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from build_i18n import LOCALES, PREFIX
from reading_layout import ARCHITECTURE, TOPICS, FEATURED


def read(path):
    return html.document_fromstring(path.read_text())


slugs = [slug for values in TOPICS.values() for slug in values]
assert len(slugs) == len(set(slugs))
for locale in LOCALES:
    prefix = PREFIX[locale]
    root = ROOT / prefix.lstrip('/')
    home = read(root / 'index.html')
    assert len(home.xpath('//h1')) == 1
    assert len(home.xpath('//*[@id="dynImg"]')) == 1
    assert len(home.xpath('//script[@data-reading-layout="hero-theme"]')) == 1
    sections = home.xpath('//*[@id="content"]/*/@id')
    assert sections.index('featured-posts') < sections.index('recent-posts') < sections.index('about')
    assert len(home.xpath('//*[@id="featured-posts"]//a')) == len(FEATURED)
    assert len(home.xpath('//*[@id="recent-posts"]//time')) == 5
    assert not home.xpath('//a[@download][@href="#"]')
    assert home.xpath('//a[@data-i18n="action.subscribe"]/@href') == [prefix + '/index.xml']
    directory = read(root / 'topics/index.html')
    assert len(directory.xpath('//*[@id="topics-page"]//a[@class="post-row"]')) == len(slugs)
    for topic, members in TOPICS.items():
        actual = directory.xpath('//*[@id="' + topic + '"]//a[@class="post-row"]/@href')
        assert [unquote(urlsplit(value).path).strip('/').split('/')[-1] for value in actual] == members
    for slug in slugs:
        file = root / 'blogs' / slug / 'index.html'
        doc = read(file)
        assert not doc.xpath('//footer//*[@id="recent-posts"]')
        assert len(doc.xpath('//*[@data-reading-layout="trail"]')) == 1
        article = doc.find('.//article')
        # Body text/code must be unchanged by this layout-only update.
        if locale == 'zh-CN' and '--check-unchanged' in sys.argv:
            baseline = subprocess.check_output(['git', 'show', 'HEAD:blogs/' + slug + '/index.html'], cwd=ROOT).decode()
            original = html.document_fromstring(baseline).find('.//article')
            assert html.tostring(article, encoding='unicode') == html.tostring(original, encoding='unicode'), slug + ': article body changed'
        if doc.xpath('//*[@id="TableOfContents"]/*'):
            assert len(doc.xpath('//*[@id="mobileTableOfContents"]')) == 1
            assert doc.xpath('//*[@id="mobileTableOfContents"]//a/@href') == doc.xpath('//*[@id="TableOfContents"]//a/@href')
            assert doc.xpath('//*[@id="mobileTableOfContents"]//a/text()') == doc.xpath('//*[@id="TableOfContents"]//a/text()')
        if slug in ARCHITECTURE:
            position = ARCHITECTURE.index(slug)
            for relation, neighbor in [('prev', position - 1), ('next', position + 1)]:
                links = doc.xpath('//*[@class="reading-trail"]//a[@rel="' + relation + '"]/@href')
                if 0 <= neighbor < len(ARCHITECTURE):
                    assert len(links) == 1 and unquote(urlsplit(links[0]).path) == prefix + '/blogs/' + ARCHITECTURE[neighbor] + '/'
                else:
                    assert not links
    # Validate the generated discovery links, including language and topic anchors.
    for doc in [home, directory] + [read(root / 'blogs' / slug / 'index.html') for slug in slugs]:
        links = doc.xpath('//*[@data-reading-layout]//a[@href] | //*[@id="topics-page"]//a[@href] | //*[@id="profileHeader"]//a[@href]')
        for anchor in links:
            url = urlsplit(anchor.get('href'))
            if url.netloc or not url.path.startswith('/'):
                continue
            target = ROOT / unquote(url.path).lstrip('/')
            if target.is_dir():
                target /= 'index.html'
            assert target.is_file(), str(target)
            if not anchor.get('data-language'):
                assert url.path.startswith(prefix + '/'), (locale, url.path)
            if url.fragment and target.suffix == '.html':
                assert read(target).get_element_by_id(unquote(url.fragment), None) is not None
print('Passed reading checks: 5 homepages, 5 topic directories, 50 articles, series order, bodies and links.')
