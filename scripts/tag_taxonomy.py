"""Canonical blog tags, legacy URLs, and static tag pages/feeds."""
from copy import deepcopy
from email.utils import parsedate_to_datetime
from urllib.parse import quote, unquote, urlsplit
from lxml import html, etree

GROUPS = {
    'directions': ['软件架构', 'agent开发', '机器学习'],
    'subjects': ['整洁架构之道', '领域驱动设计', '插件开发', '模型迁移', '数学基础'],
}
TAGS = [tag for group in GROUPS.values() for tag in group]
POST_TAGS = {
    **{'再读整洁架构之道' + number: ['软件架构', '整洁架构之道'] for number in '一二三四五六'},
    'ddd领域驱动设计初识': ['软件架构', '领域驱动设计'],
    'opencode-v2-extensions': ['agent开发', '插件开发'],
    '实用干货如何把pytorch模型参数加载到mindspore模型': ['机器学习', '模型迁移'],
    'h': ['机器学习', '数学基础'],
}
ALIASES = {
    '阅读': '整洁架构之道',
    '系统建模': '领域驱动设计',
    '系统设计方法论': '软件架构',
    '深度学习': '机器学习',
    '昇腾': '模型迁移',
    '数值微分': '数学基础',
}


def canonical_tag_path(path):
    parts = path.split('/')
    if len(parts) > 2 and parts[1] == 'tags':
        parts[2] = ALIASES.get(parts[2], parts[2])
    return '/'.join(parts)


def members(tag, articles):
    return sorted((slug for slug in articles if tag in POST_TAGS[slug]),
                  key=lambda slug: articles[slug].get('date', ''), reverse=True)


def prepare_tag_sources(sources, root, articles):
    if set(articles) != set(POST_TAGS):
        raise ValueError('Every blog post must have a POST_TAGS entry in scripts/tag_taxonomy.py')
    for slug, tags in POST_TAGS.items():
        if len(tags) != 2 or tags[0] not in GROUPS['directions'] or tags[1] not in GROUPS['subjects']:
            raise ValueError(f'{slug}: expected one direction and one subject tag')
    template = sources[root / 'tags/index.html']
    for tag in TAGS + list(ALIASES):
        sources[root / 'tags' / tag / 'index.html'] = template
        target = '/tags/' + quote(ALIASES.get(tag, tag)) + '/'
        sources[root / 'tags' / tag / 'page/1/index.html'] = (
            '<html><head><meta charset="utf-8"><meta name="robots" content="noindex">'
            f'<link rel="canonical" href="{target}"><meta http-equiv="refresh" content="0; url={target}">'
            f'</head><body><a href="{target}">{target}</a></body></html>')


def render_tags(doc, path, articles, messages):
    def node(tag, text=None, **attrs):
        element = html.Element(tag, {key.rstrip('_').replace('_', '-'): value for key, value in attrs.items()})
        element.text = text
        return element

    def label(tag, key, **attrs):
        return node(tag, messages[key], data_i18n=key, **attrs)

    def tag_link(tag):
        return label('a', 'tag.' + tag, href='/tags/' + quote(tag) + '/', rel='tag')

    slug = path.strip('/').split('/')[-1]
    if doc.find('.//article') is not None and slug in POST_TAGS:
        for listing in doc.xpath('//aside[contains(@class,"tags")]//ul'):
            listing.clear()
            listing.set('class', 'tags-ul list-unstyled list-inline')
            for tag in POST_TAGS[slug]:
                item = node('li', class_='list-inline-item')
                item.append(tag_link(tag))
                listing.append(item)
        return
    if not path.startswith('/tags/'):
        return
    directory = doc.get_element_by_id('list-page')
    directory.clear()
    directory.set('id', 'list-page')
    directory.set('class', 'tag-directory topic-directory container')
    head = doc.find('head')
    for old in head.xpath('meta[@http-equiv="refresh" or @name="robots"] | link[@type="application/rss+xml"]'):
        head.remove(old)
    target = canonical_tag_path(path)
    head.append(node('link', rel='alternate', type='application/rss+xml', title='RSS', href=quote(target) + 'index.xml'))
    if slug in ALIASES:
        target_tag = ALIASES[slug]
        directory.append(label('h1', 'tags.moved'))
        directory.append(tag_link(target_tag))
        head.append(node('meta', name='robots', content='noindex'))
        # The builder localizes this redirect after rewriting the normal links.
        head.append(node('meta', http_equiv='refresh', content='0; url=' + quote(target)))
        return
    if path == '/tags/':
        directory.append(label('h1', 'page.tags'))
        directory.append(label('p', 'tags.intro', class_='directory-intro'))
        for group, tags in GROUPS.items():
            section = node('section', data_tag_group=group, aria_labelledby='tags-' + group)
            section.append(label('h2', 'tags.' + group, id='tags-' + group))
            grid = node('div', class_='tag-grid')
            for tag in tags:
                link = node('a', href='/tags/' + quote(tag) + '/', class_='tag-card', data_tag=tag)
                heading = node('div', class_='section-heading')
                heading.append(label('h3', 'tag.' + tag))
                heading.append(node('span', messages['topics.count'].replace('{count}', str(len(members(tag, articles))))))
                link.append(heading)
                link.append(label('p', 'tag.' + tag + '.description'))
                grid.append(link)
            section.append(grid)
            directory.append(section)
    else:
        directory.append(label('a', 'tags.all', href='/tags/', class_='topic-backlink'))
        directory.append(label('h1', 'tag.' + slug))
        directory.append(label('p', 'tag.' + slug + '.description', class_='directory-intro'))
        matched = members(slug, articles)
        directory.append(node('p', messages['topics.count'].replace('{count}', str(len(matched))), class_='tag-count'))
        for post in matched:
            link = node('a', href='/blogs/' + quote(post) + '/', class_='post-row')
            copy = node('div', class_='post-copy')
            copy.append(label('h3', 'post.' + post + '.title'))
            copy.append(label('p', 'post.' + post + '.description'))
            date = articles[post].get('date', '')
            copy.append(node('time', date, datetime=date))
            link.append(copy)
            directory.append(link)
        directory.append(label('a', 'tags.subscribe', href=quote(path) + 'index.xml', class_='tag-subscribe'))


def prepare_tag_feeds(feeds, root, base):
    template = feeds[root / 'blogs/index.xml']
    posts = {unquote(urlsplit(item.findtext('link')).path).strip('/').split('/')[-1]: item
             for item in template.findall('channel/item')}
    if set(posts) != set(POST_TAGS):
        raise ValueError('Blog RSS and POST_TAGS must contain the same posts')

    def feed(path, items):
        tree = deepcopy(template)
        channel = tree.find('channel')
        for old in channel.findall('item'):
            channel.remove(old)
        channel.extend(deepcopy(items))
        channel.find('link').text = base + quote(path)
        channel.find('{http://www.w3.org/2005/Atom}link').set('href', base + quote(path) + 'index.xml')
        channel.find('lastBuildDate').text = max((item.findtext('pubDate') for item in items), key=parsedate_to_datetime)
        return tree

    tag_items = []
    for tag in TAGS:
        selected = [item for slug, item in posts.items() if tag in POST_TAGS[slug]]
        selected.sort(key=lambda item: parsedate_to_datetime(item.findtext('pubDate')), reverse=True)
        tree = feed('/tags/' + tag + '/', selected)
        feeds[root / 'tags' / tag / 'index.xml'] = tree
        item = etree.Element('item')
        for key, value in [('title', tag), ('link', base + '/tags/' + quote(tag) + '/'),
                           ('guid', base + '/tags/' + quote(tag) + '/'),
                           ('pubDate', selected[0].findtext('pubDate')), ('description', '')]:
            etree.SubElement(item, key).text = value
        tag_items.append(item)
    feeds[root / 'tags/index.xml'] = feed('/tags/', tag_items)
    # XML subscribers keep receiving updates at their original feed URL.
    for old, target in ALIASES.items():
        feeds[root / 'tags' / old / 'index.xml'] = feeds[root / 'tags' / target / 'index.xml']
