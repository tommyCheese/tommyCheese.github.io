import { languages, localePrefix, createTranslator, languageURL } from './i18n-core.mjs?v=20261016-adaptive-review-3';
export const locale = languages.some(item=>item.code === document.documentElement.lang) ? document.documentElement.lang : 'zh-CN';
const root = new URL('./',import.meta.url);
export const localeRoot = new URL(localePrefix(locale),root);
const catalogs = new Map([['zh-CN',Promise.resolve({})]]);
export function loadCatalog(code) {
  if (!languages.some(item=>item.code === code)) code='zh-CN';
  if (!catalogs.has(code)) catalogs.set(code,fetch(new URL('locales/' + code + '.json?v=20261020-intro-terms-1',root)).then(response=>{
    if (!response.ok) throw new Error('Unable to load language: ' + code);
    return response.json();
  }));
  return catalogs.get(code);
}
export const catalog = await loadCatalog(locale);
export const translate = createTranslator(catalog,locale);
let initialized = false;
export function setupI18n() {
  if (initialized) return;
  initialized = true;
  const select = document.createElement('select');
  select.className = 'lab-language'; select.id = 'lab-language'; select.setAttribute('aria-label',translate('语言'));
  for (const item of languages) {
    const option = document.createElement('option'); option.value = item.code; option.textContent = item.name;
    select.append(option);
  }
  select.value = locale;
  const switchLanguage = event => {
    try { localStorage.setItem('site-language',event.target.value); } catch {}
    const destination = new URL(languageURL(location.href,event.target.value,root));
    const welcome = document.getElementById('welcome-dialog');
    if (event.target.id === 'welcome-language' && welcome?.open) {
      destination.searchParams.set('welcome-page', welcome.dataset.page || '0');
    }
    location.assign(destination.href);
  };
  select.addEventListener('change',switchLanguage);
  document.querySelector('header nav')?.append(select);
  const welcomeBar = document.querySelector('.welcome-bar');
  if (welcomeBar) {
    const welcomeSelect = select.cloneNode(true);
    welcomeSelect.id = 'welcome-language'; welcomeSelect.value = locale;
    welcomeSelect.addEventListener('change',switchLanguage);
    welcomeBar.insertBefore(welcomeSelect,document.getElementById('welcome-close'));
  }
  if (locale === 'zh-CN') return;
  const rendered = new WeakMap(), attributes = new WeakMap();
  const excluded = 'script,style,pre,code,textarea,input,[data-no-i18n],.lab-language,#file-tree,#file-list,#preview-name,#preview-text,#file-location';
  const localizedCode = '#hint-content,#lesson-intro-syntax,.intro-syntax,.terminal-error';
  function text(node) {
    const parent = node.parentElement;
    if (!parent || parent.closest(excluded) && !parent.closest(localizedCode)) return;
    if (rendered.get(node) === node.nodeValue) return;
    const result = translate(node.nodeValue);
    rendered.set(node,result);
    if (result !== node.nodeValue) node.nodeValue = result;
  }
  function attrs(node) {
    if (!node.getAttribute || node.closest('.lab-language,[data-no-i18n]')) return;
    const previous = attributes.get(node) || {};
    for (const name of ['title','aria-label','placeholder']) {
      const value = node.getAttribute(name);
      if (value === null || previous[name] === value) continue;
      const result = translate(value); previous[name] = result;
      if (value !== result) node.setAttribute(name,result);
    }
    attributes.set(node,previous);
  }
  function tree(node) {
    if (node.nodeType === Node.TEXT_NODE) { text(node); return; }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    attrs(node);
    for (const child of node.childNodes) tree(child);
  }
  // Static editions already contain translated HTML. Only translate subsequent renders.
  const walker = document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) rendered.set(walker.currentNode,walker.currentNode.nodeValue);
  attrs(document.getElementById('theme-toggle') || document.body);
  new MutationObserver(records=>{
    for (const record of records) {
      if (record.type === 'characterData') text(record.target);
      else if (record.type === 'attributes') attrs(record.target);
      else for (const child of record.addedNodes) tree(child);
    }
  }).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','aria-label','placeholder']});
}
