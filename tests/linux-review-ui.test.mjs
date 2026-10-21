import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { reviewPlan, validExercise, mastery } from '../linux-lab/learning.mjs';
import { createTranslator } from '../linux-lab/i18n-core.mjs';
import { lessons, manuals, createLessonShell } from '../linux-lab/curriculum.mjs';
import { Shell, seedState, evaluate } from '../linux-lab/shell.mjs';
import { createReviewVariant } from '../linux-lab/review-variants.mjs';
import { alternativeSolutions } from '../linux-lab/practice-support.mjs';
import { compareSolutions } from '../linux-lab/guidance.mjs';

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
  const starts=[],navigations=[];
  const context = {$,element,lessons,ids,saved,completed:new Set(ids),learning:{},reviewSummary:null,location:{hash:''},beginTraining:(...args)=>starts.push(args),
    history:{pushState:(_state,_title,route)=>{context.location.hash=route;}},navigate:(...args)=>navigations.push(args),
    reviewPlan,validExercise,mastery,skillLabel:item=>item.title,currentId:'a',starterRoute:[],mode:'review'};
  vm.runInNewContext(render+'\nrenderLearning();',context);
  vm.runInNewContext(source.match(/\$\('review-start'\)\.addEventListener\('click',\(\)=> \{[\s\S]*?\n\}\);/)[0],context);
  return {nodes,$,saved,context,starts,navigations,render:()=>vm.runInNewContext('renderLearning();',context)};
}
const descendants = node => [node,...node.children.flatMap(descendants)];

test('review overview has one entry and a read-only task preview',()=>{
  const page=reviewPage({kind:'review',queue:['b','c','d'],index:1,variant:4,budget:300});
  assert.ok(!page.$('review-start').hidden && !page.$('review-start').disabled);
  assert.ok(!page.nodes.has('review-resume') || page.$('review-resume').hidden, 'start and resume must not compete');
  assert.equal(page.$('review-start').textContent,'继续复习 →');
  assert.equal(page.nodes.has('review-budget-field'),false);
  assert.equal(page.nodes.has('review-budget'),false);
  assert.deepEqual(page.$('review-list').children.map(card=>descendants(card).find(node=>node.tag==='h3').textContent),['c','d']);
  assert.ok(!descendants(page.$('review-list')).some(node=>['button','a'].includes(node.tag)));
  assert.ok(!descendants(page.$('mastery-list')).some(node=>node.tag==='a'));
  assert.match(page.$('review-status').textContent,/2 \/ 3/);
  page.$('review-start').click();
  assert.equal(page.context.location.hash,'#review/c');
  assert.deepEqual(page.navigations[0],['#review/c',true]);
  assert.equal(page.starts.length,0,'resuming must preserve the existing session');
  assert.equal(page.saved.session.exercise.index,1);
});

test('fresh review explains its plan, while an invalid saved review cannot block it',()=>{
  const page=reviewPage({kind:'review',queue:['missing'],index:0,variant:4});
  assert.equal(page.$('review-start').textContent,'开始复习 →');
  assert.equal(page.$('review-start').disabled,false);
  assert.equal(page.nodes.has('review-budget'),false);
  assert.match(page.$('review-status').textContent,/已安排 8 项/);
  page.$('review-start').click();
  assert.equal(page.starts[0][0],'review');
  assert.equal(page.starts[0][1].length,8);
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

test('resuming a paused review restores its snapshot after other practice',()=>{
  const page=reviewPage();
  const snapshot={lesson:'c',state:{files:'unfinished'},transcript:[{command:'pwd'}],hint:2,
    exercise:{kind:'review',queue:['b','c','d'],index:1,variant:4},outputs:[true],undoRedo:{past:[{state:'earlier'}],future:[]}};
  page.saved.reviewSession=snapshot;
  page.saved.session={lesson:'h',exercise:null,state:{files:'different course'}};
  page.render();page.$('review-start').click();
  assert.equal(page.saved.session,snapshot);
  assert.deepEqual(page.navigations[0],['#review/c',true]);
  assert.equal(page.starts.length,0);
});

function reviewController() {
  const nodes=new Map(),writes=[];
  const context={
    $:id=>{if(!nodes.has(id)) nodes.set(id,{open:false,close(){this.open=false;}});return nodes.get(id);},
    tickPractice(){},completed:new Set(['a','b']),favorites:new Set(),bossCompleted:new Set(),locale:'zh-CN',
    currentId:'a',mode:'learn',starterMode:false,learning:{},transfer:{},saved:{},KEY:'test',storageAvailable:true,
    shell:{state:{files:['in-progress']}},transcript:[{command:'pwd'}],hint:2,hintVisible:true,goalChecks:[{type:'output',done:true}],
    training:{kind:'review',reviewVersion:1,queue:['a','b'],index:0,variant:4,budget:180,spentSeconds:600,results:[]},
    attempt:{maxHint:2,errors:0,graded:false,activeSeconds:900},practiceHistory:{past:[{state:'previous'}],future:[]},
    practiceSnapshot:()=>({state:'sandbox'}),localStorage:{setItem:(_key,value)=>writes.push(JSON.parse(value))},
    location:{hash:''},history:{pushState(){},replaceState(){}},document:{querySelectorAll:()=>[]},
    navigate(){context.mode='review';context.training=null;context.shell=undefined;},reviewSummary:null
  };
  for (const [begin,end] of [['persist','validSession'],['finishReview','startBoss'],['advanceLesson','announce']]) {
    const start=source.indexOf('function '+begin+'(');
    vm.runInNewContext(source.slice(start,source.indexOf('function '+end+'(',start)),context);
  }
  return {context,writes};
}

test('pausing, reloading and saving other practice keep the complete review snapshot',()=>{
  const {context:c,writes}=reviewController();c.pauseReview();
  const paused=JSON.parse(JSON.stringify(c.saved.reviewSession));
  assert.equal(c.mode,'review');assert.equal(c.training,null);
  assert.deepEqual(paused.state,{files:['in-progress']});assert.equal(paused.hint,2);
  assert.deepEqual(paused.transcript,[{command:'pwd'}]);assert.deepEqual(paused.outputs,[true]);
  assert.deepEqual(paused.undoRedo.past,[{state:'previous'}]);
  c.saved=JSON.parse(JSON.stringify(writes.at(-1)));
  c.mode='learn';c.currentId='b';c.shell={state:{files:['ordinary lesson']}};c.training=null;c.persist();
  assert.deepEqual(writes.at(-1).reviewSession,paused);
  assert.equal(writes.at(-1).session.lesson,'b');
  c.mode='sandbox';c.persist();assert.deepEqual(writes.at(-1).reviewSession,paused);
});

test('legacy time limits never end a review early; finishing the queue clears its saved snapshot',()=>{
  const {context:c,writes}=reviewController();c.advanceLesson();
  assert.equal(c.training.index,1);assert.equal(c.location.hash,'review/b');
  c.currentId='b';c.shell={state:{files:['second task']}};c.persist();
  assert.equal(writes.at(-1).reviewSession.lesson,'b');
  c.advanceLesson();
  assert.equal(c.training,null);assert.equal(c.saved.reviewSession,undefined);assert.equal(c.saved.session,undefined);
  assert.equal(writes.at(-1).reviewSession,undefined);
});

test('every edition removes time selection and offers a pause action',()=>{
  for (const edition of ['','en/','ja/','ru/','zh-TW/']) {
    const html=readFileSync(new URL('../linux-lab/'+edition+'index.html',import.meta.url),'utf8');
    assert.ok(!html.includes('id="review-budget'));
    assert.equal((html.match(/id="review-start"/g)||[]).length,1);
    assert.ok(html.includes('id="review-finish"'));
  }
});

test('revisiting a completed task exposes previous answers outside the dedicated review route',()=>{
  const visibility=source.match(/^  \$\('review-answers'\)\.hidden = .*;$/m)[0];
  for(const [sandbox,training,done,visible] of [
    [false,null,true,true], [false,null,false,false],
    [false,{kind:'review'},true,true], [true,null,true,false],
    [false,{kind:'quiz',challengeVersion:1},true,true],
    [false,{kind:'quiz',challengeVersion:1},false,true],
    [true,{kind:'quiz',challengeVersion:1},true,false]
  ]) {
    const panel={hidden:true};
    vm.runInNewContext(visibility,{$:()=>panel,sandbox,training,currentId:'look-around',completed:new Set(done?['look-around']:[])});
    assert.equal(!panel.hidden,visible,JSON.stringify({sandbox,training,done}));
  }
});

test('Boss answers persist by Boss ID, restore on retry and never replace an ordinary lesson answer',()=>{
  const {context:c,writes}=reviewController();
  const ordinary={title:'普通关卡',commands:['pwd']}, otherBoss={title:'另一个 Boss',commands:['ls']};
  Object.assign(c,{bosses:[],lessons:[{id:'a'}],lesson:{title:'Boss 交接挑战'},wasDone:false,
    learning:{a:{lastAnswer:ordinary}},saved:{bossAnswers:{'advanced/navigation':otherBoss}},
    training:{kind:'quiz',challengeVersion:1,boss:'common/navigation',queue:['a'],index:0,variant:23},
    shell:{state:{history:['cp draft final','cd release']}},attempt:{graded:false,maxHint:0,errors:0},
    recordReviewResult(){},renderChapters(){},announce(){},celebrate:false});
  const start=source.indexOf('      const unlockedBefore =');
  vm.runInNewContext(source.slice(start,source.indexOf('    } else {\n      if (!attempt.graded',start)),c);
  assert.deepEqual(c.learning.a.lastAnswer,ordinary);
  c.persist();
  const reloaded=JSON.parse(JSON.stringify(writes.at(-1)));
  assert.deepEqual(reloaded.bossAnswers['common/navigation'],{title:'Boss 交接挑战',commands:['cp draft final','cd release']});
  assert.deepEqual(reloaded.bossAnswers['advanced/navigation'],otherBoss);
  c.shell.state.history.push('ls');
  assert.equal(c.saved.bossAnswers['common/navigation'].commands.length,2,'later input cannot mutate the saved answer');
  c.saved=reloaded;
  const select=source.match(/^  previousAnswer = .*;$/m)[0];
  assert.deepEqual(vm.runInNewContext(select+'\npreviousAnswer;',{...c,id:'a'}),reloaded.bossAnswers['common/navigation']);
  c.training.boss='advanced/navigation';
  assert.deepEqual(vm.runInNewContext(select+'\npreviousAnswer;',{...c,id:'a'}),otherBoss);
  c.training=null;
  assert.deepEqual(vm.runInNewContext(select+'\npreviousAnswer;',{...c,id:'a'}),ordinary);
});

test('review answers reveal saved input and a verified solution for the current variant only on expansion',()=>{
  const lesson=createReviewVariant(lessons[0],23,1), initial=createLessonShell(Shell,seedState,lesson).state;
  for (const previousAnswer of [undefined,{title:'你现在在哪里？',commands:['pwd','cd projects','pwd']}]) {
    const nodes=new Map();let writes=0;
    const element=(tag,textContent='',className='')=>({tag,textContent,className,children:[],open:false,hidden:false,
      append(...items){this.children.push(...items);},replaceChildren(...items){this.children=items;},
      addEventListener(type,callback){this[type]=callback;}});
    const $=id=>{if(!nodes.has(id))nodes.set(id,element('div'));return nodes.get(id);};
    const context={$,element,lesson,previousAnswer,exerciseInitialState:initial,solutionCache:undefined,
      localizeContent:value=>value,alternativeSolutions,compareSolutions,attempt:{graded:false,maxHint:0},persist(){writes++;}};
    const start=source.indexOf('function renderReviewAnswers()');
    vm.runInNewContext(source.slice(start,source.indexOf('function renderSolutionReview()',start)),context);
    $('review-answers').toggle();assert.equal(nodes.has('review-answers-content'),false);assert.equal(writes,0);
    $('review-answers').open=true;$('review-answers').toggle();
    assert.equal(context.attempt.maxHint,3);assert.equal(writes,1);
    const sections=$('review-answers-content').children[0].children;
    assert.deepEqual(sections.map(section=>section.children[0].textContent),['上次答案','标准答案']);
    assert.ok(!descendants($('review-answers-content')).some(node=>node.textContent==='你现在在哪里？'));
    const commands=section=>descendants(section).filter(node=>node.tag==='code').map(node=>node.textContent);
    assert.deepEqual(commands(sections[0]),previousAnswer?.commands || []);
    if(!previousAnswer)assert.ok(descendants(sections[0]).some(node=>node.textContent.includes('暂无上次答案记录')));
    const shell=new Shell(structuredClone(initial),manuals),outputs=new Set();let result;
    for(const command of commands(sections[1])) {
      result=shell.execute(command);assert.equal(result.code,0);
      evaluate(lesson.goals,shell.state,result).forEach((goal,index)=>{if(goal.type==='output'&&goal.done)outputs.add(index);});
    }
    assert.ok(evaluate(lesson.goals,shell.state,result).every((goal,index)=>goal.done||goal.type==='output'&&outputs.has(index)));
    assert.deepEqual(commands(sections[0]),previousAnswer?.commands || [],'rendering never replaces saved input with the reference');
    $('review-answers').open=false;$('review-answers').toggle();assert.equal(writes,1);
  }
  for(const edition of ['','en/','ja/','ru/','zh-TW/']) {
    const html=readFileSync(new URL('../linux-lab/'+edition+'index.html',import.meta.url),'utf8');
    assert.match(html,/<details id="review-answers"[^>]*hidden[^>]*>/);
    assert.ok(!/<details id="review-answers"[^>]*\bopen\b/.test(html));
    const locale=edition.replace('/','');
    const label=locale ? JSON.parse(readFileSync(new URL('../linux-lab/locales/'+locale+'.json',import.meta.url)))['查看上次答案'] : '查看上次答案';
    assert.ok(html.includes('<summary>'+label+'</summary>'));
  }
});
