"""Audit public cards, articles and source records for private execution context."""
import sys
from pathlib import Path
from unittest.mock import patch
from urllib.parse import urlsplit, unquote
from lxml import html

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from public_content import check_public_content, check_text
from build_i18n import MESSAGES, PREFIX
from reading_layout import NEWS, RESEARCH
from editorials import DATA

check_public_content({'news': NEWS, 'research': RESEARCH}, DATA, MESSAGES)
for prefix in PREFIX.values():
    for page in ('index.html', 'news/index.html', 'research/index.html'):
        doc = html.document_fromstring((ROOT / prefix.lstrip('/') / page).read_text())
        for card in doc.xpath('//article[@data-news-id or @data-research-id]'):
            check_text(card.text_content(), f'{prefix}/{page}: card and article text')
            for node in card.iter():
                for name, value in node.attrib.items():
                    check_text(value, f'{prefix}/{page}: {name}')

for catalog in (NEWS, RESEARCH):
    for item in catalog['items']:
        url = urlsplit(item.get('image', ''))
        if url.hostname == 'tommycheese.github.io':
            file = ROOT / unquote(url.path).lstrip('/')
            if file.suffix == '.svg':
                check_text(file.read_text(), 'public SVG cover')

for pattern in ('*sources*.md', '*review*.md', 'content-update*.md'):
    for file in (ROOT / 'i18n').glob(pattern):
        check_text(file.read_text(), file.name, private_only=True)

# A leak in a single translation must block publication, without echoing it.
leaks = [
    '/Users/private-editor/work/news.json',
    r'C:\Users\private-editor\work\news.json',
    'file:///tmp/private-draft.json',
    'http://127.0.0.1:8873/news/',
    'http://192.168.1.7/report',
    'http://[::1]:8873/',
    'https://example.org/?file=%252FUsers%252Fprivate-editor%252Fdraft',
    'Authorization: Bearer example-private-credential',
    'api_key=example-private-credential',
    '```python\nprint("internal command")\n```',
    'git push origin main',
    'Traceback (most recent call last)',
]
for leak in leaks:
    messages = {'ja': {'news.example.title': leak}}
    try:
        check_public_content({}, {'articles': []}, messages)
    except ValueError as error:
        assert 'messages.ja.news.example.title' in str(error)
        assert leak not in str(error)
    else:
        raise AssertionError('Private content was accepted')

with patch('public_content.local_identifiers', return_value={'private-editor', 'private-workstation'}):
    for value in ('Prepared by private-editor', 'Created on private-workstation'):
        try:
            check_text(value, 'identity regression')
        except ValueError:
            pass
        else:
            raise AssertionError('Local identity was accepted')

# Public research vocabulary and primary source links are legitimate content.
for value in (
    'OpenAI / Anthropic / John Smith',
    'GPT-6.1 Terra uses the Responses API; tool calls require evaluation.',
    'Researchers report exposed API keys, without publishing their values.',
    'https://github.com/example/research/blob/main/model.py',
    'https://www.vldb.org/pvldb/volumes/19/',
    'sk-hynix-3d-fenand-compute-research',
):
    check_text(value, 'public factual content')

print('Passed privacy audit: five-language cards/articles, links, covers and source records; leak rejection regressions.')
