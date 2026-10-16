import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { languages, createTranslator, languageURL } from '../linux-lab/i18n-core.mjs';
import { createContentLocalizer } from '../linux-lab/content-i18n.mjs';
import { Shell, seedState, evaluate } from '../linux-lab/shell.mjs';
import { lessons, manuals, createLessonShell } from '../linux-lab/curriculum.mjs';
import { varyExercise } from '../linux-lab/learning.mjs';
import { alternativeSolutions } from '../linux-lab/practice-support.mjs';

const contentSources = [
  ...Object.values(seedState().fs).map(node=>node.text || ''),
  ...lessons.flatMap(lesson=>Object.values(lesson.seed?.files || {}))
];
const catalogFor = code => code === 'zh-CN' ? {} : JSON.parse(readFileSync(new URL('../linux-lab/locales/'+code+'.json',import.meta.url)));

test('simulated README content follows the selected language before commands read it',()=>{
  const catalog=catalogFor('en'), localize=createContentLocalizer(catalog,contentSources);
  const shell=new Shell(localize(seedState()),manuals,localize);
  assert.equal(shell.execute('cat README.txt').stdout,createTranslator(catalog)('欢迎来到 Linux 命令实验室。\n先理解目标，再选择命令。\n'));
});

test('all localized scenarios and review variants still accept their reference solutions',()=>{
  for (const {code} of languages) {
    const catalog=catalogFor(code), localize=createContentLocalizer(catalog,contentSources);
    class LocalizedShell extends Shell {
      constructor(state,manuals) { super(localize(state),manuals,localize); }
    }
    for (const source of lessons) {
      const lesson=localize(source), initial=createLessonShell(LocalizedShell,seedState,lesson);
      if (['compress-text','decompress-text','read-welcome','create-workspace'].includes(source.id)) assert.ok(alternativeSolutions(lesson,initial.state,localize).length,code+': '+source.id+': reference solutions');
      const variants=[{lesson,state:initial.state},varyExercise(lesson,initial.state,7)];
      for (const variant of variants) {
        const shell=new LocalizedShell(variant.state,manuals), outputs=new Set(); let result;
        for (const command of variant.lesson.solution) {
          result=shell.execute(command);
          assert.equal(result.stderr,'',code+': '+source.id+': '+command);
          evaluate(variant.lesson.goals,shell.state,result).forEach((goal,index)=>{if(goal.type === 'output' && goal.done) outputs.add(index);});
        }
        const goals=evaluate(variant.lesson.goals,shell.state,result);
        assert.ok(goals.every((goal,index)=>goal.done || goal.type === 'output' && outputs.has(index)),code+': '+source.id+': '+JSON.stringify(goals.filter((goal,index)=>!goal.done && !outputs.has(index))));
      }
    }
  }
});

test('language changes migrate files, archives and undo snapshots while retaining learner data',()=>{
  const source=seedState();
  source.fs['/home/learner/custom.txt']={type:'file',text:'我的笔记：欢迎来到 Linux 命令实验室。\n用户自写内容\n',mode:'600',owner:'learner'};
  source.history=['echo "欢迎来到 Linux 命令实验室。" > custom.txt'];
  let saved={state:source,transcript:[{command:source.history[0],stdout:source.fs['/home/learner/README.txt'].text}],undoRedo:{past:[{state:source}],future:[]}};
  let previous={};
  for (const code of ['en','ja','ru','zh-TW','zh-CN']) {
    const catalog=catalogFor(code), localize=createContentLocalizer(catalog,contentSources,previous);
    saved=localize(saved);
    const expected=createTranslator(catalog)(source.fs['/home/learner/README.txt'].text);
    assert.equal(saved.state.fs['/home/learner/README.txt'].text,expected,code);
    assert.equal(saved.undoRedo.past[0].state.fs['/home/learner/README.txt'].text,expected,code);
    assert.equal(saved.transcript[0].stdout,expected,code);
    assert.equal(saved.state.fs['/home/learner/custom.txt'].text,source.fs['/home/learner/custom.txt'].text);
    assert.equal(saved.state.history[0],source.history[0]);
    assert.equal(saved.transcript[0].command,source.history[0]);
    const shell=new Shell(saved.state,manuals,localize);
    shell.execute('gzip -k README.txt');shell.execute('tar -cf docs.tar README.txt');
    assert.equal(shell.read('README.txt.gz'),createTranslator(catalog)('[教学 gzip]\n'));
    assert.equal(shell.read('docs.tar'),createTranslator(catalog)('[教学归档：1 个条目]\n'));
    saved.state=shell.state;
    assert.equal(saved.state.archives['/home/learner/README.txt.gz'].text,expected);
    assert.equal(saved.state.archives['/home/learner/docs.tar']['README.txt'].text,expected);
    previous=catalog;
  }
});

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
