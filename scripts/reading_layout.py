"""Shared, static discovery and reading layout for every language edition."""
from copy import deepcopy
from urllib.parse import quote, unquote, urlsplit, urlunsplit
from lxml import html

ARCHITECTURE = ['再读整洁架构之道' + number for number in '一二三四五六']
MODEL_TRANSFER = '实用干货如何把pytorch模型参数加载到mindspore模型'
TOPICS = {
    'architecture': ARCHITECTURE + ['ddd领域驱动设计初识'],
    'agents': ['opencode-v2-extensions'],
    'machine-learning': [MODEL_TRANSFER, 'h'],
}
FEATURED = ['opencode-v2-extensions', ARCHITECTURE[0], MODEL_TRANSFER]


def enhance_layout(doc, path, locale, articles, messages, revision):
    def node(tag, text=None, **attrs):
        element = html.Element(tag, {key.rstrip('_').replace('_', '-'): value for key, value in attrs.items()})
        element.text = text
        return element

    def label(tag, key, **attrs):
        return node(tag, messages[key], data_i18n=key, **attrs)

    def post_url(slug):
        return '/blogs/' + quote(slug) + '/'

    def post_link(slug, featured=False):
        entry = articles[slug]
        link = node('a', href=post_url(slug), class_='featured-post' if featured else 'post-row')
        if featured and entry.get('image'):
            link.append(node('img', src=entry['image'], alt='', loading='lazy', decoding='async', width='480', height='180'))
        copy = node('div', class_='post-copy')
        copy.append(label('h3', 'post.' + slug + '.title'))
        copy.append(label('p', 'post.' + slug + '.description'))
        if entry.get('date'):
            copy.append(node('time', entry['date'], datetime=entry['date'], data_date=entry['date']))
        link.append(copy)
        return link

    # Rebuild owned fragments on every run; the Chinese output is also a source.
    for old in doc.xpath('//*[@data-reading-layout]'):
        old.getparent().remove(old)
    head = doc.find('head')
    head.append(node('link', rel='stylesheet', href='/css/reading.css?v=' + revision, data_reading_layout='style'))
    if not head.xpath('link[@type="application/rss+xml"][@title="RSS"]'):
        head.append(node('link', rel='alternate', type='application/rss+xml', title='RSS', href='/index.xml'))

    # Put content navigation first and keep the existing personal sections reachable.
    nav = doc.xpath('//*[@id="profileHeader"]//ul[contains(@class,"navbar-nav")]')
    if nav:
        menu = nav[0]
        for item in list(menu):
            if item.xpath('.//a[contains(@class,"nav-link")]'):
                menu.remove(item)
        start = 1 if len(menu) and menu[0].xpath('.//input') else 0
        for offset, (key, href) in enumerate([
            ('nav.blogs', '/blogs/'), ('nav.topics', '/topics/'),
            ('nav.tags', '/tags/'), ('nav.about', '/#about'), ('nav.gallery', '/gallery/'),
        ]):
            item = node('li', class_='nav-item navbar-text')
            anchor = label('a', key, href=href, class_='nav-link')
            if path == href:
                anchor.set('aria-current', 'page')
            item.append(anchor)
            menu.insert(start + offset, item)

    for old in doc.xpath('//*[@id="recent-posts"]'):
        if path in ['/', '/blogs/', '/topics/'] or doc.xpath('//article'):
            old.getparent().remove(old)
    footer = doc.find('.//footer')
    if footer is not None:
        feed = node('div', class_='feed-link container', data_reading_layout='feed')
        feed.append(label('a', 'action.subscribe', href='/index.xml'))
        footer.insert(0, feed)
    for anchor in doc.xpath('//a[starts-with(@href,"mailto:")]'):
        address = urlsplit(anchor.get('href'))
        anchor.set('href', urlunsplit(address._replace(path=quote(unquote(address.path).strip(), safe='@+,'))))

    def topic_links():
        links = node('div', class_='topic-links')
        for topic, slugs in TOPICS.items():
            anchor = node('a', href='/topics/#' + topic)
            anchor.append(label('strong', 'topics.' + topic + '.title'))
            anchor.append(node('span', messages['topics.count'].replace('{count}', str(len(slugs)))))
            links.append(anchor)
        return links

    if path == '/':
        hero = doc.get_element_by_id('hero')
        hero.clear()
        hero.set('id', 'hero')
        hero.set('class', 'home-intro')
        intro = node('div', class_='container intro-layout')
        identity = node('div')
        identity.append(label('p', 'homepage.greeting', class_='eyebrow'))
        identity.append(node('h1', 'Tommy Cheese'))
        identity.append(label('p', 'homepage.focus', class_='home-focus'))
        motto = node('p', class_='home-motto')
        motto.append(label('span', 'homepage.headline'))
        separator = node('span', ' · ', aria_hidden='true')
        motto.append(separator)
        motto.append(label('span', 'homepage.motto'))
        identity.append(motto)
        intro.append(identity)
        intro.append(node('img', id='dynImg', src='/images/town.jpg', alt='', width='200', height='150', class_='home-photo'))
        hero.append(intro)
        # Follow the applied theme, including the initial saved/system preference.
        # Bind after the existing theme handler so the image sees the new mode.
        doc.get_element_by_id('theme-toggle').attrib.pop('onclick', None)
        for script in doc.xpath('//script[not(@src)]'):
            if 'function imgchange()' in (script.text or ''):
                script.getparent().remove(script)
        image_theme = node('script', data_reading_layout='hero-theme')
        image_theme.text = '''
function syncHomeImage() {
  document.getElementById('dynImg').src = document.body.classList.contains('dark')
    ? '/exporeImages/2.jpg' : '/images/town.jpg';
}
syncHomeImage();
document.getElementById('theme-toggle').addEventListener('click', syncHomeImage);
'''
        doc.find('body').append(image_theme)

        content = hero.getparent()
        sections = []
        featured = node('section', id='featured-posts', class_='home-section container', data_reading_layout='featured', aria_labelledby='featured-heading')
        featured.append(label('h2', 'section.featured', id='featured-heading'))
        cards = node('div', class_='featured-grid')
        for slug in FEATURED:
            cards.append(post_link(slug, featured=True))
        featured.append(cards)
        sections.append(featured)

        topics = node('section', class_='home-section container', data_reading_layout='topics', aria_labelledby='topics-heading')
        topics.append(label('h2', 'nav.topics', id='topics-heading'))
        topics.append(topic_links())
        sections.append(topics)

        recent = node('section', id='recent-posts', class_='home-section container', data_reading_layout='recent', aria_labelledby='recent-heading')
        heading = node('div', class_='section-heading')
        heading.append(label('h2', 'section.recent', id='recent-heading'))
        heading.append(label('a', 'action.allPosts', href='/blogs/'))
        recent.append(heading)
        for slug in sorted(articles, key=lambda slug: articles[slug].get('date', ''), reverse=True)[:5]:
            recent.append(post_link(slug))
        sections.append(recent)
        for offset, section in enumerate(sections, start=1):
            content.insert(content.index(hero) + offset, section)

    if path == '/topics/':
        directory = doc.get_element_by_id('topics-page')
        directory.clear()
        directory.set('id', 'topics-page')
        directory.set('class', 'topic-directory container')
        directory.append(label('h1', 'nav.topics'))
        directory.append(label('p', 'topics.intro', class_='directory-intro'))
        directory.append(topic_links())
        for topic, slugs in TOPICS.items():
            section = node('section', id=topic, aria_labelledby=topic + '-heading')
            section.append(label('h2', 'topics.' + topic + '.title', id=topic + '-heading'))
            section.append(label('p', 'topics.' + topic + '.description', class_='topic-description'))
            for slug in slugs:
                section.append(post_link(slug))
            directory.append(section)

    article = doc.find('.//article')
    if article is not None:
        toc = doc.get_element_by_id('TableOfContents', None)
        if toc is not None and len(toc):
            mobile = node('div', class_='mobile-toc', data_reading_layout='toc')
            disclosure = node('details')
            disclosure.append(label('summary', 'article.toc'))
            navigation = deepcopy(toc)
            navigation.set('id', 'mobileTableOfContents')
            navigation.set('aria-label', messages['article.toc'])
            disclosure.append(navigation)
            mobile.append(disclosure)
            container = doc.xpath('//*[@id="single"]/div[contains(@class,"container")]')[0]
            container.insert(0, mobile)
            doc.find('body').append(node('script', src='/js/reading.js?v=' + revision, defer='defer', data_reading_layout='runtime'))

        slug = path.strip('/').split('/')[-1]
        topic = next((key for key, slugs in TOPICS.items() if slug in slugs), None)
        if topic:
            trail = node('nav', class_='reading-trail', aria_label=messages['article.continue'], data_reading_layout='trail')
            trail.append(label('h2', 'article.continue'))
            topic_link = label('a', 'topics.' + topic + '.title', href='/topics/#' + topic, class_='topic-backlink')
            trail.append(topic_link)
            if slug in ARCHITECTURE:
                index = ARCHITECTURE.index(slug)
                trail.append(node('p', messages['series.position'].replace('{current}', str(index + 1)).replace('{total}', str(len(ARCHITECTURE))), class_='series-position'))
                for neighbor, key in [(index - 1, 'article.previous'), (index + 1, 'article.next')]:
                    if 0 <= neighbor < len(ARCHITECTURE):
                        target = ARCHITECTURE[neighbor]
                        anchor = node('a', href=post_url(target), class_='series-neighbor', rel='prev' if neighbor < index else 'next')
                        anchor.append(label('span', key))
                        anchor.append(label('strong', 'post.' + target + '.title'))
                        trail.append(anchor)
            else:
                for target in [target for target in TOPICS[topic] if target != slug][:2]:
                    trail.append(post_link(target))
            article.addnext(trail)
