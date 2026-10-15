#!/usr/bin/env python3
"""Build five static Linux Lab editions from checked-in translation catalogs."""
from pathlib import Path
from urllib.parse import urlsplit
import json,re
from copy import deepcopy
from lxml import html,etree
ROOT=Path(__file__).resolve().parents[1]
LAB=ROOT/'linux-lab'
LOCALES={'zh-CN':'简体中文','en':'English','ja':'日本語','ru':'Русский','zh-TW':'繁體中文'}
NS={'s':'http://www.sitemaps.org/schemas/sitemap/0.9','x':'http://www.w3.org/1999/xhtml'}
BASE=html.parse(str(LAB/'index.html')).xpath('//link[@rel="canonical"]/@href')[0]
def prefix(locale):return '' if locale=='zh-CN' else locale+'/'
def translator(catalog):
 keys=sorted((key for key in catalog if catalog[key]!=key),key=len,reverse=True)
 pattern=re.compile('|'.join(map(re.escape,keys)))
 def translate(text):
  if not text or not re.search('[\u3400-\u9fff]',text):return text
  if text in catalog:return catalog[text]
  value=text.strip()
  if value in catalog:return text.replace(value,catalog[value])
  return pattern.sub(lambda m:catalog[m.group()],text)
 return translate

def add_alternates(doc,relative,locale):
 head=doc.find('head')
 for old in head.xpath('link[@hreflang]'):head.remove(old)
 for code in [*LOCALES,'x-default']:
  etree.SubElement(head,'link',rel='alternate',hreflang=code,href=BASE+prefix(code if code!='x-default' else 'zh-CN')+relative)
 for node in doc.xpath('//link[@rel="canonical"]'):node.set('href',BASE+prefix(locale)+relative)
 for node in doc.xpath('//meta[@property="og:url"]'):node.set('content',BASE+prefix(locale)+relative)

def localize(doc,t):
 # Syntax placeholders are prose; executable examples and expected output are immutable.
 for node in doc.xpath('//pre/code'):
  previous=node.getparent().getprevious()
  if previous is not None and previous.tag=='h2' and previous.text_content()=='语法':node.text=t(node.text)
 for node in doc.iter():
  if not isinstance(node.tag,str):continue
  excluded=node.tag in ['script','style','pre','code'] or any(a.tag in ['script','style','pre','code'] for a in node.iterancestors())
  if not excluded and node.text:node.text=t(node.text)
  if node.tail and not any(a.tag in ['script','style','pre','code'] for a in node.iterancestors()):node.tail=t(node.tail)
  for attribute in ['title','placeholder','aria-label','content','data-search']:
   value=node.get(attribute)
   if value and (attribute!='content' or node.tag=='meta' and node.get('name')=='description' or node.get('property') in ['og:title','og:description']):node.set(attribute,t(value))

def build():
 originals={}
 for file in LAB.rglob('index.html'):
  relative=file.relative_to(LAB)
  if relative.parts[0] in LOCALES and relative.parts[0]!='zh-CN':continue
  path='' if relative==Path('index.html') else relative.parent.as_posix()+'/'
  originals[path]=html.document_fromstring(file.read_text())
 urls=[]
 for locale in LOCALES:
  catalog={} if locale=='zh-CN' else json.loads((LAB/'locales'/f'{locale}.json').read_text())
  t=(lambda value:value) if locale=='zh-CN' else translator(catalog)
  for relative,source in originals.items():
   doc=deepcopy(source);doc.set('lang',locale)
   if locale!='zh-CN':
    localize(doc,t)
    # UI assets are shared; document links stay within the localized edition.
    for node in doc.xpath('//script[@src] | //link[@rel="stylesheet" or @rel="icon"]'):
     attribute='src' if node.tag=='script' else 'href'
     value=node.get(attribute)
     if value and not urlsplit(value).scheme:node.set(attribute,'../'+value.removeprefix('./'))
   add_alternates(doc,relative,locale)
   target=LAB/prefix(locale)/relative/'index.html';target.parent.mkdir(parents=True,exist_ok=True)
   target.write_text('<!DOCTYPE html>\n'+etree.tostring(doc,encoding='unicode',method='html')+'\n')
   urls.append((BASE+prefix(locale)+relative,relative))
 sitemap=etree.Element('{'+NS['s']+'}urlset',nsmap={None:NS['s'],'xhtml':NS['x']})
 for url,relative in urls:
  entry=etree.SubElement(sitemap,'{'+NS['s']+'}url');etree.SubElement(entry,'{'+NS['s']+'}loc').text=url
  for code in [*LOCALES,'x-default']:
   etree.SubElement(entry,'{'+NS['x']+'}link',rel='alternate',hreflang=code,href=BASE+prefix(code if code!='x-default' else 'zh-CN')+relative)
 (LAB/'sitemap.xml').write_bytes(etree.tostring(sitemap,encoding='utf-8',xml_declaration=True,pretty_print=True))
 rootmap=etree.parse(str(ROOT/'sitemap.xml'))
 for entry in list(rootmap.getroot()):
  if (entry.findtext('s:loc',namespaces=NS) or '').startswith(BASE):rootmap.getroot().remove(entry)
 for entry in sitemap:rootmap.getroot().append(deepcopy(entry))
 rootmap.write(str(ROOT/'sitemap.xml'),encoding='utf-8',xml_declaration=True,pretty_print=True)
 # Keep existing blog pages in sync without rebuilding unrelated article content.
 for locale in LOCALES:
  folder=ROOT/(locale if locale!='zh-CN' else '')
  for file in folder.rglob('*.html'):
   if file.is_relative_to(LAB) or any(part in ['.git','.venv','node_modules'] for part in file.relative_to(ROOT).parts):continue
   if locale=='zh-CN' and file.relative_to(ROOT).parts[0] in LOCALES:continue
   source=file.read_text()
   target='/linux-lab/'+prefix(locale)
   updated=re.sub(r'(<a\b[^>]*data-i18n="nav\.linuxLab"[^>]*href=")[^"]*(")',lambda m:m[1]+target+m[2],source)
   if updated!=source:file.write_text(updated)
 print(f'Built {len(originals)} pages in {len(LOCALES)} languages ({len(urls)} URLs).')
if __name__=='__main__':build()
