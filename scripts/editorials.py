"""Original, localized articles for news/research dialogs; summaries stay on cards."""
from datetime import date
from pathlib import Path
from urllib.parse import urlsplit
import json

ROOT = Path(__file__).resolve().parents[1]
LOCALES = {'zh-CN', 'en', 'ja', 'ru', 'zh-TW'}
DATA = json.loads((ROOT / 'i18n/editorials.json').read_text())
ARTICLES = {}
for article in DATA['articles']:
    key = (article['catalog'], article['id'])
    assert key[0] in {'news', 'research'} and key not in ARTICLES, f'Duplicate/invalid editorial: {key}'
    date.fromisoformat(article['written_at'])
    assert article['sources'] and set(article['locales']) == LOCALES, f'Incomplete editorial: {key}'
    for source in article['sources']:
        url = urlsplit(source['url'])
        assert source['label'].strip() and url.scheme == 'https' and url.netloc, f'Invalid source: {key}'
    for locale, body in article['locales'].items():
        assert body['lead'].strip() and len(body['sections']) >= 3, (key, locale)
        paragraphs = [p for section in body['sections'] for p in section['paragraphs']]
        assert len(paragraphs) >= 4 and all(isinstance(p, str) and p.strip() for p in paragraphs), (key, locale)
        assert all(section['heading'].strip() for section in body['sections']), (key, locale)
        assert len(body['lead'] + ''.join(paragraphs)) >= 500, f'Editorial too short: {key} / {locale}'
        visual = body['visual']
        assert visual['caption'].strip() and 2 <= len(visual['steps']) <= 5
        assert all(isinstance(step, str) and step.strip() for step in visual['steps'])
    ARTICLES[key] = article


def check_coverage(catalogs):
    """Legacy entries can be backfilled; every new batch needs complete articles."""
    required = date.fromisoformat(DATA['required_from'])
    keys = {(catalog, item['id']) for catalog, data in catalogs.items() for item in data['items']}
    assert set(ARTICLES) <= keys, 'Editorial without a matching news/research entry'
    for catalog, data in catalogs.items():
        for item in data['items']:
            key = (catalog, item['id'])
            day = date.fromisoformat(item.get('collected_at', item['published_at']))
            legacy = item['id'] in DATA['legacy_ids'][catalog] and day < required
            assert legacy or key in ARTICLES, f'Missing full editorial for new entry: {key}'
            if key in ARTICLES:
                article = ARTICLES[key]
                assert date.fromisoformat(article['written_at']) >= date.fromisoformat(item['published_at'])
