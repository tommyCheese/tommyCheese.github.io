"""Shared, static discovery and reading layout for every language edition."""
from copy import deepcopy
from pathlib import Path
from urllib.parse import quote, unquote, urlsplit, urlunsplit
import json
from lxml import html

ARCHITECTURE = ['再读整洁架构之道' + number for number in '一二三四五六']
MODEL_TRANSFER = '实用干货如何把pytorch模型参数加载到mindspore模型'
TOPICS = {
    'architecture': ARCHITECTURE + ['ddd领域驱动设计初识'],
    'agents': ['opencode-v2-extensions'],
    'machine-learning': [MODEL_TRANSFER, 'h'],
}
FEATURED = ['opencode-v2-extensions', ARCHITECTURE[0], MODEL_TRANSFER]
NEWS = json.loads((Path(__file__).resolve().parents[1] / 'i18n/news.json').read_text())
NEWS_TAGS = NEWS['tags']
RESEARCH = json.loads((Path(__file__).resolve().parents[1] / 'i18n/research.json').read_text())


def research_archive_date(item):
    return item.get('collected_at', item['published_at'])


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

    news_items = sorted(NEWS['items'], key=lambda item: item['published_at'], reverse=True)

    research_items = sorted(RESEARCH['items'], key=research_archive_date, reverse=True)

    def news_card(item, preview=False, research=False):
        collection = 'research' if research else 'news'
        date = research_archive_date(item) if research else item['published_at']
        tags = item['tags'] if research else [item['category']]
        card = node('article', class_='news-card ' + ('news-preview' if preview else 'news-entry') + (' research-card' if research else ''),
                    data_news_tags=' '.join(tags))
        card.set('data-' + collection + '-id', item['id'])
        if item.get('image'):
            card.append(node('img', src=item['image'], alt='', loading='lazy', decoding='async', width='640', height='360', referrerpolicy='no-referrer', class_='news-file-photo' if item.get('file_photo') else ('news-cover news-cover-contain' if item.get('image_fit') == 'contain' else 'news-cover')))
        copy = node('div', class_='news-copy')
        if item.get('image_credit'):
            credit = item['image_credit'] + (' · ' + messages['news.filePhoto'] if item.get('file_photo') else '')
            copy.append(node('span', credit, class_='news-image-credit'))
        if research:
            copy.append(label('span', 'research.kind.' + item['kind'], class_='research-kind'))
        labels = node('div', class_='news-tags')
        for tag in tags:
            labels.append(label('a', ('research.tag.' if research else 'news.category.') + tag,
                                href='/' + collection + '/?tag=' + tag, class_='news-category', rel='tag', data_news_tag=tag))
        copy.append(labels)
        title = node('h3')
        main_link = label('a', collection + '.' + item['id'] + '.title', href=item['url'], class_='news-main-link',
                          target='_blank', rel='noopener noreferrer')
        title.append(main_link)
        copy.append(title)
        copy.append(label('p', collection + '.' + item['id'] + '.summary'))
        metadata = node('div', class_='news-meta')
        metadata.append(node('span', item['source']))
        if research and not preview:
            if item.get('venue'):
                metadata.append(node('span', item['venue'], class_='research-venue'))
            metadata.append(label('span', 'research.published'))
        if preview or research:
            metadata_date = date if preview else item['published_at']
            metadata.append(node('time', metadata_date, datetime=metadata_date))
        if research and not preview and item.get('collected_at'):
            metadata.append(label('span', 'research.collected'))
            metadata.append(node('time', item['collected_at'], datetime=item['collected_at']))
        metadata.append(label('span', 'news.original', class_='news-card-action', aria_hidden='true'))
        copy.append(metadata)
        card.append(copy)
        return card

    # Rebuild owned fragments on every run; the Chinese output is also a source.
    for old in doc.xpath('//*[@data-reading-layout]'):
        old.getparent().remove(old)
    head = doc.find('head')
    head.append(node('link', rel='stylesheet', href='/css/reading.css?v=' + revision, data_reading_layout='style'))
    head.append(node('link', rel='stylesheet', href='/css/interaction.css?v=' + revision, data_reading_layout='interaction-style'))
    doc.find('body').append(node('script', src='/js/interaction.js?v=' + revision, defer='defer', data_reading_layout='interaction-runtime'))
    # Search launchers open one native modal instead of two competing inputs.
    for old in doc.xpath('//*[@id="search"] | //*[@data-search-open]'):
        desktop = 'd-none' in old.get('class', '').split()
        trigger = node('button', type='button', class_='search-trigger' + (' d-none d-xl-inline-flex' if desktop else ''),
                       data_search_open='', aria_haspopup='dialog', aria_controls='search-content',
                       aria_label=messages['search.label'], data_i18n_aria_label='search.label', disabled='disabled')
        trigger.append(label('span', 'search.label'))
        trigger.append(node('kbd', 'Ctrl K', data_search_shortcut='', aria_hidden='true'))
        old.getparent().replace(old, trigger)
    for old in doc.xpath('//*[@id="search-content"]'):
        old.getparent().remove(old)
    search = node('dialog', id='search-content', class_='spotlight',
                  aria_label=messages['search.label'], data_i18n_aria_label='search.label',
                  data_reading_layout='search')
    field = node('div', class_='spotlight-field')
    field.append(node('i', class_='fas fa-search spotlight-icon', aria_hidden='true'))
    field.append(node('input', id='spotlight-query', type='search', autocomplete='off', spellcheck='false',
                      placeholder=messages['search.placeholder'], data_i18n_placeholder='search.placeholder',
                      aria_label=messages['search.label'], data_i18n_aria_label='search.label',
                      role='combobox', aria_autocomplete='list', aria_controls='search-results',
                      aria_expanded='false', enterkeyhint='search'))
    close = node('button', type='button', class_='spotlight-close', data_search_close='',
                 aria_label=messages['search.close'], data_i18n_aria_label='search.close')
    close.append(node('kbd', 'Esc', aria_hidden='true'))
    field.append(close)
    search.append(field)
    search.append(label('p', 'search.prompt', id='search-status', role='status', aria_live='polite', aria_atomic='true'))
    search.append(node('ul', id='search-results', role='listbox', tabindex='-1',
                       aria_label=messages['search.label'], data_i18n_aria_label='search.label'))
    search.append(label('div', 'search.keyboardHint', class_='spotlight-hint'))
    doc.find('body').append(search)
    if not head.xpath('link[@type="application/rss+xml"][@title="RSS"]'):
        head.append(node('link', rel='alternate', type='application/rss+xml', title='RSS', href='/index.xml'))

    # Put content navigation first and keep the existing personal sections reachable.
    nav = doc.xpath('//*[@id="profileHeader"]//ul[contains(@class,"navbar-nav")]')
    if nav:
        menu = nav[0]
        for item in list(menu):
            if item.xpath('.//a[contains(@class,"nav-link")]'):
                menu.remove(item)
        mobile_search = menu.xpath('./li[.//*[@data-search-open]]')
        if mobile_search:
            menu.remove(mobile_search[0])
            menu.insert(0, mobile_search[0])
        start = 1 if mobile_search else 0
        for offset, (key, href) in enumerate([
            ('nav.linuxLab', '/linux-lab/'), ('nav.news', '/news/'), ('nav.research', '/research/'), ('nav.blogs', '/blogs/'), ('nav.topics', '/topics/'),
            ('nav.tags', '/tags/'), ('nav.about', '/#about'), ('nav.gallery', '/gallery/'),
        ]):
            item = node('li', class_='nav-item navbar-text' + (' linux-lab-nav-item' if key == 'nav.linuxLab' else ''))
            anchor = label('a', key, href=href, class_='nav-link linux-lab-nav' if key == 'nav.linuxLab' else 'nav-link')
            if path == href:
                anchor.set('aria-current', 'page')
            item.append(anchor)
            menu.insert(start + offset, item)

    for old in doc.xpath('//*[@id="recent-posts"]'):
        if path in ['/', '/blogs/', '/topics/'] or path.startswith('/tags/') or doc.xpath('//article'):
            old.getparent().remove(old)
    footer = doc.find('.//footer')
    if footer is not None:
        feed = node('div', class_='feed-link container', data_reading_layout='feed')
        feed.append(label('a', 'action.subscribe', href='/index.xml'))
        footer.insert(0, feed)
    for anchor in doc.xpath('//a[starts-with(@href,"mailto:")]'):
        address = urlsplit(anchor.get('href'))
        anchor.set('href', urlunsplit(address._replace(path=quote(unquote(address.path).strip(), safe='@+,'))))

    def topic_links(include_research=True):
        links = node('div', class_='topic-links')
        for topic, slugs in TOPICS.items():
            anchor = node('a', href='/topics/#' + topic)
            anchor.append(label('strong', 'topics.' + topic + '.title'))
            anchor.append(node('span', messages['topics.count'].replace('{count}', str(len(slugs)))))
            links.append(anchor)
        if include_research:
            anchor = node('a', href='/research/')
            anchor.append(label('strong', 'nav.research'))
            anchor.append(node('span', messages['research.count'].replace('{count}', str(len(RESEARCH['items'])))))
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
        content.set('class', 'home-bento')
        topics = node('section', class_='home-section home-topics container', data_reading_layout='topics', aria_labelledby='topics-heading')
        topics.append(label('h3', 'nav.topics', id='topics-heading'))
        topics.append(topic_links(include_research=False))

        news = node('section', id='today-news', class_='home-section container', data_reading_layout='news', aria_labelledby='news-heading')
        heading = node('div', class_='section-heading news-heading')
        heading.append(label('h2', 'nav.news', id='news-heading'))
        heading.append(label('a', 'news.viewAll', href='/news/', class_='news-view-all'))
        news.append(heading)
        news.append(label('p', 'news.previewIntro', class_='news-intro'))
        grid = node('div', class_='news-grid')
        for item in news_items[:3]:
            grid.append(news_card(item, preview=True))
        news.append(grid)
        research = node('section', id='frontier-research', class_='home-section container', data_reading_layout='research', aria_labelledby='research-heading')
        heading = node('div', class_='section-heading news-heading')
        heading.append(label('h2', 'nav.research', id='research-heading'))
        heading.append(label('a', 'research.viewAll', href='/research/', class_='news-view-all'))
        research.append(heading)
        research.append(label('p', 'research.previewIntro', class_='news-intro'))
        grid = node('div', class_='news-grid')
        # Preview one recent item of each research type.
        for kind in ['preprint', 'research', 'conference-paper']:
            item = next((item for item in research_items if item['kind'] == kind), None)
            if item:
                grid.append(news_card(item, preview=True, research=True))
        research.append(grid)
        featured = node('section', id='featured-posts', class_='home-section container', data_reading_layout='featured', aria_labelledby='featured-heading')
        featured.append(label('h3', 'section.featured', id='featured-heading'))
        cards = node('div', class_='featured-grid')
        for slug in FEATURED:
            cards.append(post_link(slug, featured=True))
        lead_image = cards[0].find('img')
        if lead_image is not None:
            lead_image.set('loading', 'eager')
            lead_image.set('fetchpriority', 'high')
        featured.append(cards)

        recent = node('section', id='recent-posts', class_='home-section container', data_reading_layout='recent', aria_labelledby='recent-heading')
        heading = node('div', class_='section-heading')
        heading.append(label('h3', 'homepage.morePosts', id='recent-heading'))
        heading.append(label('a', 'action.allPosts', href='/blogs/'))
        recent.append(heading)
        more_posts = [slug for slug in sorted(articles, key=lambda slug: articles[slug].get('date', ''), reverse=True) if slug not in FEATURED]
        for slug in more_posts[:5]:
            recent.append(post_link(slug))
        essays = node('section', id='home-essays', data_reading_layout='essays', aria_labelledby='essays-heading')
        group_heading = node('div', class_='home-group-heading')
        group_heading.append(label('h2', 'nav.blogs', id='essays-heading'))
        essays.append(group_heading)
        essays.extend([featured, recent, topics])
        # Keep visual and keyboard reading order aligned, with frequent updates first.
        for offset, section in enumerate([news, research, essays], start=1):
            content.insert(content.index(hero) + offset, section)

    if path in ['/news/', '/research/']:
        is_research = path == '/research/'
        collection = 'research' if is_research else 'news'
        data = RESEARCH if is_research else NEWS
        items = research_items if is_research else news_items
        directory = doc.get_element_by_id(collection + '-page')
        directory.clear()
        directory.set('id', collection + '-page')
        directory.set('data-catalog', collection)
        directory.set('class', 'news-directory container')
        header = node('header', class_='news-page-heading')
        header.append(node('p', 'FRONTIER RESEARCH' if is_research else 'TECH DAILY', class_='eyebrow'))
        header.append(label('h1', 'nav.' + collection))
        header.append(label('p', collection + '.timelineIntro', class_='directory-intro'))
        header.append(node('p', messages['news.updated'].replace('{date}', data['updated_at']), class_='news-updated'))
        categories = node('nav', class_='news-categories', aria_label=messages['news.tags'], data_i18n_aria_label='news.tags')
        for tag in ['all'] + (RESEARCH['tags'] if is_research else NEWS_TAGS):
            key = 'news.filter.allTags' if tag == 'all' else ('research.tag.' if is_research else 'news.category.') + tag
            categories.append(label('a', key, href=path + (('?tag=' + tag) if tag != 'all' else ''),
                                    data_news_tag=tag, aria_current='true' if tag == 'all' else 'false', aria_controls='news-timeline'))
        header.append(categories)
        directory.append(header)
        dates = list(dict.fromkeys((research_archive_date(item) if is_research else item['published_at']) for item in items))
        filters = node('form', id='news-date-filter', class_='news-date-filter', hidden='hidden', data_catalog=collection,
                       aria_label=messages[collection + '.dates'], data_i18n_aria_label=collection + '.dates')
        filters.append(label('span', collection + '.dates', class_='news-filter-label', id='news-filter-label'))
        modes = node('div', class_='news-filter-modes', role='group', aria_labelledby='news-filter-label')
        for mode in ['all', 'today', 'week', 'range']:
            modes.append(label('button', 'news.filter.' + mode, type='button', data_news_period=mode,
                               aria_pressed='true' if mode == 'all' else 'false', aria_controls='news-timeline'))
        filters.append(modes)
        custom = node('div', id='news-custom-dates', class_='news-custom-dates', hidden='hidden')
        for field in ['start', 'end']:
            wrapper = node('label', class_='news-date-field', id='news-' + field + '-field')
            wrapper.append(label('span', 'news.filter.' + field))
            wrapper.append(node('input', type='date', id='news-' + field, name=field, required='required'))
            custom.append(wrapper)
        custom.append(label('button', collection + '.filter.apply', type='submit', class_='news-filter-apply'))
        filters.append(custom)
        filters.append(node('p', id='news-filter-status', class_='news-filter-status', role='status', aria_live='polite', aria_atomic='true'))
        directory.append(filters)
        timeline = node('div', id='news-timeline', class_='news-timeline')
        for date in dates:
            daily_items = [item for item in items if (research_archive_date(item) if is_research else item['published_at']) == date]
            day = node('section', id=collection + '-' + date, class_='news-day', data_news_date=date, aria_labelledby='heading-' + date)
            heading = node('div', class_='news-day-heading')
            title = node('h2', id='heading-' + date)
            title.append(node('time', date, datetime=date))
            heading.append(title)
            heading.append(node('span', messages[collection + '.count'].replace('{count}', str(len(daily_items))), class_='news-day-count'))
            day.append(heading)
            entries = node('div', class_='news-day-entries')
            for item in daily_items:
                entries.append(news_card(item, research=is_research))
            day.append(entries)
            timeline.append(day)
        directory.append(timeline)
        directory.append(label('p', collection + '.filter.empty', id='news-filter-empty', class_='news-filter-empty', hidden='hidden'))
        doc.find('body').append(node('script', src='/js/reading.js?v=' + revision, defer='defer', data_reading_layout='runtime'))

    if path == '/gallery/':
        directory = doc.get_element_by_id('list-page')
        for heading in directory.xpath('./h6'):
            if heading.text_content().strip() == '🌏':
                heading.getparent().remove(heading)
        laboratory = node('section', id='laboratory', class_='laboratory p-4', data_reading_layout='laboratory', aria_labelledby='laboratory-heading')
        laboratory.append(label('h2', 'lab.title', id='laboratory-heading'))
        product = node('a', href='/linux-lab/', class_='lab-product')
        product.append(node('span', '$ _', class_='lab-product-icon', aria_hidden='true'))
        copy = node('div', class_='lab-product-copy')
        copy.append(label('span', 'lab.productLabel', class_='lab-product-label'))
        copy.append(label('h3', 'nav.linuxLab'))
        copy.append(label('p', 'lab.linuxDescription'))
        copy.append(label('span', 'lab.open', class_='lab-product-action'))
        product.append(copy)
        laboratory.append(product)
        images = directory.xpath('./div[contains(@class,"card-group")]')[0]
        images.addprevious(laboratory)
        images.addprevious(label('h2', 'gallery.photos', id='gallery-photos-heading', class_='gallery-photos-heading px-4', data_reading_layout='photos-heading'))
        images.set('role', 'region')
        images.set('aria-labelledby', 'gallery-photos-heading')
        photos = list(images.iter('img'))
        for child in list(images):
            images.remove(child)
        images.set('class', 'card-group photo-gallery photo-wall')
        images.append(node('span', '🧀 Tommy Cheese', class_='photo-wall-title', aria_hidden='true'))
        toolbar = node('div', class_='photo-wall-toolbar')
        toolbar.append(label('button', 'gallery.resetWall', type='button', class_='photo-wall-reset'))
        images.append(toolbar)
        grid = node('div', class_='photo-grid')
        images.append(grid)
        for index, photo in enumerate(photos, 1):
            size = [82, 88, 80][(index - 1) % 3]
            tilt = [-3, 2.8, -1.7, 2.2, -3.5, 3, -2, 1.8, -2.7][(index - 1) % 9]
            slot = node('div', class_='photo-slot', data_photo_frame=['ivory', 'linen', 'slate', 'sage', 'sand', 'rose', 'silver', 'cream', 'ink'][(index - 1) % 9], data_photo_src=photo.get('src'), data_photo_size=str(size), style='--photo-size:' + str(size) + '%;--photo-tilt:' + str(tilt) + 'deg')
            tile = node('figure', class_='photo-tile')
            clip = node('button', type='button', class_='photo-clip', aria_label=messages['gallery.movePhoto'].replace('{number}', str(index)))
            tile.append(clip)
            print_ = node('div', class_='photo-print')
            open_ = node('button', type='button', class_='photo-open', aria_label=messages['gallery.openPhoto'].replace('{number}', str(index)))
            photo.set('class', 'viewer-enabled-image')
            photo.set('alt', '')
            photo.set('loading', 'lazy')
            photo.set('decoding', 'async')
            open_.append(photo)
            print_.append(open_)
            tile.append(print_)
            tile.append(node('span', str(index).zfill(2), class_='photo-number', aria_hidden='true'))
            tile.append(node('button', '↘', type='button', class_='photo-resize', role='slider', aria_label=messages['gallery.resizePhoto'].replace('{number}', str(index)), aria_valuemin='52', aria_valuemax='100', aria_valuenow=str(size)))
            slot.append(tile)
            grid.append(slot)
        for charm_id, x, y, tilt in [('bear',32,30,-8), ('racer',67,28,5), ('controller',51,48,-4), ('gpu',10,47,6), ('phone',94,44,-5), ('book',53,63,4)]:
            charm = node('button', type='button', class_='photo-charm', data_charm=charm_id, data_charm_x=str(x), data_charm_y=str(y), aria_label=messages['gallery.moveCharm'].replace('{name}', messages['gallery.charm.' + charm_id]), style='left:' + str(x) + '%;top:' + str(y) + '%;--charm-tilt:' + str(tilt) + 'deg')
            if charm_id in ('bear', 'gpu'):
                charm.set('data-charm-rope', '0' if charm_id == 'bear' else '1')
            icon = node('svg', viewBox='0 0 120 120', aria_hidden='true', focusable='false')
            icon.append(node('use', href='/images/gallery/charms.svg?v=' + revision + '#' + charm_id))
            charm.append(icon)
            grid.append(charm)
        for script in doc.xpath('//script[not(@src)]'):
            if 'new Viewer(' in (script.text or ''):
                script.getparent().remove(script)
        for stylesheet in doc.xpath('//link[starts-with(@href,"/css/gallery.css")]'):
            stylesheet.set('href', '/css/gallery.css?v=' + revision)
        for asset in doc.xpath('//script[contains(@src,"/viewer/")] | //link[contains(@href,"/viewer/")]'):
            asset.getparent().remove(asset)
        lightbox = node('dialog', id='photo-lightbox', class_='photo-lightbox', aria_label=messages['gallery.photos'], data_reading_layout='photo-lightbox')
        lightbox.append(node('img', class_='photo-large', alt=''))
        controls = node('div', class_='photo-lightbox-controls')
        controls.append(label('button', 'gallery.rehang', type='button', class_='photo-rehang'))
        lightbox.append(controls)
        doc.find('body').append(lightbox)
        doc.find('body').append(node('script', src='/js/gallery.mjs?v=' + revision, type='module', data_reading_layout='gallery-runtime'))

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

    article = doc.find('.//*[@id="single"]//article')
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
