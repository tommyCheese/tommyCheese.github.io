import {readFileSync} from 'node:fs';
import {createTranslator} from '../linux-lab/i18n-core.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { compareSolutions, completionMessage, stateHint, methodInsights, describeChanges, pipelineStages, nextTransition, lessonIntroduction } from '../linux-lab/guidance.mjs';
import { Shell, seedState, HOME, evaluate } from '../linux-lab/shell.mjs';
import { lessons, manuals, createLessonShell } from '../linux-lab/curriculum.mjs';

test('comparison uses the shortest supplied verified reference and counts input lines, not pipeline commands',()=>{
  const choices=[{command:'pwd\ncd projects\npwd'},{command:'pwd\ncd projects && pwd'}];
  const comparison=compareSolutions(['ls','pwd','cd projects && pwd'],choices);
  assert.equal(comparison.reference.command,choices[1].command);
  assert.match(comparison.message,/多用了 1 行/);
  assert.deepEqual(choices.map(choice=>choice.command),['pwd\ncd projects\npwd','pwd\ncd projects && pwd']);
  assert.match(compareSolutions(['pwd','cd projects && pwd'],choices).message,/一致/);
  assert.match(compareSolutions(['pwd && cd projects && pwd'],choices).message,/少用了 1 行/);
  assert.match(compareSolutions(Array(200).fill('ls'),choices).message,/最近 200/);
  assert.equal(compareSolutions(['pwd'],[]).reference,null);
});
test('hints identify misplaced files, remaining content and permissions from actual state',()=>{
  const state=seedState(), lesson={command:'touch',reviewCommands:['ls'],hints:['','more','solution']};
  state.fs[HOME+'/README.md']={type:'file',text:'',mode:'644',owner:'learner'};
  assert.match(stateHint(lesson,state,[{type:'file',path:'projects/README.md',text:'',done:false}],1),/同名.*~\/README.md/);
  assert.match(stateHint(lesson,state,[{type:'mode',path:'deploy.sh',value:'744',done:false}],2),/644.*744.*chmod/);
  assert.match(stateHint(lesson,state,[{type:'file',path:'projects/notes.txt',text:'draft\nsecond\n',done:false}],2),/追加/);
  assert.equal(stateHint(lesson,state,[],3),'solution');
});
test('change summaries show rename and permissions, and pipelines expose safe intermediate outputs',()=>{
  const shell=new Shell(seedState(),manuals), before=structuredClone(shell.state);
  const result=shell.execute('mv projects/notes.txt projects/meeting.txt; chmod u+x deploy.sh');
  const events=describeChanges(before,shell.state,result.commands);
  assert.ok(events.some(event=>event.kind==='moved' && event.from.endsWith('notes.txt') && event.path.endsWith('meeting.txt')));
  assert.ok(events.some(event=>event.kind==='permission' && event.from==='644' && event.to==='744'));
  const state=structuredClone(shell.state), stages=pipelineStages('grep ERROR logs/app.log | wc -l > count.txt',state,manuals);
  assert.equal(stages.length,2);assert.match(stages[0].stdout,/ERROR timeout/);assert.equal(stages[1].stdout,'2\n');
  assert.deepEqual(shell.state,state);assert.equal(state.fs[HOME+'/count.txt'],undefined);
  assert.deepEqual(pipelineStages('cat README.txt | tee copy.txt',state,manuals),[]);
});
test('solution explanations describe method choices and the transition names the actual next task',()=>{
  assert.match(methodInsights(['cd projects','cat notes.txt'],['cat projects/notes.txt']).join(''),/切换目录/);
  assert.match(methodInsights(['grep ERROR logs/app.log | wc -l'],['grep ERROR logs/app.log']).join(''),/管道/);
  assert.match(nextTransition({command:'ls'},{command:'cd',title:'走进项目目录'}),/走进项目目录/);
});
test('backup inspection is counted only after the backup exists, with no synthetic delivery copy',()=>{
  const lesson=lessons.find(item=>item.id==='copy-note'),shell=createLessonShell(Shell,seedState,lesson);
  const inspection=lesson.goals.find(goal=>goal.requiresPath);
  assert.equal(evaluate([inspection],shell.state,shell.execute('cat projects/notes.txt'))[0].done,false);
  shell.execute('cp projects/notes.txt projects/notes.bak');
  assert.equal(evaluate([inspection],shell.state,shell.execute('cat projects/notes.bak'))[0].done,true);
  assert.ok(!lesson.solution.join('\n').includes('delivery.txt'));
});
test('metadata verification accepts relative and absolute paths, but rejects another file',()=>{
  const lesson=lessons.find(item=>item.id==='make-executable'), shell=createLessonShell(Shell,seedState,lesson);
  shell.execute('chmod u+x deploy.sh');
  for (const command of ['stat deploy.sh','stat ./deploy.sh','stat /home/learner/deploy.sh']) assert.ok(evaluate(lesson.goals,shell.state,shell.execute(command)).every(goal=>goal.done),command);
  assert.ok(!evaluate(lesson.goals,shell.state,shell.execute('stat README.txt')).every(goal=>goal.done));
});
test('celebration distinguishes lesson, review and boss without grading retries or hints',()=>{
  const lesson={id:'where-am-i',title:'你现在在哪里？'};
  assert.match(completionMessage(lesson).detail,/完整路径/);
  assert.match(completionMessage(lesson,{review:true}).title,/手感/);
  assert.match(completionMessage(lesson,{boss:true}).title,/Boss/);
  assert.equal(completionMessage(lesson,{errors:5,maxHint:3}).title,completionMessage(lesson).title);
});

test('matching methods need no generic advice and transitions never assume prior tasks',()=>{
  assert.deepEqual(methodInsights(['pwd'],['pwd']),[]);
  assert.equal(nextTransition({command:'rm'},{command:'mv',title:'给笔记改名'}),'下一关：给笔记改名');
});

test('comparison highlights extra repetitions and reordered inputs',()=>{
  const repeated=compareSolutions(['pwd','pwd','cd projects'],[{command:'pwd\ncd projects'}]);
  assert.deepEqual(repeated.yoursDifferent,[false,true,false]);
  assert.deepEqual(repeated.referenceDifferent,[false,false]);
  const reordered=compareSolutions(['ls','pwd'],[{command:'pwd\nls'}]);
  assert.equal(reordered.yoursDifferent.filter(Boolean).length,1);
  assert.equal(reordered.referenceDifferent.filter(Boolean).length,1);
});

test('every lesson introduction keeps its knowledge without copying goals or solutions',()=>{
  for (const lesson of lessons) {
    const intro=lessonIntroduction(lesson);
    assert.ok(intro.lead.length > 10,lesson.id);
    if (lesson.theory !== '对照目标选择参数，观察文件或输出的变化。') assert.ok([intro.lead,intro.knowledge].includes(lesson.theory),lesson.id);
    assert.notEqual(intro.lead,intro.knowledge,lesson.id);
    assert.ok(![intro.lead,intro.knowledge].includes('对照目标选择参数，观察文件或输出的变化。'),lesson.id);
    assert.equal(intro.showTool,true);
    assert.equal(intro.goals,undefined);
    assert.equal(intro.solution,undefined);
  }
  const first=lessons.find(lesson=>lesson.id==='where-am-i');
  assert.match(lessonIntroduction(first).knowledge,/定位器/);
  assert.match(lessonIntroduction(first,{review:true}).lead,/回忆/);
  const boss=lessonIntroduction({chapter:'files',theory:'检查交付结果。'},{boss:true});
  assert.equal(boss.showTool,false);
  assert.match(boss.lead,/组合/);
});


test('normal lessons introduce their own knowledge instead of reusing command or chapter openings',()=>{
  const leads=lessons.map(lesson=>lessonIntroduction(lesson).lead);
  assert.equal(new Set(leads).size,lessons.length);
  const enter=lessonIntroduction(lessons.find(lesson=>lesson.id==='enter-projects'));
  const parent=lessonIntroduction(lessons.find(lesson=>lesson.id==='parent-directory'));
  assert.notEqual(enter.lead,parent.lead);
  assert.match(enter.lead,/相对路径.*子目录/);
  assert.match(parent.lead,/\.\..*父目录.*projects/);
  assert.match(parent.knowledge,/\.\. 代表父目录/);
});


test('lesson introductions remain distinct and fully translated in all language editions',()=>{
  for(const locale of ['en','ja','ru','zh-TW']) {
    const translate=createTranslator(JSON.parse(readFileSync(new URL('../linux-lab/locales/'+locale+'.json',import.meta.url))),locale);
    const leads=lessons.map(lesson=>translate(lessonIntroduction(lesson).lead));
    assert.equal(new Set(leads).size,lessons.length,locale);
    if(['en','ru'].includes(locale))for(const [index,lead] of leads.entries())assert.doesNotMatch(lead,/[\u3400-\u9fff]/,locale+': '+lessons[index].id);
  }
});
