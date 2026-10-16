"""Verify the shared Chinese lab survives the five-language static build."""
from pathlib import Path
from lxml import html, etree

ROOT = Path(__file__).resolve().parents[1]
for prefix in ['', 'en', 'ja', 'ru', 'zh-TW']:
    home = html.document_fromstring((ROOT / prefix / 'index.html').read_text())
    assert home.xpath('//*[@data-i18n="nav.linuxLab"]/@href') == ['/linux-lab/' + (prefix + '/' if prefix else '')], prefix
    assert not home.xpath('//*[@data-reading-layout="linux-lab"]'), prefix
    assert home.xpath('//*[@data-i18n="nav.linuxLab"]/text()') == ['Learn Linux Command'], prefix
    assert home.xpath('//*[@data-i18n="nav.linuxLab"][contains(@class,"linux-lab-nav")]'), prefix
lab = html.document_fromstring((ROOT / 'linux-lab/index.html').read_text())
assert lab.get('lang') == 'zh-CN'
assert lab.xpath('//link[@rel="canonical"]/@href') == ['https://tommycheese.github.io/linux-lab/']
assert [src.split('?')[0] for src in lab.xpath('//script[@type="module"]/@src')] == ['./app.mjs']
assert lab.xpath('//*[@id="command-input"][@maxlength="4096"]')
# The practice workspace has one goal guide, separate from the file and terminal panels.
assert lab.xpath('count(//*[@id="goals"])') == 1
assert lab.xpath('//aside[@id="mission-window"]//*[@id="goals"]')
assert not lab.xpath('//*[@id="world-area"]//*[@id="goals"] | //dialog//*[@id="goals"]')
assert not lab.xpath('//*[@id="task-intro-dialog"] | //*[@id="task-intro-steps"]')
assert lab.xpath('//*[@id="task-goal-button"]/@aria-controls') == ['mission-window']
assert not lab.xpath('//*[@id="task-theory"]')
assert lab.xpath('//dialog[@id="lesson-intro-dialog"]//*[@id="lesson-intro-knowledge"]')
assert lab.xpath('//*[@id="lesson-intro-button"]/@aria-controls') == ['lesson-intro-dialog']
assert lab.xpath('//*[@id="workspace"]/*[@id="world-area" or @id="practice-area" or @id="mission-window"]/@id') == ['world-area', 'practice-area', 'mission-window']

for path in ['app.mjs', 'shell.mjs', 'curriculum.mjs', 'catalogue.mjs', 'extra-commands.mjs', 'extra-lessons.mjs', 'history.mjs', 'lab.css']:
    assert (ROOT / 'linux-lab' / path).exists()
ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
sitemap = etree.parse(str(ROOT / 'sitemap.xml'))
assert sitemap.xpath('count(//s:loc[text()="https://tommycheese.github.io/linux-lab/"])', namespaces=ns) == 1
print('Verified shared lab entry, static assets, canonical URL and sitemap across five editions.')
