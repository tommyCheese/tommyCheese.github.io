import test from 'node:test';
import assert from 'node:assert/strict';
import { compareSolutions, completionMessage, stateHint, methodInsights, describeChanges, pipelineStages, nextTransition } from '../linux-lab/guidance.mjs';
import { Shell, seedState, HOME, evaluate } from '../linux-lab/shell.mjs';
import { lessons, manuals, createLessonShell } from '../linux-lab/curriculum.mjs';
import { createDemo, advanceDemo, demoFiles } from '../linux-lab/demonstrations.mjs';

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
test('all demonstrations run in isolated shells and can be restarted without changing a task',()=>{
  const learner=new Shell(seedState(),manuals), initial=structuredClone(learner.state);
  for (const command of ['pwd','cat','man','cd','ls','cp','mv','mkdir','grep','wc','chmod','echo','rm','head','tail','sort','cut','tar']) {
    const demo=createDemo(command);while(advanceDemo(demo)) assert.equal(demo.result.code,0,command);
    assert.equal(advanceDemo(demo),false);
    assert.equal(createDemo(command).index,0);
  }
  assert.deepEqual(learner.state,initial);
  const demo=createDemo('grep');advanceDemo(demo);advanceDemo(demo);assert.equal(demo.result.stdout,'2\n');
  assert.equal(createDemo('not-a-demo'),null);
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

test('ls demonstrations reveal hidden files only after requesting them',()=>{
  const demo=createDemo('ls');
  const names=()=>demoFiles(demo).files.map(file=>file.path.split('/').pop());
  assert.ok(!names().includes('.profile'));
  advanceDemo(demo);assert.ok(!names().includes('.profile'));
  advanceDemo(demo);assert.ok(names().includes('.profile'));
});
test('redirection demonstrations show actual file content after append and overwrite',()=>{
  const demo=createDemo('echo');
  assert.equal(demoFiles(demo).preview.text,'first\n');
  advanceDemo(demo);assert.equal(demoFiles(demo).preview.text,'first\nsecond\n');
  advanceDemo(demo);assert.equal(demoFiles(demo).preview.text,'replaced\n');
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
