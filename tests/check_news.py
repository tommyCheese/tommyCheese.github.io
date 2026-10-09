"""Check the static news cards, provenance, and home-section navigation."""
from datetime import date
from pathlib import Path
from urllib.parse import urlsplit
import sys
from lxml import html

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from build_i18n import LOCALES, PREFIX, MESSAGES
from reading_layout import NEWS

updated = date.fromisoformat(NEWS['updated_at'])
items = NEWS['items']
assert len(items) == 4
assert {item['category'] for item in items} == {'ai', 'semiconductors', 'devices', 'cars'}
assert len({item['id'] for item in items}) == len(items)
for item in items:
    assert date.fromisoformat(item['published_at']) <= updated
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
    cards = section[0].xpath('.//a[@class="news-card"]')
    assert [card.get('data-news-id') for card in cards] == [item['id'] for item in items]
    assert NEWS['updated_at'] in section[0].text_content()
    for item, card in zip(items, cards):
        assert card.get('href') == item['url']
        assert card.get('target') == '_blank'
        assert set(card.get('rel').split()) == {'noopener', 'noreferrer'}
        assert card.xpath('.//img/@src') == [item['image']]
        assert card.xpath('.//img/@loading') == ['lazy']
        assert card.xpath('.//h3')[0].text_content() == MESSAGES[locale]['news.' + item['id'] + '.title']
        assert card.xpath('.//p')[0].text_content() == MESSAGES[locale]['news.' + item['id'] + '.summary']
        assert card.xpath('.//time/@datetime') == [item['published_at']]
        assert item['source'] in card.text_content()
        assert len(card.xpath('.//a')) == 0
    for relative in ['index.html', 'blogs/index.html', 'tags/index.html', 'topics/index.html']:
        doc = html.document_fromstring((root / relative).read_text())
        links = doc.xpath('//*[@id="profileHeader"]//a[@data-i18n="nav.news"]/@href')
        assert len(links) == 1
        url = urlsplit(links[0])
        assert url.path == prefix + '/' and url.fragment == 'today-news'

print(f'Passed news checks: {len(items)} sourced cards × {len(LOCALES)} languages, covers, dates and original links.')
