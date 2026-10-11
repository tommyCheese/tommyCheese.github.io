"""Validate news history, chronological groups, home previews and localized links."""
from datetime import date
from pathlib import Path
from urllib.parse import urlsplit
import sys
from lxml import html, etree

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from build_i18n import LOCALES, PREFIX, MESSAGES, BASE
from reading_layout import NEWS, enhance_layout

updated = date.fromisoformat(NEWS['updated_at'])
items = sorted(NEWS['items'], key=lambda item: item['published_at'], reverse=True)
dates = list(dict.fromkeys(item['published_at'] for item in items))
assert items
assert len({item['id'] for item in items}) == len(items)
for item in items:
    assert date.fromisoformat(item['published_at']) <= updated
    assert item['category'] in {'ai', 'semiconductors', 'devices', 'cars'}
    for field in ['url', 'image']:
        url = urlsplit(item[field])
        assert url.scheme == 'https' and url.netloc
    assert item['source'].strip()

for locale in LOCALES:
    prefix = PREFIX[locale]
    root = ROOT / prefix.lstrip('/')
    home = html.document_fromstring((root / 'index.html').read_text())
    section = home.xpath('//*[@id="today-news"]')
    assert len(section) == 1
    previews = section[0].xpath('.//a[@data-news-id]')
    assert [card.get('data-news-id') for card in previews] == [item['id'] for item in items[:3]]
    all_link = section[0].xpath('.//a[@data-i18n="news.viewAll"]/@href')
    assert len(all_link) == 1 and urlsplit(all_link[0]).path == prefix + '/news/'
    for item, card in zip(items, previews):
        url = urlsplit(card.get('href'))
        assert url.path == prefix + '/news/' and url.fragment == 'news-' + item['published_at']
        assert not card.get('target')
        assert card.xpath('.//img/@src') == [item['image']]
        assert card.xpath('.//h3')[0].text_content() == MESSAGES[locale]['news.' + item['id'] + '.title']
        assert card.xpath('.//time/@datetime') == [item['published_at']]

    archive = html.document_fromstring((root / 'news/index.html').read_text())
    assert archive.xpath('//h1')[0].text_content() == MESSAGES[locale]['nav.news']
    assert NEWS['updated_at'] in archive.xpath('//*[@class="news-updated"]')[0].text_content()
    assert archive.xpath('//link[@rel="canonical"]/@href') == [BASE + prefix + '/news/']
    assert archive.xpath('//*[@id="profileHeader"]//a[@data-i18n="nav.news"]/@aria-current') == ['page']
    groups = archive.xpath('//*[@class="news-day"]')
    assert [group.get('id') for group in groups] == ['news-' + value for value in dates]
    jump_targets = archive.xpath('//nav[@class="news-date-nav"]/a/@href')
    assert jump_targets == ['#news-' + value for value in dates]
    for value, group in zip(dates, groups):
        assert group.xpath('.//h2/time/@datetime') == [value]
        daily_items = [item for item in items if item['published_at'] == value]
        expected_count = MESSAGES[locale]['news.count'].replace('{count}', str(len(daily_items)))
        assert group.xpath('.//*[@class="news-day-count"]')[0].text_content() == expected_count
        assert group.xpath('.//a[@data-news-id]/@data-news-id') == [item['id'] for item in daily_items]
    cards = archive.xpath('//*[@id="news-page"]//a[@data-news-id]')
    assert [card.get('data-news-id') for card in cards] == [item['id'] for item in items]
    for item, card in zip(items, cards):
        assert card.get('href') == item['url']
        assert card.get('target') == '_blank'
        assert set(card.get('rel').split()) == {'noopener', 'noreferrer'}
        assert card.xpath('.//img/@src') == [item['image']]
        assert card.xpath('.//img/@loading') == ['lazy']
        assert card.xpath('.//h3')[0].text_content() == MESSAGES[locale]['news.' + item['id'] + '.title']
        assert card.xpath('.//p')[0].text_content() == MESSAGES[locale]['news.' + item['id'] + '.summary']
        assert item['source'] in card.text_content()
        assert len(card.xpath('.//a')) == 0
    for relative in ['index.html', 'news/index.html', 'blogs/index.html', 'tags/index.html', 'topics/index.html']:
        doc = html.document_fromstring((root / relative).read_text())
        links = doc.xpath('//*[@id="profileHeader"]//a[@data-i18n="nav.news"]/@href')
        assert len(links) == 1
        url = urlsplit(links[0])
        assert url.path == prefix + '/news/' and not url.fragment

sitemap = etree.parse(str(ROOT / 'sitemap.xml'))
ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
urls = sitemap.xpath('//s:loc/text()', namespaces=ns)
assert all(BASE + PREFIX[locale] + '/news/' in urls for locale in LOCALES)

# An older addition must remain reachable even beyond the preview's item limit.
original_items = NEWS['items']
extra = dict(items[0], id='archive-history-check', published_at='2020-01-01')
messages = dict(MESSAGES['zh-CN'])
for field in ['title', 'summary']:
    messages['news.' + extra['id'] + '.' + field] = messages['news.' + items[0]['id'] + '.' + field]
try:
    NEWS['items'] = [extra] + original_items
    archive = html.document_fromstring((ROOT / 'news/index.html').read_text())
    enhance_layout(archive, '/news/', 'zh-CN', {}, messages, 'test')
    cards = archive.xpath('//*[@id="news-page"]//a[@data-news-id]')
    assert len(cards) == len(items) + 1
    assert cards[-1].get('data-news-id') == extra['id']
    assert archive.xpath('//*[@class="news-day"]/@id')[-1] == 'news-2020-01-01'
finally:
    NEWS['items'] = original_items

print(f'Passed news checks: {len(items)} archived stories in {len(dates)} chronological groups × {len(LOCALES)} languages, previews and source links.')
