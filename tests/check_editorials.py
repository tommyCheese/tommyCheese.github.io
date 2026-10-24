"""Full articles must add substance, retain five editions and gate new batches."""
import copy
import json
import sys
from pathlib import Path
from lxml import html
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from build_i18n import LOCALES, PREFIX, MESSAGES
from editorials import ARTICLES, DATA, check_coverage
from reading_layout import NEWS, RESEARCH
catalogs = {'news': NEWS, 'research': RESEARCH}
check_coverage(catalogs)
assert DATA['required_from'] == '2026-10-25'
for (catalog, id), article in ARTICLES.items():
    for locale in LOCALES:
        body = article['locales'][locale]
        text = body['lead'] + ''.join(p for s in body['sections'] for p in s['paragraphs'])
        summary = MESSAGES[locale][f'{catalog}.{id}.summary']
        assert body['lead'] != summary and len(text) > len(summary) * 2, (catalog, id, locale)
        assert len(set(p for s in body['sections'] for p in s['paragraphs'])) == sum(len(s['paragraphs']) for s in body['sections'])
        doc = html.document_fromstring((ROOT / PREFIX[locale].lstrip('/') / catalog / 'index.html').read_text())
        card = doc.xpath(f'//article[@data-{catalog}-id="{id}"]')[0]
        templates = card.xpath('./template[@data-editorial]')
        assert len(templates) == 1 and templates[0].get('lang') == locale
        assert templates[0].xpath('.//p[@class="editorial-lead"]/text()') == [body['lead']]
        assert templates[0].xpath('.//figure/ol/li/text()') == body['visual']['steps']
        assert templates[0].xpath('.//section[@class="editorial-sources"]/a/@href') == [s['url'] for s in article['sources']]
        assert not templates[0].xpath('.//script | .//iframe | .//*[@onclick]')
        for paragraph in [p for s in body['sections'] for p in s['paragraphs']]:
            assert paragraph in templates[0].text_content()
# A new batch cannot silently ship short cards without a full article.
missing = copy.deepcopy(catalogs)
missing['news']['items'].append(dict(NEWS['items'][0], id='missing-editorial-regression', collected_at='2026-10-24'))
try:
    check_coverage(missing)
except AssertionError as error:
    assert 'Missing full editorial' in str(error)
else:
    raise AssertionError('A new item without a full article was accepted')
for catalog, data in catalogs.items():
    complete = sum((catalog, item['id']) in ARTICLES for item in data['items'])
    print(f'{catalog}: {complete} full articles, {len(data["items"])-complete} historical articles pending.')
print('Passed five-language editorial content, substantive expansion, visual/source links and new-batch publishing gate.')
