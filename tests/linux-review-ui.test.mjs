import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { reviewPlan, validExercise, mastery } from '../linux-lab/learning.mjs';
import { createTranslator } from '../linux-lab/i18n-core.mjs';

const source = readFileSync(new URL('../linux-lab/app.mjs', import.meta.url), 'utf8');
const start = source.indexOf('function resumableReview()');
const render = source.slice(start, source.indexOf('\nfunction beginTraining(', start));
function reviewPage(exercise) {
  const nodes = new Map();
  function element(tag, textContent = '', className = '') {
    return {tag, textContent, className, hidden:false, disabled:false, value:'300', children:[], attrs:{},
      append(...children) { this.children.push(...children); },
      replaceChildren(...children) { this.children = children; },
      setAttribute(key,value) { this.attrs[key]=value; }, addEventListener(type,callback) { this[type]=callback; }};
  }
  const $ = id => { if (!nodes.has(id)) nodes.set(id,element('div')); return nodes.get(id); };
  const lessons = Array.from('abcdefgh',id=>({id,title:id,chapter:id,level:'common'}));
  const ids = new Set(lessons.map(item=>item.id));
  const saved = {session:exercise ? {exercise} : undefined};
  const starts=[];
  const context = {$,element,lessons,ids,saved,completed:new Set(ids),learning:{},reviewSummary:null,location:{hash:''},beginTraining:(...args)=>starts.push(args),
    reviewPlan,validExercise,mastery,skillLabel:item=>item.title,currentId:'a',starterRoute:[],mode:'review'};
  vm.runInNewContext(render+'\nrenderLearning();',context);
  vm.runInNewContext(source.match(/\$\('review-start'\)\.addEventListener\('click',\(\)=> \{[\s\S]*?\n\}\);/)[0],context);
  return {nodes,$,saved,context,starts,render:()=>vm.runInNewContext('renderLearning();',context)};
}
const descendants = node => [node,...node.children.flatMap(descendants)];

test('review overview has one entry and a read-only task preview',()=>{
  const page=reviewPage({kind:'review',queue:['b','c','d'],index:1,variant:4,budget:300});
  assert.ok(!page.$('review-start').hidden && !page.$('review-start').disabled);
  assert.ok(!page.nodes.has('review-resume') || page.$('review-resume').hidden, 'start and resume must not compete');
  assert.equal(page.$('review-start').textContent,'继续复习 →');
  assert.equal(page.$('review-budget-field').hidden,true);
  assert.equal(page.$('review-budget').disabled,true);
  assert.deepEqual(page.$('review-list').children.map(card=>descendants(card).find(node=>node.tag==='h3').textContent),['c','d']);
  assert.ok(!descendants(page.$('review-list')).some(node=>['button','a'].includes(node.tag)));
  assert.ok(!descendants(page.$('mastery-list')).some(node=>node.tag==='a'));
  assert.match(page.$('review-status').textContent,/2 \/ 3/);
  page.$('review-start').click();
  assert.equal(page.context.location.hash,'review/c');
  assert.equal(page.starts.length,0,'resuming must preserve the existing session');
  assert.equal(page.saved.session.exercise.index,1);
});

test('fresh review explains its plan, while an invalid saved review cannot block it',()=>{
  const page=reviewPage({kind:'review',queue:['missing'],index:0,variant:4});
  assert.equal(page.$('review-start').textContent,'开始复习 →');
  assert.equal(page.$('review-start').disabled,false);
  assert.equal(page.$('review-budget-field').hidden,false);
  assert.match(page.$('review-status').textContent,/这次安排 4 项，预计 5 分钟/);
  page.$('review-start').click();
  assert.equal(page.starts[0][0],'review');
  assert.equal(page.starts[0][1].length,4);
  page.context.completed.clear();page.render();
  assert.equal(page.$('review-start').disabled,true);
  assert.equal(page.$('review-list').children.length,0);
});

test('new review instructions and saved progress translate in every edition',()=>{
  for (const locale of ['en','ja','ru','zh-TW']) {
    const catalog=JSON.parse(readFileSync(new URL('../linux-lab/locales/'+locale+'.json',import.meta.url)));
    const translate=createTranslator(catalog,locale);
    for (const exercise of [undefined,{kind:'review',queue:['a','b'],index:1,variant:4}]) {
      const page=reviewPage(exercise);
      for (const id of ['review-start','review-status','review-due-title','review-guidance']) {
        const translated=translate(page.$(id).textContent);
        assert.notEqual(translated,page.$(id).textContent,locale+': '+id);
        if (['en','ru'].includes(locale)) assert.ok(!/[\u3400-\u9fff]/.test(translated),locale+': '+translated);
      }
    }
  }
});
