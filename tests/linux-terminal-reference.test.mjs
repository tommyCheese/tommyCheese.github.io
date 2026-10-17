import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../linux-lab/reference.mjs',import.meta.url),'utf8');
function page(saved, fail=false) {
  let data=structuredClone(saved),change;
  const status={},label={hidden:true};
  const checkbox={dataset:{terminalDone:'navigation'},checked:false,closest:selector=>selector==='[data-terminal-record]'?label:{querySelector:()=>status},addEventListener(type,handler){change=handler;}};
  vm.runInNewContext(source.slice(source.indexOf('function updateTerminalRecords()')),{
    readSaved:()=>data,KEY:'lab',translate:text=>text,Date,
    localStorage:{setItem(key,value){if(fail) throw new Error('storage unavailable');data=JSON.parse(value);}},
    document:{querySelectorAll:()=>[checkbox]},window:{addEventListener(){}}
  });
  return {checkbox,status,label,change:()=>change(),saved:()=>data};
}
test('topic self-assessment restores old records and preserves other practice data on save',()=>{
  const original={completed:['where-am-i'],favorites:['pwd'],session:{lesson:'where-am-i'},transfer:{navigation:{done:true,at:123},files:{done:true,at:456}}};
  const view=page(original);
  assert.equal(view.checkbox.checked,true);
  assert.equal(view.label.hidden,false);
  view.checkbox.checked=false;view.change();
  const saved=view.saved();
  assert.equal(saved.transfer.navigation.done,false);
  assert.deepEqual(saved.transfer.files,original.transfer.files);
  assert.deepEqual(saved.completed,original.completed);
  assert.deepEqual(saved.session,original.session);
  assert.deepEqual(saved.favorites,original.favorites);
});
test('failed storage write restores checkbox instead of claiming the self-assessment was saved',()=>{
  const view=page({},true);
  view.checkbox.checked=true;view.change();
  assert.equal(view.checkbox.checked,false);
  assert.match(view.status.textContent,/无法保存自评/);
});
