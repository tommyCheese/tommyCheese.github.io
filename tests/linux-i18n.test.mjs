import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { languages, createTranslator, languageURL } from '../linux-lab/i18n-core.mjs';

test('language URLs preserve tasks, manual paths and query strings with a shared deployment root',()=>{
  const root='https://example.com/linux-lab/';
  assert.equal(languageURL(root+'?example=ls#starter/look-around','ja',root),root+'ja/?example=ls#starter/look-around');
  assert.equal(languageURL(root+'en/commands/od/','ru',root),root+'ru/commands/od/');
  assert.equal(languageURL(root+'zh-TW/#sandbox','zh-CN',root),root+'#sandbox');
  assert.equal(languageURL('https://other.example.com/','en',root),'https://other.example.com/');
  assert.deepEqual(languages.map(item=>item.code),['zh-CN','en','ja','ru','zh-TW']);
});

test('translation resolves whole messages first, then dynamic fragments without altering command tokens',()=>{
  const t=createTranslator({'已完成':'Completed','权限':'Permissions','目标完成':'Goals complete','查看目标':'Show goals'});
  assert.equal(t('查看目标'),'Show goals');
  assert.equal(t('已完成 3 · chmod 755'),'Completed 3 · chmod 755');
  assert.equal(t(' cp notes.txt backup.txt '),' cp notes.txt backup.txt ');
  assert.equal(t(' ~/projects/README.md '),' ~/projects/README.md ');
});

test('all language catalogs cover the checked-in source messages',()=>{
  const sources=JSON.parse(readFileSync(new URL('../linux-lab/locales/source.json',import.meta.url)));
  for (const {code} of languages.filter(item=>item.code!=='zh-CN')) {
    const catalog=JSON.parse(readFileSync(new URL('../linux-lab/locales/'+code+'.json',import.meta.url)));
    for (const source of sources) assert.ok(typeof catalog[source]==='string' && catalog[source].length,code+': '+source);
    assert.ok(!Object.values(catalog).some(value=>/__LL\d+__/i.test(value)),code+': translation token leaked');
  }
});

test('dynamic counts use the selected language plural rules',()=>{
  const en=createTranslator({},'en'),ru=createTranslator({},'ru');
  assert.equal(en('1 项'),'1 item');assert.equal(en('7 项'),'7 items');
  assert.equal(ru('1 行'),'1 строка');assert.equal(ru('3 行'),'3 строки');assert.equal(ru('12 行'),'12 строк');
  assert.equal(createTranslator({},'ja')('7 项'),'7 項目');
});
