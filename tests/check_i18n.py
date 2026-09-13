#!/usr/bin/env python3
"""Validate the published language editions without requiring JavaScript."""
from pathlib import Path
from urllib.parse import urlsplit, unquote, parse_qs
from lxml import html, etree
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'scripts'))
from build_i18n import LOCALES, PREFIX, MESSAGES, BASE, UI_REVISION

pages = [ROOT/'index.html', ROOT/'404.html']
for folder in ['blogs','tags','categories','gallery']:
    pages.extend((ROOT/folder).rglob('*.html'))
articles = {p.parent.name:html.document_fromstring(p.read_text()).find('.//article') for p in pages if p.parent.parent.name=='blogs'}
articles = {slug:article for slug,article in articles.items() if article is not None}
assert len(articles)>=10
checks=0

def require(condition, message):
    global checks
    assert condition,message
    checks+=1

for locale in LOCALES:
    prefix=PREFIX[locale]
    require(MESSAGES[locale].keys()==MESSAGES['zh-CN'].keys(),f'{locale}: dictionary coverage')
    for source in pages:
        output=ROOT/prefix.lstrip('/')/source.relative_to(ROOT)
        require(output.exists(),f'Missing {output.relative_to(ROOT)}')
        content=output.read_text()
        doc=html.document_fromstring(content)
        name=output.relative_to(ROOT).as_posix()
        require(doc.get('lang')==locale,f'{name}: html lang')
        require(not re.search(r'(?:/Users/|/home/[^/]+/|file:///|[A-Z]:\\Users\\)',content),f'{name}: private path')
        if '/page/' in name:continue
        require(len(doc.xpath('//link[@rel="canonical"]'))==1,f'{name}: canonical')
        alternatives=doc.xpath('//link[@rel="alternate"][@hreflang]/@hreflang')
        require(set(alternatives)==set(LOCALES)|{'x-default'},f'{name}: hreflang')
        language_links=doc.xpath('//*[@data-language]')
        require(len(language_links)==5,f'{name}: language navigation')
        for anchor in language_links:
            target=ROOT/unquote(urlsplit(anchor.get('href')).path).lstrip('/')
            require((target if target.suffix else target/'index.html').exists(),f'{name}: broken language link')
        require(len(doc.xpath('//script[starts-with(@src,"/js/i18n.js?v=")]'))==1,f'{name}: versioned runtime count')
        require(doc.get('data-ui-version')==UI_REVISION,f'{name}: current UI version')
        require(doc.xpath('//link[starts-with(@href,"/css/i18n.css?v=")]/@href')==['/css/i18n.css?v='+UI_REVISION],f'{name}: versioned stylesheet')
        for anchor in language_links:
            require(parse_qs(urlsplit(anchor.get('href')).query).get('v')==[UI_REVISION],f'{name}: language link UI version')
        require(not urlsplit(doc.xpath('//link[@rel="canonical"]/@href')[0]).query,f'{name}: clean canonical URL')
        require(len(doc.xpath('//*[@id="disqus_thread"]'))<=1,f'{name}: duplicated comments')
        for text in doc.xpath('//body//text()[not(ancestor::article or ancestor::script or ancestor::style or ancestor::svg)]'):
            require(not re.search(r'[\u3400-\u9fff].*\|.*[A-Za-z]',text),f'{name}: bilingual UI {text[:80]}')
        for node in doc.xpath('//*[@data-i18n]'):
            require(node.get('data-i18n') in MESSAGES[locale],f'{name}: unknown message key')
        for anchor in doc.xpath('//aside[contains(@class,"social")]//a[@href]'):
            params=parse_qs(urlsplit(anchor.get('href')).query)
            if 'url' in params:
                require(params['url'][0].startswith(BASE+prefix+'/blogs/'),f'{name}: share points to wrong language')
        article=doc.find('.//article')
        if article is not None:
            original=articles[source.parent.name]
            require([e.text_content() for e in article.xpath('.//pre | .//code')]==[e.text_content() for e in original.xpath('.//pre | .//code')],f'{name}: code changed')
            require(article.xpath('.//@id')==original.xpath('.//@id'),f'{name}: anchors changed')
            require(len(list(article.iter()))==len(list(original.iter())),f'{name}: body structure changed')
            if locale!='zh-CN':
                translation=html.fragment_fromstring((ROOT/'i18n'/locale/'posts'/f'{source.parent.name}.html').read_text(),create_parent='article')
                require(article.text_content().strip()==translation.text_content().strip(),f'{name}: incomplete translated body')
                require(article.text_content()!=original.text_content(),f'{name}: untranslated body')
            headings={node.get('id'):node.text_content() for node in article.xpath('.//h1 | .//h2 | .//h3 | .//h4 | .//h5 | .//h6')}
            for anchor in doc.xpath('//*[@id="TableOfContents"]//a'):
                key=unquote(anchor.get('href','').lstrip('#'))
                require(key in headings and anchor.text_content()==headings[key],f'{name}: table of contents')
            for label in doc.xpath('//*[@id="readingTime"]'):
                require('min read' not in label.text_content() and bool(re.search(r'\d',label.text_content())),f'{name}: static reading time')
    entries=json.loads((ROOT/prefix.lstrip('/')/'index.json').read_text())
    require(len(entries)==len(articles)+1,f'{locale}: search index count')
    for entry in entries:
        require(urlsplit(entry['permalink']).path.startswith(prefix+'/'),f'{locale}: search locale')
        slug=unquote(urlsplit(entry['permalink']).path).strip('/').split('/')[-1]
        if slug in articles:
            require(entry['title']==MESSAGES[locale]['post.'+slug+'.title'],f'{locale}: search title')
            require(len(entry['content'])>500,f'{locale}: full-text search body')
    for folder in ['blogs','tags','categories','gallery','']:
        base=ROOT/prefix.lstrip('/')/folder
        feeds=[base/'index.xml'] if not folder else list(base.rglob('*.xml'))
        for file in feeds:
            tree=etree.parse(str(file))
            require(tree.findtext('channel/language')==locale,f'{file.relative_to(ROOT)}: RSS language')
            for item in tree.findall('channel/item'):
                slug=unquote(urlsplit(item.findtext('link')).path).strip('/').split('/')[-1]
                if slug in articles:
                    require(len(item.findtext('description'))>500,f'{locale}: full RSS article')

sitemap=etree.parse(str(ROOT/'sitemap.xml'))
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9','x':'http://www.w3.org/1999/xhtml'}
for url in sitemap.xpath('//s:url',namespaces=ns):
    require(len(url.xpath('./x:link',namespaces=ns))==6,'sitemap alternates')
print(f'Passed {checks} checks: {len(pages)*len(LOCALES)} pages and {len(articles)*len(LOCALES)} full article editions.')
