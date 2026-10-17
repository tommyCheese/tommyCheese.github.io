import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {languageURL} from '../linux-lab/i18n-core.mjs';
const i18n=readFileSync(new URL('../linux-lab/i18n.mjs',import.meta.url),'utf8');
const app=readFileSync(new URL('../linux-lab/app.mjs',import.meta.url),'utf8');
function switchFromWelcome(page, control = 'welcome-language') {
  const location={href:'https://example.com/linux-lab/?example=test#starter/where-am-i',assign(url){this.href=String(url);}};
  vm.runInNewContext(i18n.slice(i18n.indexOf('  const switchLanguage ='),i18n.indexOf("  select.addEventListener('change'"))+`switchLanguage({target:{id:${JSON.stringify(control)},value:'en'}});`,{
    URL,location,languageURL,root:'https://example.com/linux-lab/',localStorage:{setItem(){}},
    document:{getElementById:()=>({open:true,dataset:{page:String(page)}})}
  });
  return new URL(location.href);
}
function startWelcome(url) {
  const nodes=new Map();
  const $=id=>{if(!nodes.has(id))nodes.set(id,{dataset:{},addEventListener(){},focus(){},showModal(){this.open=true;}});return nodes.get(id);};
  vm.runInNewContext(app.slice(app.indexOf('const WELCOME_KEY ='),app.indexOf('// Keep favorites in sync')),{
    $,URL,location:{href:url.href,search:url.search},history:{replaceState(){}},
    localStorage:{getItem:()=> 'seen'},onboardingReady:false,mode:'sandbox',training:null
  });
  return nodes;
}
for(const page of [0,1,2]) test(`welcome language switch retains open modal and page ${page+1} even when previously seen`,()=>{
  const url=switchFromWelcome(page),nodes=startWelcome(url);
  assert.equal(nodes.get('welcome-dialog').open,true);
  assert.equal(nodes.get('welcome-position').textContent,`${page+1} / 3`);
  assert.equal(url.pathname,'/linux-lab/en/');
  assert.equal(url.hash,'#starter/where-am-i');
  assert.equal(url.searchParams.get('example'),'test');
});

test('header language switch does not reopen a dismissed welcome',()=>{
  const url=switchFromWelcome(1,'lab-language');
  assert.equal(url.searchParams.has('welcome-page'),false);
  assert.notEqual(startWelcome(url).get('welcome-dialog').open,true);
});
for (const value of ['-1','3','NaN','']) test(`invalid welcome page ${JSON.stringify(value)} does not reopen the modal`,()=>{
  assert.notEqual(startWelcome(new URL('https://example.com/linux-lab/?welcome-page='+value)).get('welcome-dialog').open,true);
});
