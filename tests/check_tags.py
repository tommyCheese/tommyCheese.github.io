"""Verify tag membership across pages, search, RSS, aliases and languages."""
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json
import sys
from lxml import html, etree

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from build_i18n import LOCALES, PREFIX, MESSAGES, BASE
from tag_taxonomy import TAGS, POST_TAGS, ALIASES

EXPECTED_COUNTS = {'软件架构': 7, 'agent开发': 1, '机器学习': 2, '整洁架构之道': 6,
                   '领域驱动设计': 1, '插件开发': 1, '模型迁移': 1, '数学基础': 1}


def read(path):
    return html.document_fromstring(path.read_text())


def path_of(url):
    return unquote(urlsplit(url).path)


def slug_of(url):
    return path_of(url).strip('/').split('/')[-1]


for locale in LOCALES:
    prefix = PREFIX[locale]
    root = ROOT / prefix.lstrip('/')
    messages = MESSAGES[locale]
    directory = read(root / 'tags/index.html')
    links = directory.xpath('//*[@data-tag]')
    assert [link.get('data-tag') for link in links] == TAGS
    assert len(directory.xpath('//*[@data-tag-group="directions"]//a')) == 3
    assert len(directory.xpath('//*[@data-tag-group="subjects"]//a')) == 5
    for link in links:
        tag = link.get('data-tag')
        count = EXPECTED_COUNTS[tag]
        assert messages['topics.count'].replace('{count}', str(count)) in link.text_content()
        assert path_of(link.get('href')) == prefix + '/tags/' + tag + '/'
        listing = read(root / 'tags' / tag / 'index.html')
        posts = [slug_of(url) for url in listing.xpath('//*[@id="list-page"]//a[@class="post-row"]/@href')]
        expected = {slug for slug, tags in POST_TAGS.items() if tag in tags}
        assert len(posts) == count and set(posts) == expected, (locale, tag, posts)
        dates = listing.xpath('//*[@id="list-page"]//time/@datetime')
        assert dates == sorted(dates, reverse=True)
        assert not listing.xpath('//meta[@http-equiv="refresh" or @name="robots"]')
        feed = etree.parse(str(root / 'tags' / tag / 'index.xml'))
        feed_posts = [slug_of(item.findtext('link')) for item in feed.findall('channel/item')]
        assert feed_posts == posts, (locale, tag, 'RSS membership/order')
        assert feed.findtext('channel/title') == messages['tag.' + tag] + ' · Tommy Cheese'
    tag_feed = etree.parse(str(root / 'tags/index.xml'))
    assert [slug_of(item.findtext('link')) for item in tag_feed.findall('channel/item')] == TAGS
    entries = json.loads((root / 'index.json').read_text())
    for entry in entries:
        slug = slug_of(entry['permalink'])
        if slug not in POST_TAGS:
            continue
        expected_labels = [messages['tag.' + tag] for tag in POST_TAGS[slug]]
        assert entry['tags'] == expected_labels
        post = read(root / 'blogs' / slug / 'index.html')
        tags = post.xpath('//aside[contains(@class,"tags")]//a')
        assert [tag.text_content() for tag in tags] == expected_labels
        assert [path_of(tag.get('href')) for tag in tags] == [prefix + '/tags/' + tag + '/' for tag in POST_TAGS[slug]]
        assert all(tag.get('rel') == 'tag' and not tag.get('target') for tag in tags)
    for folder in ['blogs', 'tags', '']:
        feeds = [root / 'index.xml'] if not folder else (root / folder).rglob('*.xml')
        for file in feeds:
            for item in etree.parse(str(file)).findall('channel/item'):
                slug = slug_of(item.findtext('link'))
                if slug in POST_TAGS:
                    assert item.findall('category') and [node.text for node in item.findall('category')] == [messages['tag.' + tag] for tag in POST_TAGS[slug]]
    for old, target in ALIASES.items():
        for relative in ['index.html', 'page/1/index.html']:
            doc = read(root / 'tags' / old / relative)
            redirect = doc.xpath('//meta[@http-equiv="refresh"]/@content')[0].split('url=', 1)[1]
            assert path_of(redirect) == prefix + '/tags/' + target + '/'
            assert doc.xpath('//meta[@name="robots"]/@content') == ['noindex']
            assert path_of(doc.xpath('//link[@rel="canonical"]/@href')[0]) == prefix + '/tags/' + target + '/'
        assert (root / 'tags' / old / 'index.xml').read_bytes() == (root / 'tags' / target / 'index.xml').read_bytes()

sitemap = etree.parse(str(ROOT / 'sitemap.xml'))
urls = sitemap.xpath('//*[local-name()="loc"]/text()')
for locale in LOCALES:
    for tag in TAGS + list(ALIASES):
        target = PREFIX[locale] + '/tags/' + tag + '/'
        assert (target in [path_of(url) for url in urls]) == (tag in TAGS)
print('Passed tag checks: 8 tags, 10 posts, 5 languages, counts/order, search, RSS, and 6 legacy redirects.')
