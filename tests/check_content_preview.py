"""Check progressive preview markup and original links in every language."""
from pathlib import Path
import sys
from lxml import html
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from build_i18n import LOCALES, PREFIX, MESSAGES

for locale in LOCALES:
    for page in ['index.html', 'news/index.html', 'research/index.html']:
        doc = html.document_fromstring((ROOT / PREFIX[locale].lstrip('/') / page).read_text())
        modal = doc.xpath('//dialog[@id="content-preview"]')
        assert len(modal) == 1
        assert modal[0].get('aria-labelledby') == 'content-preview-title'
        assert modal[0].xpath('.//button[@data-preview-close]/text()') == [MESSAGES[locale]['content.close']]
        assert modal[0].xpath('.//a[@id="content-preview-original"]/@target') == ['_blank']
        assert len(doc.xpath('//script[@data-reading-layout="runtime"]')) == 1
        for card in doc.xpath('//article[@data-news-id or @data-research-id]'):
            # Title remains a working source link if JavaScript/dialogs are unavailable.
            title = card.xpath('.//a[@class="news-main-link"]')[0]
            original = card.xpath('.//a[@class="news-card-action"]')[0]
            assert title.get('href') == original.get('href')
            assert original.get('target') == '_blank'
            assert set(original.get('rel').split()) == {'noopener', 'noreferrer'}
            assert original.text_content() == MESSAGES[locale]['news.original']
            assert card.get('data-preview-source')
            assert card.get('data-preview-published-at')
            assert len(card.xpath('.//*[@class="news-preview-hint"][@hidden]')) == 1
            assert not card.xpath('.//a//a')
            template = card.xpath('./template[@data-editorial]')
            if template:
                assert template[0].get('lang') == locale
                assert len(template[0].xpath('.//section/h3')) >= 3
                assert template[0].xpath('.//figure/ol/li')
print('Passed localized preview structure, source links and no-JS fallback across 15 pages.')
