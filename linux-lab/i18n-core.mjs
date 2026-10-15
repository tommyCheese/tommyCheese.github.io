export const languages = Object.freeze([
  {code:'zh-CN',name:'简体中文'}, {code:'en',name:'English'},
  {code:'ja',name:'日本語'}, {code:'ru',name:'Русский'}, {code:'zh-TW',name:'繁體中文'}
]);
export const localePrefix = code => code === 'zh-CN' ? '' : languages.some(item=>item.code === code) ? code + '/' : '';
const han = /[\u3400-\u9fff]/;
const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function countLabel(locale, number, unit) {
  const n=Number(number), index=unit==='项'?0:unit==='行'?1:2;
  if (locale==='en') return number+' '+['item','line','command'][index]+(n===1?'':'s');
  if (locale==='ru') {
    const forms=[['объект','объекта','объектов'],['строка','строки','строк'],['команда','команды','команд']][index];
    return number+' '+forms[n%100>=11 && n%100<=14?2:n%10===1?0:n%10>=2 && n%10<=4?1:2];
  }
  return number+' '+(locale==='ja'?['項目','行','コマンド'][index]:locale==='zh-TW'?['項','行','個指令'][index]:unit);
}
export function createTranslator(catalog = {}, locale = 'zh-CN') {
  const keys = Object.keys(catalog).filter(key=>han.test(key) && catalog[key] !== key).sort((a,b)=>b.length-a.length);
  const pattern = keys.length ? new RegExp(keys.map(escape).join('|'),'g') : null;
  return function translate(value) {
    const text = String(value ?? '');
    if (!han.test(text)) return text;
    if (/^(?:~?\/|\.{1,2}\/|[\w.-]+\/)/.test(text.trim()) && !/[。；：！？]/.test(text)) {
      const parts = text.split(' · ');
      return parts.length > 1 ? parts[0] + ' · ' + translate(parts.slice(1).join(' · ')) : text;
    }
    if (Object.hasOwn(catalog,text)) return catalog[text];
    const trimmed = text.trim();
    if (Object.hasOwn(catalog,trimmed)) return text.replace(trimmed,catalog[trimmed]);
    const counts=[];
    const input=text.replace(/(\d+) (项|行|条命令)/g,(_,number,unit)=>{counts.push(countLabel(locale,number,unit));return '\uE000'+(counts.length-1)+'\uE001';});
    return (pattern ? input.replace(pattern,source=>catalog[source]) : input).replace(/\uE000(\d+)\uE001/g,(_,index)=>counts[index]);
  };
}
export function languageURL(href, target, root) {
  const url = new URL(href), base = new URL(root);
  if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) return url.href;
  const relative = url.pathname.slice(base.pathname.length).replace(/^(en|ja|ru|zh-TW)\//,'');
  url.pathname = base.pathname + localePrefix(target) + relative;
  return url.href;
}
