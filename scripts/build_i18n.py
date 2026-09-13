#!/usr/bin/env python3
"""Build the five static language editions from the Chinese pages and translations."""
from pathlib import Path
from copy import deepcopy
from datetime import datetime
from urllib.parse import urlsplit, urlunsplit, unquote, quote, urlencode
from math import ceil
import json
import re
from lxml import html, etree

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://tommycheese.github.io'
LOCALES = {'zh-CN': '简体中文', 'en': 'English', 'ja': '日本語', 'ru': 'Русский', 'zh-TW': '繁體中文'}
PREFIX = {locale: '' if locale == 'zh-CN' else '/' + locale for locale in LOCALES}
source = (ROOT / 'js/i18n-messages.js').read_text()
MESSAGES = json.loads(source[source.index('{'):source.rindex('}') + 1])
SOURCE_MAP = json.loads((ROOT / 'i18n/message-map.json').read_text())
normalize = lambda value: ' '.join(value.split())
TEXT_KEYS = {normalize(text): key for text, key in SOURCE_MAP['text'].items()}
DUPLICATES = {normalize(item['remove']) for item in SOURCE_MAP['deduplicate']}
for key, value in MESSAGES['zh-CN'].items():
    TEXT_KEYS.setdefault(normalize(value), key)
TEXT_KEYS['© 2026 All rights reserved'] = 'footer.copyright'


def t(key, locale):
    return MESSAGES[locale].get(key, MESSAGES['zh-CN'].get(key, key))


def set_text(element, text):
    for child in list(element):
        element.remove(child)
    element.text = text


def text_key(element, key, locale):
    element.set('data-i18n', key)
    set_text(element, t(key, locale))


def attr_key(element, attribute, key, locale):
    element.set('data-i18n-' + attribute, key)
    element.set(attribute, t(key, locale))


def wrap_text(element, field, key, locale):
    node = html.Element('span', {'data-i18n': key})
    node.text = t(key, locale)
    if field == 'text':
        element.text = None
        element.insert(0, node)
    else:
        element.tail = None
        element.addnext(node)


def localize_text(doc, locale):
    for element in list(doc.iter()):
        if not isinstance(element.tag, str):
            continue
        excluded = {'script', 'style', 'article', 'pre', 'code', 'title', 'svg', 'noscript'}
        ancestors = list(element.iterancestors())
        if element.tag in excluded or any(a.tag in excluded for a in ancestors):
            continue
        if element.get('data-i18n'):
            set_text(element, t(element.get('data-i18n'), locale))
        elif element.text and normalize(element.text) in DUPLICATES:
            element.text = None
        elif element.text and normalize(element.text) in TEXT_KEYS:
            wrap_text(element, 'text', TEXT_KEYS[normalize(element.text)], locale)
        if element.tail and normalize(element.tail) in DUPLICATES:
            element.tail = None
        elif element.tail and normalize(element.tail) in TEXT_KEYS:
            wrap_text(element, 'tail', TEXT_KEYS[normalize(element.tail)], locale)
        for attribute in ['title', 'alt', 'aria-label', 'placeholder', 'data-bs-original-title']:
            key = element.get('data-i18n-' + attribute)
            if not key and element.get(attribute):
                key = TEXT_KEYS.get(normalize(element.get(attribute)))
            if key:
                attr_key(element, attribute, key, locale)
    # Empty paragraphs are artifacts of removing the duplicated English biography.
    for paragraph in doc.xpath('//*[@id="about"]//p'):
        if not paragraph.text_content().strip():
            paragraph.getparent().remove(paragraph)


def page_path(file):
    path = file.relative_to(ROOT).as_posix()
    return '/' if path == 'index.html' else '/' + path.removesuffix('index.html')


def serialize_page(doc):
    content=etree.tostring(doc,encoding='unicode',method='html')
    # Normalize the generated shell while preserving every byte of article text/code.
    parts=re.split(r'(<article\b.*?</article>)',content,flags=re.S)
    return '<!DOCTYPE html>\n'+''.join(part if i%2 else re.sub(r'[ \t]+(?=\n)', '', part) for i,part in enumerate(parts))+'\n'


def localized_url(value, locale, current_path, known_paths):
    parsed = urlsplit(value.strip())
    if parsed.scheme not in ['', 'http', 'https'] or (parsed.netloc and parsed.netloc != 'tommycheese.github.io'):
        return value
    if not parsed.path:
        if parsed.fragment:
            return value
        return value
    path = unquote(parsed.path)
    if not path.startswith('/'):
        # Downloads and media remain shared at their original locations.
        if path == 'article.md':
            return current_path + 'article.md'
        return value
    path = re.sub(r'^/(en|ja|ru|zh-TW)(?=/|$)', '', path) or '/'
    canonical_path = path.removesuffix('index.html')
    if not canonical_path.endswith('/') and canonical_path + '/' in known_paths:
        canonical_path += '/'
    is_feed = canonical_path.endswith('index.xml') or canonical_path == '/index.json'
    if canonical_path not in known_paths and not is_feed:
        return value
    result = PREFIX[locale] + canonical_path
    result = quote(result, safe='/%.~-')
    return urlunsplit((parsed.scheme, parsed.netloc, result, parsed.query, parsed.fragment))


def add_metadata(doc, path, locale, title, description):
    doc.set('lang', locale)
    doc.set('data-page-path', path)
    head = doc.find('head')
    for element in head.xpath('script[@src="/js/i18n-messages.js" or @src="/js/i18n.js"] | link[@href="/css/i18n.css"] | noscript[@id="i18n-no-script"]'):
        head.remove(element)
    for element in head.xpath('link[@rel="canonical" or @hreflang]'):
        head.remove(element)
    for element in head.xpath('meta[@property="og:locale" or @property="og:locale:alternate"]'):
        head.remove(element)
    for property_, content in [('og:locale', locale.replace('-', '_') if '-' in locale else {'en':'en_US','ja':'ja_JP','ru':'ru_RU'}[locale])]:
        head.append(html.Element('meta', property=property_, content=content))
    for code in LOCALES:
        head.append(html.Element('link', rel='alternate', hreflang=code, href=BASE + PREFIX[code] + quote(path, safe='/%.~-')))
    head.append(html.Element('link', rel='alternate', hreflang='x-default', href=BASE + quote(path, safe='/%.~-')))
    head.append(html.Element('link', rel='canonical', href=BASE + PREFIX[locale] + quote(path, safe='/%.~-')))
    page_title = title if path == '/' else title + ' · Tommy Cheese'
    if head.find('title') is None:
        head.append(html.Element('title'))
    head.find('title').text = page_title
    for element in head.xpath('meta[@property="og:title" or @name="twitter:title"]'):
        element.set('content', title)
    for element in head.xpath('meta[@name="description" or @property="og:description" or @name="twitter:description"]'):
        element.set('content', description)
    for element in head.xpath('meta[@property="og:url"]'):
        element.set('content', BASE + PREFIX[locale] + quote(path, safe='/%.~-'))
    for src in ['/js/i18n-messages.js', '/js/i18n.js']:
        if not head.xpath(f'script[@src="{src}"]'):
            head.append(html.Element('script', src=src, defer='defer'))
    if not head.xpath('link[@href="/css/i18n.css"]'):
        head.append(html.Element('link', rel='stylesheet', href='/css/i18n.css'))
    if not head.xpath('noscript[@id="i18n-no-script"]'):
        fallback=html.Element('noscript',id='i18n-no-script')
        style=html.Element('style')
        style.text='#navbarContent { display: block !important; } .navbar-toggler { display: none !important; }'
        fallback.append(style);head.append(fallback)


def add_language_switch(doc, path, locale):
    for old in doc.xpath('//*[@class="language-switch"]'):
        old.getparent().remove(old)
    toggles = doc.xpath('//*[@id="profileHeader"]//*[@id="theme-toggle"]')
    if not toggles:
        return
    details = html.Element('details', {'class': 'language-switch'})
    label = t('ui.language', locale) + ' · ' + LOCALES[locale]
    summary = html.Element('summary', {'aria-label': label, 'title': label})
    icon = etree.Element('svg', {'viewBox':'0 0 24 24','width':'18','height':'18','fill':'none','stroke':'currentColor','stroke-width':'2','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true','focusable':'false'})
    etree.SubElement(icon,'circle',cx='12',cy='12',r='9')
    etree.SubElement(icon,'path',d='M3 12h18M12 3a17 17 0 0 1 0 18 17 17 0 0 1 0-18')
    summary.append(icon)
    details.append(summary)
    nav = html.Element('nav', {'aria-label': t('ui.language', locale)})
    for code, name in LOCALES.items():
        anchor = html.Element('a', href=PREFIX[code] + quote(path, safe='/%.~-'), lang=code, hreflang=code, **{'data-language': code})
        anchor.text = name
        if code == locale:
            anchor.set('aria-current', 'true')
        nav.append(anchor)
    details.append(nav)
    toggle = toggles[0]
    container = toggle.getparent()
    classes = container.get('class','').split()
    if 'header-actions' not in classes:
        container.set('class',' '.join(classes + ['header-actions']))
    container.insert(container.index(toggle), details)


def translate_dates(doc, locale):
    months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    ru = ['янв.','февр.','мар.','апр.','мая','июн.','июл.','авг.','сент.','окт.','нояб.','дек.']
    # Older Hugo pages keep their publication date in the tail of an author separator.
    # Give every date a semantic time element before formatting it.
    for element in list(doc.iter()):
        if not isinstance(element.tag,str) or element.tag in ['script','style','time'] or any(a.tag in ['article','script','style','time'] for a in element.iterancestors()):continue
        for field in ['text','tail']:
            raw = getattr(element,field) or ''
            match = re.search(r'\b('+'|'.join(months)+r') (\d{1,2}), (\d{4})',raw)
            if not match:continue
            date = f'{match[3]}-{months.index(match[1])+1:02d}-{int(match[2]):02d}'
            node = html.Element('time',datetime=date)
            node.text = match[0];node.tail = raw[match.end():]
            setattr(element,field,raw[:match.start()])
            if field=='text':element.insert(0,node)
            else:element.addnext(node)
    for element in doc.xpath('//time | //*[@data-date]'):
        date = element.get('data-date') or element.get('datetime')
        raw = element.text or ''
        match = re.search(r'\b('+'|'.join(months)+r') (\d{1,2}), (\d{4})', raw)
        if match:
            date = f'{match[3]}-{months.index(match[1])+1:02d}-{int(match[2]):02d}'
        if not date:
            continue
        try:
            value = datetime.fromisoformat(date[:10])
        except ValueError:
            continue
        year, month, day = value.year, value.month, value.day
        if locale.startswith('zh') or locale == 'ja':
            formatted = f'{year}年{month}月{day}日'
        elif locale == 'ru':
            formatted = f'{day} {ru[month-1]} {year} г.'
        else:
            formatted = f'{months[month-1]} {day}, {year}'
        if match:
            element.text = raw[:match.start()] + formatted + raw[match.end():]
        elif element.tag == 'time' or not len(element):
            element.text = formatted
        element.set('data-date', value.strftime('%Y-%m-%d'))


def article_extras(doc, article, path, locale, title):
    content = article.text_content()
    cjk = re.compile(r'[\u3400-\u9fff\u3040-\u30ff]')
    minutes = max(1,ceil(len(cjk.findall(content))/500 + len(cjk.sub('',content).split())/225))
    for label in doc.xpath('//*[@id="readingTime"]'):
        label.text = ' · ' + t('reading.minutes',locale).replace('{count}',str(minutes))
    url = BASE+PREFIX[locale]+quote(path,safe='/%.~-')
    for anchor in doc.xpath('//aside[contains(@class,"social")]//a'):
        old = anchor.get('href','')
        if 'linkedin.com/' in old:href='https://www.linkedin.com/shareArticle?'+urlencode({'mini':'true','url':url});name='LinkedIn'
        elif 'twitter.com/' in old:href='https://twitter.com/share?'+urlencode({'text':title,'url':url});name='X / Twitter'
        elif 'whatsapp.com/' in old:href='https://api.whatsapp.com/send?'+urlencode({'text':title+' '+url});name='WhatsApp'
        elif old.startswith('mailto:'):href='mailto:?'+urlencode({'subject':title,'body':title+' '+url});name=t('action.sendMail',locale)
        else:continue
        anchor.set('href',href);anchor.set('aria-label',t('article.share',locale)+' · '+name)
    for meta in doc.xpath('//meta[@property="og:image:alt" or @name="twitter:image:alt"]'):
        meta.set('content',t('article.coverAlt',locale) if path=='/blogs/opencode-v2-extensions/' else title)


def localize_comments(doc, path, locale):
    # Keep existing comment threads attached to their original, unprefixed URL.
    scripts = doc.xpath('//script[not(@src)]')
    comment_scripts = [s for s in scripts if s.text and 'disqus.com/embed.js' in s.text]
    if not comment_scripts:return
    for duplicate in comment_scripts[1:]:duplicate.getparent().remove(duplicate)
    comment_scripts = comment_scripts[:1]
    for duplicate in doc.xpath('//*[@id="disqus_thread"]')[1:]:duplicate.getparent().remove(duplicate)
    for old in doc.xpath('//*[@id="i18n-comments"]'):old.getparent().remove(old)
    config = html.Element('script',id='i18n-comments')
    config.text = 'window.disqus_config = function () { this.page.url = '+json.dumps(BASE+quote(path,safe='/%.~-'))+'; this.language = '+json.dumps({'zh-CN':'zh','zh-TW':'zh_TW'}.get(locale,locale))+'; };'
    comment_scripts[0].addprevious(config)
    for script in comment_scripts:
        script.text=re.sub(r'window\.disqus_config\s*=\s*function\s*\(\)\s*\{.*?\};','',script.text,flags=re.S)
        # A local preview does not connect to Disqus or display an untranslated warning.
        script.text=script.text.replace("document.getElementById('disqus_thread').innerHTML = 'Disqus comments not available by default when the website is previewed locally.';",'')


def build_diagrams():
    diagrams=json.loads((ROOT/'i18n/diagrams.json').read_text())
    for filename,translations in diagrams.items():
        source=etree.parse(str(ROOT/'blogimages'/filename))
        for locale in LOCALES:
            if locale=='zh-CN':continue
            tree=deepcopy(source)
            for element in tree.iter():
                original=element.text or ''
                if original not in translations[locale]:continue
                element.text=translations[locale][original]
                if etree.QName(element).localname=='text':
                    size=float(element.get('font-size','15'))
                    measure=lambda text: sum(1 if ord(c)>0x2ff else .56 for c in text)*size
                    maximum=measure(original)+4
                    if measure(element.text)>maximum:
                        element.set('textLength',str(round(maximum,2)))
                        element.set('lengthAdjust','spacingAndGlyphs')
                    element.set('font-family','system-ui, sans-serif')
            output=ROOT/'blogimages'/locale/filename
            output.parent.mkdir(parents=True,exist_ok=True)
            tree.write(str(output),encoding='utf-8',xml_declaration=True)
    return diagrams


def build():
    files = [ROOT/'index.html', ROOT/'404.html']
    for folder in ['blogs','tags','categories','gallery']:
        files.extend(sorted((ROOT/folder).rglob('*.html')))
    sources = {file: file.read_text() for file in files}
    paths = {page_path(file) for file in files}
    index_source = json.loads((ROOT/'index.json').read_text())
    articles = {}
    for entry in index_source:
        slug = unquote(urlsplit(entry['permalink']).path).strip('/').split('/')[-1]
        if slug != 'gallery':
            articles[slug] = entry
    # Fail before writing any output if a requested translation is missing.
    for locale in LOCALES:
        if MESSAGES[locale].keys()!=MESSAGES['zh-CN'].keys():
            raise SystemExit(f'Incomplete message dictionary: {locale}')
    for locale in list(LOCALES)[1:]:
        for slug in articles:
            path = ROOT/'i18n'/locale/'posts'/f'{slug}.html'
            if not path.exists():
                raise SystemExit(f'Missing translation: {path.relative_to(ROOT)}')
    diagrams=build_diagrams()
    locale_bodies = {locale: {} for locale in LOCALES}
    for locale in LOCALES:
        for file, content in sources.items():
            doc = html.document_fromstring(content)
            path = page_path(file)
            alias = '/page/' in path
            slug = file.parent.name
            article = doc.xpath('//article')
            if article:
                if locale != 'zh-CN':
                    fragment = html.fragment_fromstring((ROOT/'i18n'/locale/'posts'/f'{slug}.html').read_text(), create_parent='article')
                    article[0].text = fragment.text
                    for child in list(article[0]): article[0].remove(child)
                    for child in fragment: article[0].append(deepcopy(child))
                    for image in article[0].xpath('.//img[@src]'):
                        for filename in diagrams:
                            if image.get('src')=='/blogimages/'+filename:
                                image.set('src','/blogimages/'+locale+'/'+filename)
                locale_bodies[locale][slug] = (article[0].text or '') + ''.join(etree.tostring(c,encoding='unicode',method='html') for c in article[0])
            localize_text(doc, locale)
            # Keep the longer translated navigation out of the search field's space.
            for element in doc.xpath('//*[@id="profileHeader"]//*[@class]'):
                classes=element.get('class').split()
                if 'navbar-expand-lg' in classes:classes[classes.index('navbar-expand-lg')]='navbar-expand-xl'
                if element.get('id')=='search' and 'd-md-block' in classes:classes[classes.index('d-md-block')]='d-xl-block'
                if 'd-md-none' in classes:classes[classes.index('d-md-none')]='d-xl-none'
                if 'nav-item' in classes and 'd-lg-block' in classes:classes.remove('d-lg-block')
                element.set('class',' '.join(classes))
            # Labels that share a Chinese word still have distinct contextual keys.
            for anchor in doc.xpath('//*[@id="profileHeader"]//a[contains(@class,"nav-link")]'):
                href = anchor.get('href','')
                for suffix,key in [('#about','nav.about'),('#experience','nav.experience'),('#contact','nav.contact'),('/blogs','nav.blogs'),('/tags','nav.tags'),('/gallery','nav.gallery')]:
                    if href.rstrip('/').endswith(suffix):
                        text_key(anchor,key,locale); attr_key(anchor,'aria-label',key,locale)
                        if anchor.get('title'): attr_key(anchor,'title',key,locale)
            for element in doc.xpath('//*[@id="search"]'):
                attr_key(element,'placeholder','search.placeholder',locale)
                attr_key(element,'aria-label','search.label',locale)
            for element in doc.xpath('//*[@id="theme-toggle"]'):
                attr_key(element,'aria-label','ui.toggleTheme',locale)
            for element in doc.xpath('//button[contains(@class,"navbar-toggler")]'):
                attr_key(element,'aria-label','ui.toggleNavigation',locale)
            for element in doc.xpath('//*[@id="topScroll"]'):
                attr_key(element,'aria-label','action.backToTop',locale)
            for element in doc.xpath('//a[contains(@class,"btn")][contains(@class,"float-end")]'):
                text_key(element,'action.read',locale)
            for anchor in doc.xpath('//a[@download]'):
                if (anchor.get('href') or '').endswith('article.md'):
                    text_key(anchor,'action.downloadMarkdown',locale)
            for card in doc.xpath('//div[contains(concat(" ",normalize-space(@class)," ")," card ")]'):
                links = card.xpath('.//a[contains(@class,"card-title")]')
                if not links: continue
                target = unquote(urlsplit(links[0].get('href','')).path).strip('/').split('/')
                target_slug = target[-1]
                if len(target)>1 and target[-2]=='blogs' and target_slug in articles:
                    key='post.'+target_slug
                    headings=links[0].xpath('.//h5')
                    if headings:text_key(headings[0],key+'.title',locale);attr_key(headings[0],'title',key+'.title',locale)
                    descriptions=card.xpath('.//div[contains(@class,"card-text")]/p')
                    if descriptions:text_key(descriptions[0],key+'.description',locale)
                    for image in card.xpath('.//img'):
                        attr_key(image,'alt',key+'.title',locale)
            if article:
                key='post.'+slug
                title,description=t(key+'.title',locale),t(key+'.description',locale)
                for heading in doc.xpath('//*[@id="single"]//div[contains(@class,"title")]/h1'):
                    text_key(heading,key+'.title',locale)
                headings={e.get('id'):e.text_content() for e in article[0].xpath('.//*[@id]') if e.tag in ['h1','h2','h3','h4','h5','h6']}
                for anchor in doc.xpath('//*[@id="TableOfContents"]//a'):
                    id_=unquote(anchor.get('href','').lstrip('#'))
                    if id_ in headings:set_text(anchor,headings[id_])
                for element in doc.xpath('//aside[contains(@class,"toc")]/h5'):text_key(element,'article.toc',locale)
                for element in doc.xpath('//aside[contains(@class,"tags")]/h5'):text_key(element,'article.tags',locale)
                for element in doc.xpath('//aside[contains(@class,"social")]/h5'):text_key(element,'article.share',locale)
                article_extras(doc,article[0],path,locale,title)
            elif path.startswith('/tags/') and path!='/tags/':
                title=t('tag.'+unquote(path.split('/')[2]),locale);description=t('site.description',locale)
            else:
                page_key={'/':'page.home','/blogs/':'page.blogs','/tags/':'page.tags','/gallery/':'page.gallery','/categories/':'page.categories','/404.html':'page.notFound'}.get(path,'page.home')
                title='Tommy Cheese' if path=='/' else t(page_key,locale);description=t('site.description',locale)
            for element in doc.xpath('//footer//div[@class="text-secondary"]'):
                set_text(element,t('footer.madeWith',locale))
                br=html.Element('br');br.tail=t('footer.poweredBy',locale);element.append(br)
            for element in doc.xpath('//footer//*[contains(text(),"©")]'):
                if element.text and '©' in element.text:element.text=t('footer.copyright',locale).replace('2024','2026')
            for element in doc.xpath('//footer//*[@data-i18n="footer.copyright"]'):
                element.text=t('footer.copyright',locale).replace('2024','2026')
            for element in doc.xpath('//noscript[contains(.,"Disqus")]'):
                set_text(element,t('comments.enableJavaScript',locale))
            # All UI links use the chosen edition; downloads/media stay shared.
            for element in doc.xpath('//*[@href]'):
                element.set('href',localized_url(element.get('href'),locale,path,paths))
            if alias:
                for element in doc.xpath('//meta[@http-equiv="refresh"]'):
                    value=element.get('content');target=value.split('url=',1)[-1]
                    element.set('content','0; url='+localized_url(target,locale,path,paths))
                doc.set('lang',locale)
            else:
                add_metadata(doc,path,locale,title,description)
                add_language_switch(doc,path,locale)
                translate_dates(doc,locale)
                localize_comments(doc,path,locale)
                # Existing article-only pages lack dynImg; avoid a theme toggle error.
                for script in doc.xpath('//script[not(@src)]'):
                    if script.text and 'let img = document.getElementById("dynImg");' in script.text and 'if (!img) return;' not in script.text:
                        script.text=script.text.replace('let img = document.getElementById("dynImg");','let img = document.getElementById("dynImg");\n                            if (!img) return;')
            output=ROOT/PREFIX[locale].lstrip('/')/file.relative_to(ROOT)
            output.parent.mkdir(parents=True,exist_ok=True)
            output.write_text(serialize_page(doc))
        entries=[]
        for entry in index_source:
            item=dict(entry)
            slug=unquote(urlsplit(entry['permalink']).path).strip('/').split('/')[-1]
            if slug in articles:
                item['title']=t('post.'+slug+'.title',locale)
                item['description']=t('post.'+slug+'.description',locale)
                item['content']=html.fragment_fromstring(locale_bodies[locale][slug],create_parent='article').text_content()
            else:
                item['title']=t('page.gallery',locale);item['description']=t('site.description',locale)
            item['permalink']=localized_url(entry['permalink'],locale,'/',paths)
            entries.append(item)
        (ROOT/PREFIX[locale].lstrip('/')/'index.json').write_text(json.dumps(entries,ensure_ascii=False,separators=(',',':'))+'\n')
    build_feeds(paths,articles,locale_bodies)
    print(f'Built {len(files)} pages × {len(LOCALES)} languages; {len(articles)} complete articles per language.')


def build_feeds(paths, articles, bodies):
    ns='http://www.sitemaps.org/schemas/sitemap/0.9'
    xhtml='http://www.w3.org/1999/xhtml'
    sitemap=etree.Element('{'+ns+'}urlset',nsmap={None:ns,'xhtml':xhtml})
    source_feeds=[]
    for folder in ['blogs','tags','categories','gallery']:
        source_feeds.extend((ROOT/folder).rglob('*.xml'))
    source_feeds.append(ROOT/'index.xml')
    feed_sources={p:etree.parse(str(p)) for p in source_feeds}
    original_sitemap = etree.parse(str(ROOT/'sitemap.xml'))
    last_modified = {url.findtext('{'+ns+'}loc'):url.findtext('{'+ns+'}lastmod') for url in original_sitemap.getroot()}
    for locale in LOCALES:
        for path in sorted(paths):
            if '/page/' in path or path=='/404.html':continue
            entry=etree.SubElement(sitemap,'{'+ns+'}url')
            etree.SubElement(entry,'{'+ns+'}loc').text=BASE+PREFIX[locale]+quote(path,safe='/%.~-')
            modified=last_modified.get(BASE+quote(path,safe='/%.~-'))
            if modified:etree.SubElement(entry,'{'+ns+'}lastmod').text=modified
            for code in LOCALES:
                etree.SubElement(entry,'{'+xhtml+'}link',rel='alternate',hreflang=code,href=BASE+PREFIX[code]+quote(path,safe='/%.~-'))
            etree.SubElement(entry,'{'+xhtml+'}link',rel='alternate',hreflang='x-default',href=BASE+quote(path,safe='/%.~-'))
        for file,source in feed_sources.items():
            tree=deepcopy(source)
            channel=tree.find('channel')
            if channel is None:continue
            language=channel.find('language')
            if language is None:language=etree.SubElement(channel,'language')
            language.text=locale
            for element in tree.iter():
                if element.tag in ['link','guid'] and element.text:
                    element.text=localized_url(element.text,locale,'/',paths)
                if element.tag.endswith('link') and element.get('href'):
                    element.set('href',localized_url(element.get('href'),locale,'/',paths))
            for item in channel.findall('item'):
                link=item.findtext('link') or ''
                slug=unquote(urlsplit(link).path).strip('/').split('/')[-1]
                if slug in articles:
                    item.find('title').text=t('post.'+slug+'.title',locale)
                    body=html.fragment_fromstring(bodies[locale][slug],create_parent='article')
                    for image in body.xpath('.//img[@src]'):
                        if image.get('src').startswith('/'):image.set('src',BASE+image.get('src'))
                    for anchor in body.xpath('.//a[@href]'):
                        href=localized_url(anchor.get('href'),locale,'/blogs/'+slug+'/',paths)
                        if href.startswith('/'):href=BASE+href
                        if href.startswith('#'):href=link+href
                        anchor.set('href',href)
                    item.find('description').text=(body.text or '')+''.join(etree.tostring(c,encoding='unicode',method='html') for c in body)
                elif 'tag.'+slug in MESSAGES[locale]:
                    item.find('title').text=t('tag.'+slug,locale)
                    item.find('description').text=t('tag.'+slug+'.description',locale) if 'tag.'+slug+'.description' in MESSAGES[locale] else ''
                elif slug=='gallery':
                    item.find('title').text=t('page.gallery',locale);item.find('description').text=''
                for category in item.findall('category'):
                    category.text=t('tag.agent开发',locale) if category.text=='Agent开发' else category.text
            relative=file.relative_to(ROOT)
            parts=relative.parts
            if len(parts)>2 and parts[0]=='blogs':key='post.'+parts[1]+'.title'
            elif len(parts)>2 and parts[0]=='tags':key='tag.'+parts[1]
            else:key={'blogs':'page.blogs','tags':'page.tags','categories':'page.categories','gallery':'page.gallery'}.get(parts[0],'page.home')
            name=t(key,locale)
            channel.find('title').text=name+' · Tommy Cheese'
            channel.find('description').text=t('site.description',locale)
            out=ROOT/PREFIX[locale].lstrip('/')/relative
            out.parent.mkdir(parents=True,exist_ok=True)
            tree.write(str(out),encoding='utf-8',xml_declaration=True,pretty_print=True)
    (ROOT/'sitemap.xml').write_bytes(etree.tostring(sitemap,encoding='utf-8',xml_declaration=True,pretty_print=True))


if __name__=='__main__':
    build()
