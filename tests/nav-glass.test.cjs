const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');

const source = readFileSync(join(__dirname, '../js/interaction.js'), 'utf8');

function setup(selected = 'news', pathname = '/news/', hash = '') {
  const listeners = new Map();
  const listen = name => (event, callback) => {
    const key = name + ':' + event;
    listeners.set(key, [...(listeners.get(key) || []), callback]);
  };
  const fire = (name, event, value = {}) => (listeners.get(name + ':' + event) || []).forEach(fn => fn(value));
  const classes = new Set();
  const styles = new Map();
  const rects = {
    news: { left: 300, top: 25, width: 80, height: 40 },
    research: { left: 400, top: 25, width: 100, height: 40 },
    essays: { left: 250, top: 80, width: 90, height: 40 },
    about: { left: 550, top: 25, width: 60, height: 40 }
  };
  const links = Object.keys(rects).map(id => {
    const attrs = new Map([['data-i18n', 'nav.' + id]]);
    if (id === selected) attrs.set('aria-current', 'page');
    return {
      id, href: id === 'about' ? '/en/?v=test#about' : '/' + id + '/',
      getAttribute: name => attrs.get(name) ?? null,
      setAttribute: (name, value) => attrs.set(name, value), removeAttribute: name => attrs.delete(name),
      getBoundingClientRect: () => rects[id], closest() { return this; }
    };
  });
  const nav = {
    classList: { add: value => classes.add(value), remove: value => classes.delete(value), contains: value => classes.has(value) },
    style: { setProperty: (name, value) => styles.set(name, value) },
    clientLeft: 1, clientTop: 1, scrollLeft: 0, scrollTop: 0,
    querySelectorAll: () => links, addEventListener: listen('nav'),
    getBoundingClientRect: () => ({ left: 100, top: 20 })
  };
  const navbar = { querySelector: () => nav, addEventListener: listen('navbar') };
  const pointer = { matches: true, addEventListener: listen('pointer') };
  const reduced = { matches: false, addEventListener: listen('reduced') };
  const location = { href: 'http://localhost:4173' + pathname + hash, pathname, hash };
  runInNewContext(source, {
    URL,
    window: { location, matchMedia: query => query.includes('reduced-motion') ? reduced : pointer, addEventListener: listen('window') },
    document: {
      getElementById: id => id === 'navbarContent' ? navbar : null
    }
  });
  return { fire, classes, styles, links, rects, pointer, reduced, location };
}

test('About selection follows the localized anchor, including direct loads and hash navigation', () => {
  const { fire, links, location, styles } = setup(null, '/en/', '#about');
  const about = links.find(link => link.id === 'about');
  assert.equal(about.getAttribute('aria-current'), 'page');
  assert.equal(styles.get('--nav-x'), '449px');
  location.hash = '#comments';
  fire('window', 'hashchange');
  assert.equal(about.getAttribute('aria-current'), null);
  location.hash = '#about';
  fire('window', 'hashchange');
  assert.equal(about.getAttribute('aria-current'), 'page');
  const homepage = setup(null, '/en/');
  assert.equal(homepage.links.find(link => link.id === 'about').getAttribute('aria-current'), null);
  const otherPage = setup('news', '/news/', '#about');
  assert.equal(otherPage.links[0].getAttribute('aria-current'), 'page');
  assert.equal(otherPage.links.find(link => link.id === 'about').getAttribute('aria-current'), null);
});

test('one glass highlight follows hovered or focused links and returns to the current page', () => {
  const { fire, classes, styles, links } = setup();
  assert.equal(styles.get('--nav-x'), '199px');
  assert.ok(classes.has('has-liquid'));

  fire('nav', 'pointerover', { pointerType: 'mouse', target: links[1] });
  assert.equal(styles.get('--nav-x'), '299px');
  assert.equal(styles.get('--nav-width'), '100px');
  fire('nav', 'pointermove', { pointerType: 'mouse', clientX: 499 });
  assert.equal(styles.get('--nav-glint'), '88%');
  fire('nav', 'pointerleave');
  assert.equal(styles.get('--nav-x'), '199px');

  fire('nav', 'focusin', { target: links[2] });
  assert.equal(styles.get('--nav-x'), '149px');
  assert.equal(styles.get('--nav-y'), '59px');
  fire('nav', 'focusout', { relatedTarget: null });
  assert.equal(styles.get('--nav-x'), '199px');
  assert.equal(links[0].getAttribute('aria-current'), 'page');
  assert.equal(links[1].getAttribute('aria-current'), null);
});

test('glass handles no current page, touch, hidden menus and changed link geometry', () => {
  const { fire, classes, styles, links, rects, pointer, reduced } = setup(null);
  assert.ok(!classes.has('has-liquid'));
  fire('nav', 'pointerover', { pointerType: 'touch', target: links[0] });
  assert.ok(!classes.has('has-liquid'));
  pointer.matches = false;
  fire('nav', 'pointerover', { pointerType: 'mouse', target: links[0] });
  assert.ok(!classes.has('has-liquid'));

  reduced.matches = true;
  fire('nav', 'focusin', { target: links[0] });
  assert.ok(classes.has('has-liquid'));
  rects.news = { left: 130, top: 160, width: 280, height: 44 };
  fire('window', 'resize');
  assert.equal(styles.get('--nav-x'), '29px');
  assert.equal(styles.get('--nav-y'), '139px');
  assert.equal(styles.get('--nav-width'), '280px');
  rects.news.width = 0;
  fire('window', 'resize');
  assert.ok(!classes.has('has-liquid'));
  rects.news.width = 280;
  fire('navbar', 'shown.bs.collapse');
  assert.ok(classes.has('has-liquid'));
  fire('window', 'blur');
  assert.ok(!classes.has('has-liquid'));
});
