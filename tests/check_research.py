"""Check research provenance fields, five editions and shared tag discovery."""
from datetime import date, timedelta
from collections import Counter
import re
from pathlib import Path
from urllib.parse import parse_qs, urlsplit
import sys
from lxml import html, etree

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from build_i18n import LOCALES, PREFIX, MESSAGES, BASE
from reading_layout import NEWS, NEWS_TAGS, RESEARCH


def read(path):
    return html.document_fromstring(path.read_text())


items = sorted(RESEARCH['items'], key=lambda item: item.get('published_at', item.get('verified_at')), reverse=True)
updated = date.fromisoformat(RESEARCH['updated_at'])
coverage_start = date.fromisoformat(RESEARCH['coverage_start'])
minimum = RESEARCH['minimum_per_day']
assert isinstance(minimum, int) and minimum >= 5
assert coverage_start <= updated
counts = Counter(item.get('published_at', item.get('verified_at')) for item in items)
expected_dates = [(coverage_start + timedelta(days=offset)).isoformat() for offset in range((updated - coverage_start).days + 1)]
shortfalls = {day: counts[day] for day in expected_dates if counts[day] < minimum}
assert not shortfalls, f'Research days below the {minimum}-item minimum: {shortfalls}'
# Different IDs or arXiv versions cannot turn one paper into several entries.
references = []
for item in items:
    url = urlsplit(item['url'])
    path = re.sub(r'v\d+$', '', url.path.rsplit('/', 1)[-1].removesuffix('.pdf')) if url.hostname in {'arxiv.org', 'www.arxiv.org'} else url.path.rstrip('/')
    references.append((url.hostname.removeprefix('www.'), path))
assert len(set(references)) == len(references), 'Duplicate research source or arXiv version'
assert len({item['id'] for item in items}) == len(items)
assert len(set(RESEARCH['tags'])) == len(RESEARCH['tags'])
assert set(RESEARCH['tags']) == set(tag for item in items for tag in item['tags'])
for item in items:
    assert item['kind'] in {'preprint', 'research', 'conference'}
    assert item['tags'] and len(set(item['tags'])) == len(item['tags'])
    assert set(item['tags']) <= set(RESEARCH['tags'])
    assert date.fromisoformat(item.get('published_at', item.get('verified_at'))) <= updated
    assert urlsplit(item['url']).scheme == 'https' and item['source'].strip()
    if item['kind'] == 'conference':
        assert 'published_at' not in item and 'verified_at' in item
        assert 'conferences' in item['tags']
        assert date.fromisoformat(item['event_start']) <= date.fromisoformat(item['event_end'])
    else:
        assert 'published_at' in item and 'verified_at' not in item

for locale in LOCALES:
    prefix = PREFIX[locale]
    root = ROOT / prefix.lstrip('/')
    messages = MESSAGES[locale]
    doc = read(root / 'research/index.html')
    assert doc.xpath('//h1/text()') == [messages['nav.research']]
    assert doc.xpath('//link[@rel="canonical"]/@href') == [BASE + prefix + '/research/']
    assert doc.xpath('//*[@id="profileHeader"]//a[@data-i18n="nav.research"]/@aria-current') == ['page']
    filters = doc.xpath('//nav[@class="news-categories"]/a')
    assert [link.get('data-news-tag') for link in filters] == ['all'] + RESEARCH['tags']
    assert doc.xpath('//form[@id="news-date-filter"]//button/@data-news-period') == ['all', 'today', 'week', 'range']
    cards = doc.xpath('//article[@data-research-id]')
    assert [card.get('data-research-id') for card in cards] == [item['id'] for item in items]
    for item, card in zip(items, cards):
        assert card.get('data-news-tags').split() == item['tags']
        assert card.xpath('.//h3')[0].text_content() == messages['research.' + item['id'] + '.title']
        assert card.xpath('.//p')[0].text_content() == messages['research.' + item['id'] + '.summary']
        link = card.xpath('.//a[@class="news-main-link"]')[0]
        assert link.get('href') == item['url'] and link.get('target') == '_blank'
        assert set(link.get('rel').split()) == {'noopener', 'noreferrer'}
        assert messages['research.kind.' + item['kind']] in card.text_content()
        key = 'research.published' if 'published_at' in item else 'research.verified'
        assert messages[key] in card.text_content()
        assert not card.xpath('.//a//a')
        for tag in card.xpath('.//a[@rel="tag"]'):
            url = urlsplit(tag.get('href'))
            assert url.path == prefix + '/research/' and parse_qs(url.query)['tag'][0] in item['tags']
        if item['kind'] == 'conference':
            assert card.xpath('.//p[@class="research-event"]/time/@datetime') == [item['event_start'], item['event_end']]
    dates = list(dict.fromkeys(item.get('published_at', item.get('verified_at')) for item in items))
    assert doc.xpath('//*[@data-news-date]/@id') == ['research-' + value for value in dates]
    assert not doc.xpath('//*[@data-news-date][@hidden] | //article[@data-research-id][@hidden]')
    assert doc.xpath('//script[@data-reading-layout="runtime"]/@src')[0].startswith('/js/reading.js?')
    home = read(root / 'index.html')
    previews = home.xpath('//*[@id="frontier-research"]//article[@data-research-id]')
    expected = [next(item for item in items if item['kind'] == kind) for kind in ['preprint', 'research', 'conference']]
    assert [card.get('data-research-id') for card in previews] == [item['id'] for item in expected]
    for card, item in zip(previews, expected):
        url = urlsplit(card.xpath('.//a[@class="news-main-link"]/@href')[0])
        assert url.path == prefix + '/research/'
        assert url.fragment == 'research-' + item.get('published_at', item.get('verified_at'))
    directory = read(root / 'tags/index.html')
    for collection, tags, entries in [('news', NEWS_TAGS, NEWS['items']), ('research', RESEARCH['tags'], items)]:
        links = directory.xpath('//*[@data-tag-group="' + collection + '"]//a[@data-catalog-tag]')
        assert [link.get('data-catalog-tag') for link in links] == tags
        for tag, link in zip(tags, links):
            url = urlsplit(link.get('href'))
            assert url.path == prefix + '/' + collection + '/' and parse_qs(url.query)['tag'] == [tag]
            count = sum(tag in (entry['tags'] if collection == 'research' else [entry['category']]) for entry in entries)
            assert messages[collection + '.count'].replace('{count}', str(count)) in link.text_content()

sitemap = etree.parse(str(ROOT / 'sitemap.xml'))
urls = sitemap.xpath('//*[local-name()="loc"]/text()')
assert all(BASE + PREFIX[locale] + '/research/' in urls for locale in LOCALES)
print('Daily research coverage:', ', '.join(day + '=' + str(counts[day]) for day in expected_dates))
print(f'Passed research checks: {len(items)} sourced entries, {len(RESEARCH["tags"])} tags, previews and discovery × 5 languages.')
