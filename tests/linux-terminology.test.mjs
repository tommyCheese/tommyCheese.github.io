import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {lessonTerms,terminology} from '../linux-lab/terminology.mjs';
import {lessonIntroduction} from '../linux-lab/guidance.mjs';
import {lessons} from '../linux-lab/curriculum.mjs';
import {createTranslator} from '../linux-lab/i18n-core.mjs';
import {createReviewVariant} from '../linux-lab/review-variants.mjs';

const ids=lesson=>lessonTerms(lesson).map(term=>term.id);
test('shell syntax is explained as syntax, not as quoted text or negative numbers',()=>{
  assert.deepEqual(ids({solution:["echo 'a > b >> c | d && e || f ; g'",'seq 5 -2 1']}),['quotes']);
  const result=ids({solution:['cat < input | sort > output; echo done >> output && true || false']});
  for(const key of ['input','pipe','overwrite','sequence','append','and','or'])assert.ok(result.includes(key),key);
  assert.ok(ids({solution:['echo "$HOME"']} ).includes('variable'));
  assert.ok(!ids({solution:["echo '$HOME'"]}).includes('variable'));
  assert.ok(ids({solution:["echo 'home:'$HOME"]}).includes('variable'));
  assert.ok(!ids({solution:['echo "\\$HOME"']}).includes('variable'));
  assert.ok(!ids({solution:["echo text'$HOME'"]}).includes('variable'));
  assert.ok(ids({solution:['ls *.txt']}).includes('glob'));
  assert.ok(!ids({solution:["echo '*.txt'"]}).includes('glob'));
});
test('every lesson and review gets relevant, unique definitions without changing its goals',()=>{
  for(const source of lessons)for(const lesson of [source,...[0,1,2].map(round=>createReviewVariant(source,23,round))]) {
    const original=structuredClone(lesson),terms=lessonTerms(lesson),intro=lessonIntroduction(lesson);
    assert.ok(terms.length,source.id);
    assert.equal(new Set(terms.map(term=>term.id)).size,terms.length,source.id);
    assert.deepEqual(intro.terms,terms);
    assert.ok(terms.every(term=>term.label&&term.description));
    assert.deepEqual(lesson,original);
  }
  assert.ok(ids(lessons.find(l=>l.id==='write-note')).includes('overwrite'));
  assert.ok(ids(lessons.find(l=>l.id==='append-note')).includes('append'));
  assert.ok(ids(lessons.find(l=>l.id==='csv-column')).includes('fields'));
  assert.ok(ids(lessons.find(l=>l.id==='stop-worker')).includes('signal'));
});
test('Boss terminology follows its goals without disclosing reference commands',()=>{
  const terms=lessonTerms({solution:['grep ERROR log | sort > answer'],goals:[{type:'archive'},{type:'mode'}]},{boss:true});
  assert.deepEqual(terms.map(term=>term.id),['archive','permissions']);
});
test('all definitions are translated in every edition',()=>{
  for(const locale of ['en','ja','ru','zh-TW']) {
    const catalog=JSON.parse(readFileSync(new URL('../linux-lab/locales/'+locale+'.json',import.meta.url)));
    const translate=createTranslator(catalog,locale);
    for(const [id,texts] of Object.entries(terminology))for(const text of texts) {
      assert.ok(Object.hasOwn(catalog,text),locale+': '+id+': '+text);
      if(['en','ru'].includes(locale))assert.doesNotMatch(translate(text),/[\u3400-\u9fff]/,locale+': '+id);
    }
  }
});
test('all five entry pages expose the definition list and a focusable introduction heading',()=>{
  for(const edition of ['','en/','ja/','ru/','zh-TW/']) {
    const html=readFileSync(new URL('../linux-lab/'+edition+'index.html',import.meta.url),'utf8');
    assert.equal((html.match(/id="lesson-intro-terms"/g)||[]).length,1);
    assert.match(html,/<h2 id="lesson-intro-title" tabindex="-1">/);
  }
});
