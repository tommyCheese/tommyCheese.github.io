import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {lessons,chapters,levels} from '../linux-lab/curriculum.mjs';
import {createBossLesson} from '../linux-lab/bosses.mjs';
import {createReviewLesson} from '../linux-lab/review-exercises.mjs';
import {varyExercise} from '../linux-lab/learning.mjs';
import {Shell,seedState,evaluate,resolve} from '../linux-lab/shell.mjs';
import {createLessonShell,manuals} from '../linux-lab/curriculum.mjs';
import {clarifyGoalLabels,goalReference} from '../linux-lab/task-copy.mjs';
import {createTranslator} from '../linux-lab/i18n-core.mjs';
const bosses=chapters.flatMap(chapter=>levels.map(level=>createBossLesson({chapter:chapter.id,level:level.id},'boss/'+level.id+'/'+chapter.id)));
const reviews=lessons.flatMap(lesson=>[1,2,191].map(variant=>createReviewLesson(lesson,variant)));
const tasks=[...lessons,...bosses,...reviews];
test('all normal, Boss and review goals expose concrete requirements without shorthand or missing values',()=>{
  for(const task of tasks) for(const goal of task.goals) {
    assert.ok(goal.label,task.id);
    assert.doesNotMatch(goal.label,/undefined|内容正确|^副本内容|^查看并核对操作后的实际状态$|^报告就位后，读回核对筛选或统计结果$/,task.id+': '+goal.label);
    assert.ok(!goal.path || !goal.label.startsWith(goal.path+'：'),task.id+': '+goal.label);
    const reference=goalReference(goal);
    if(goal.type==='file'&&goal.text&&!goal.preserve) {
      assert.equal(reference?.text,goal.text,task.id);
      assert.ok(reference.note,task.id);
    }
    if(goal.type==='file'&&goal.includes) assert.equal(reference?.text,goal.includes,task.id);
    if(goal.type==='output'&&(goal.exact||goal.includes)) {
      const target=goal.exact??goal.includes;
      assert.ok(goal.label.includes(target)||reference?.text===target,task.id+': '+goal.label);
    }
    if(goal.type==='archive') for(const [path,text] of Object.entries(goal.contents||{})) {
      assert.ok(reference.text.includes(path),task.id);
      assert.ok(reference.text.includes(text),task.id);
    }
  }
});
test('handoff Boss variant describes copying and distinguishes content from the destination path',()=>{
  const source=bosses.find(task=>task.id==='boss/master/navigation');
  const initial=createLessonShell(Shell,seedState,source);
  const {lesson}=varyExercise(source,initial.state,191);
  const destination=lesson.goals.find(goal=>goal.path==='workspace-191/交接 包/release/memo-191.txt');
  assert.match(destination.label,/复制/);
  assert.match(destination.label,/approved/);
  assert.equal(goalReference(destination).text,'approved\n');
  assert.ok(lesson.context.includes('workspace-191/交接 包/release'));
  assert.ok(lesson.goals.some(goal=>goal.preserve&&goal.path.includes('/draft/')));
});
test('content requirements distinguish preserving a file from preserving repeated data',()=>{
  const task=clarifyGoalLabels({goals:[{type:'file',path:'ranked.txt',text:'30\n30\n2\n',label:'排序时保留重复项'},{type:'file',path:'original.txt',text:'data\n',label:'保留原文件'}]});
  assert.ok(goalReference(task.goals[0]));assert.equal(goalReference(task.goals[1]),null);
  assert.match(goalReference({type:'file',path:'raw.txt',text:'raw',label:'保存原始字节'}).note,/不要添加换行/);
});
test('all Boss reference solutions still satisfy the rewritten requirements, including copied originals',()=>{
  for(const task of bosses) {
    const shell=createLessonShell(Shell,seedState,task);let result;
    for(const line of task.solution){result=shell.execute(line);assert.equal(result.code,0,task.id+': '+line+': '+result.stderr);}
    assert.ok(evaluate(task.goals,shell.state,result).every(g=>g.done),task.id);
  }
});
test('new goal instructions and disclosure labels are translated across all editions',()=>{
  for(const locale of ['en','ja','ru','zh-TW']) {
    const translate=createTranslator(JSON.parse(readFileSync(new URL('../linux-lab/locales/'+locale+'.json',import.meta.url))),locale);
    for(const task of tasks)for(const goal of task.goals) {
      const reference=goalReference(goal);
      for(const text of [goal.label,reference?.title,reference?.note].filter(Boolean)) {
        const result=translate(text).replaceAll('交接 包','');
        assert.ok(result.length);
        if(['en','ru'].includes(locale))assert.doesNotMatch(result,/[\u4e00-\u9fff]/,locale+': '+task.id+': '+result);
      }
    }
  }
});

test('undo refreshes old wording and recalculates file goals while retaining previously observed output',()=>{
  const app=readFileSync(new URL('../linux-lab/app.mjs',import.meta.url),'utf8');
  const goals=clarifyGoalLabels({goals:[{type:'file',path:'result.txt',text:'approved\n',label:'内容正确'},{type:'output',exact:'approved',code:0,label:'输出 approved'},{type:'output',exact:'approved',code:0,requiresPath:'missing.txt',label:'读回 missing.txt'}]}).goals;
  const snapshot={state:seedState(),transcript:[],hint:0,lastResult:{stdout:'',code:0},browsePath:'/home/learner',changes:[],goalChecks:goals.map(goal=>({...goal,label:'旧的含糊说明',done:true}))};
  const context={Shell,manuals,evaluate,resolve,snapshot,lesson:{goals},mode:'learn'};
  vm.runInNewContext(app.slice(app.indexOf('function restorePractice(snapshot)'),app.indexOf('function practiceAction(action)'))+'restorePractice(snapshot);',context);
  assert.equal(context.goalChecks[0].label,goals[0].label);
  assert.equal(context.goalChecks[0].done,false);
  assert.equal(context.goalChecks[1].done,true);
  assert.equal(context.goalChecks[2].done,false);
});

test('backup and observation requirements are displayed before destructive changes without changing saved goal indexes', async()=>{
  const {goalEntries}=await import('../linux-lab/task-copy.mjs');
  const {stateHint}=await import('../linux-lab/guidance.mjs');
  for(const task of tasks) {
    const original=[...task.goals];
    const ordered=goalEntries(task.goals).map(([,goal])=>goal);
    assert.deepEqual(task.goals,original);
    for(const backup of ordered.filter(g=>g.sourcePath)) {
      const source=resolve(backup.sourcePath);
      const destructive=ordered.filter(g=>g!==backup && g.path && resolve(g.path)===source && (g.type==='absent'||g.type==='file'));
      assert.ok(destructive.length,task.id);
      for(const goal of destructive)assert.ok(ordered.indexOf(backup)<ordered.indexOf(goal),task.id);
      assert.ok(backup.label.includes(backup.sourcePath),task.id);
    }
  }
  for(const id of ['rename-note','append-note']) {
    const task=lessons.find(l=>l.id===id),originalIndexes=task.goals.map((g,i)=>[i,g.type]);
    const ordered=goalEntries(task.goals);
    assert.equal(ordered[0][1].type,'output',id);
    assert.equal(ordered[0][1].displayOrder,-1,id);
    const shell=createLessonShell(Shell,seedState,task);
    const result=shell.execute(task.solution[0]);
    const checks=evaluate(task.goals,shell.state,result);
    assert.equal(checks[ordered[0][0]].done,true,id);
    assert.deepEqual(task.goals.map((g,i)=>[i,g.type]),originalIndexes);
  }
  const task=lessons.find(l=>l.id==='cleanup-temp'),shell=createLessonShell(Shell,seedState,task);
  const ordered=goalEntries(task.goals);
  assert.equal(ordered[0][1].sourcePath,'downloads/old.tmp');
  const hint=stateHint(task,shell.state,evaluate(task.goals,shell.state),1);
  assert.match(hint,/reports\/cleanup-temp/);
  for(const command of task.solution)assert.equal(shell.execute(command).code,0);
  assert.equal(shell.read('reports/cleanup-temp/before.txt'),'temporary\n');
  assert.ok(evaluate(task.goals,shell.state).every(g=>g.done));
});
