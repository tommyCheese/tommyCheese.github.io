"""Static giscus markup shared by every language edition."""
from urllib.parse import quote, urlencode
from lxml import html

REPOSITORY = 'tommyCheese/tommyCheese.github.io'
REPOSITORY_ID = 'R_kgDOMRkVTw'
CATEGORY = 'Announcements'
CATEGORY_ID = 'DIC_kwDOMRkVT84DFgwq'
BASE = 'https://tommycheese.github.io'


def render_comments(doc, path, locale, messages, revision):
    # Chinese generated pages are the next build's input. Recreate owned nodes.
    old_containers = doc.xpath('//*[@id="disqus_thread"]')
    old_parents = [element.getparent() for element in old_containers]
    for element in doc.xpath('//*[@data-comments-layout] | //*[@id="disqus_thread" or @id="i18n-comments"] | //script[contains(.,"disqus.com/embed.js") or contains(@src,"disqus.com")] | //noscript[contains(.,"Disqus") or @data-i18n="comments.enableJavaScript" or .//*[@data-i18n="comments.enableJavaScript"]] | //a[contains(@class,"dsq-brlink")]'):
        if element.getparent() is not None:
            element.getparent().remove(element)
    for parent in old_parents:
        if parent.tag == 'div' and not len(parent) and not (parent.text or '').strip():
            row = parent.getparent()
            if row is not None:
                row.remove(parent)
                if row.tag == 'div' and not len(row) and not (row.text or '').strip():
                    row.getparent().remove(row)
    article = doc.find('.//article')
    if article is None and path not in ['/', '/gallery/']:
        return

    def node(tag, text=None, **attrs):
        element = html.Element(tag, {key.rstrip('_').replace('_', '-'): value for key, value in attrs.items()})
        element.text = text
        return element

    def label(tag, key, **attrs):
        return node(tag, messages[key], data_i18n=key, **attrs)

    section = node('section', id='comments', class_='comments-section', data_comments_layout='section', aria_labelledby='comments-heading')
    section.append(label('h2', 'comments.title', id='comments-heading'))
    section.append(label('p', 'comments.intro', class_='comments-intro'))
    container = node('div', class_='giscus', data_repo=REPOSITORY, data_repo_id=REPOSITORY_ID,
                     data_category=CATEGORY, data_category_id=CATEGORY_ID, data_term=path, data_lang=locale)
    section.append(container)
    fallback = node('p', class_='comments-links')
    search = 'https://github.com/' + REPOSITORY + '/discussions?' + urlencode({'discussions_q': '"' + path + '"'})
    fallback.append(label('a', 'comments.onGitHub', href=search, target='_blank', rel='noopener noreferrer'))
    # Only the original homepage had public Disqus comments at migration time.
    # Keep its verified external thread reachable without loading Disqus here.
    if path == '/':
        fallback.append(label('a', 'comments.legacy', href='https://disqus.com/home/discussion/tommycheese/tommy_cheese_91/', target='_blank', rel='noopener noreferrer'))
    section.append(fallback)
    section.append(label('noscript', 'comments.enableJavaScript'))
    if article is not None:
        trail = article.getnext()
        (trail if trail is not None and trail.get('data-reading-layout') == 'trail' else article).addnext(section)
    else:
        section.set('class', 'comments-section container')
        doc.get_element_by_id('content').append(section)
    doc.find('head').append(node('meta', name='giscus:backlink', content=BASE + quote(path), data_comments_layout='backlink'))
    doc.find('body').append(node('script', src='/js/comments.js?v=' + revision, defer='defer', data_comments_layout='runtime'))
