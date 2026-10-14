import test from 'node:test';
import assert from 'node:assert/strict';
import { validateBackup, validSnapshot, validHistory } from '../linux-lab/backup.mjs';
import { Shell, seedState, evaluate } from '../linux-lab/shell.mjs';
import { createLessonShell, lessons, manuals } from '../linux-lab/curriculum.mjs';
import { PracticeHistory } from '../linux-lab/history.mjs';
const ids=new Set(lessons.map(item=>item.id)), names=new Set(manuals.map(item=>item.name));
const lesson=lessons.find(item=>item.id==='new-readme');
function snapshot(shell){return {state:shell.state,transcript:[],hint:0,goalChecks:evaluate(lesson.goals,shell.state),lastResult:{stdout:'',code:0},browsePath:shell.state.cwd,changes:[]};}
function makeBackup(){
  const shell=createLessonShell(Shell,seedState,lesson),history=new PracticeHistory();
  history.record(snapshot(shell));shell.execute('touch projects/README.md');
  return {version:2,format:'learn-linux-backup',mode:'learn',current:lesson.id,completed:[lesson.id],favorites:['touch'],session:{revision:2,lesson:lesson.id,state:shell.state,transcript:[],hint:1,outputs:[false],undoRedo:{past:history.past,future:history.future}}};
}
test('JSON backup restores practice files and usable undo/redo history',()=>{
  const data=validateBackup(JSON.parse(JSON.stringify(makeBackup())),ids,names);
  const shell=new Shell(data.session.state,manuals),history=new PracticeHistory();history.past=data.session.undoRedo.past;history.future=data.session.undoRedo.future;
  assert.ok(shell.state.fs['/home/learner/projects/README.md']);
  const previous=history.undo(snapshot(shell));assert.equal(previous.state.fs['/home/learner/projects/README.md'],undefined);
  assert.ok(history.redo(previous).state.fs['/home/learner/projects/README.md']);
});
test('sandbox snapshots preserve environment and history through JSON',()=>{
  const shell=new Shell(seedState(),manuals);shell.execute('export NAME=cheese');
  const data={...makeBackup(),mode:'sandbox',sandbox:{snapshot:snapshot(shell),undoRedo:{past:[],future:[]}}};
  const restored=validateBackup(JSON.parse(JSON.stringify(data)),ids,names);
  assert.equal(restored.sandbox.snapshot.state.env.NAME,'cheese');assert.equal(restored.sandbox.snapshot.state.history[0],'export NAME=cheese');
});
test('legacy progress remains compatible and unknown entries are filtered',()=>{
  assert.deepEqual(validateBackup({version:1,completed:['new-readme','unknown'],favorites:['touch','unknown']},ids,names).completed,['new-readme']);
});
test('lesson flow backups accept legacy and current versions but reject unknown versions',()=>{
  const data=makeBackup();
  assert.doesNotThrow(()=>validateBackup(data,ids,names));
  data.session.flowVersion=1;
  assert.doesNotThrow(()=>validateBackup(data,ids,names));
  data.session.flowVersion=2;
  assert.throws(()=>validateBackup(data,ids,names),/版本/);
});
test('malformed backup data is rejected before workspace replacement',()=>{
  for(const mutate of [data=>data.session.state.cwd='/missing',data=>data.current='missing',data=>data.session.undoRedo.past[0].goalChecks[0].label={},data=>data.session.transcript=[{command:'ls',path:1}],data=>data.session.undoRedo.past=Array(41).fill(data.session.undoRedo.past[0])]){
    const data=makeBackup();mutate(data);assert.throws(()=>validateBackup(data,ids,names));
  }
  assert.equal(validSnapshot(null),false);assert.equal(validHistory({past:[],future:'bad'}),false);
});
