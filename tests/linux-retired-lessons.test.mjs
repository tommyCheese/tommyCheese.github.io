import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons,manuals} from '../linux-lab/curriculum.mjs';
import {retiredLessons,retireLessonProgress} from '../linux-lab/retired-lessons.mjs';
import {recordPractice,validLearning} from '../linux-lab/learning.mjs';
import {validateBackup} from '../linux-lab/backup.mjs';
const ids=new Set(lessons.map(item=>item.id));
test('only redundant lessons are retired; independent concepts retain stable IDs',()=>{
  assert.equal(lessons.length,132);
  for(const [old,replacement] of Object.entries(retiredLessons)) {
    assert.equal(ids.has(old),false,old);assert.ok(ids.has(replacement),replacement);
  }
  for(const id of ['enter-projects','parent-directory','hidden-profile','copy-note','copy-project','write-note','append-note','numeric-sort','unique-names','private-file','make-executable','clean-workspace']) assert.ok(ids.has(id),id);
  for(const manual of manuals.filter(item=>item.practice)) assert.ok(lessons.some(item=>item.command===manual.name),manual.name);
});
test('retiring old lessons preserves other progress and accepts legacy exports',()=>{
  const learning={};
  for(const id of ['where-am-i','success-chain']) recordPractice(learning,id,{});
  learning['where-am-i'].lastAnswer={title:'你现在在哪里？',commands:['pwd']};
  const data={version:2,format:'learn-linux-backup',mode:'learn',current:'success-chain',completed:['where-am-i','success-chain'],favorites:[],learning,session:{lesson:'success-chain'},bossCompleted:['common/missions']};
  const migrated=retireLessonProgress(data);
  assert.equal(migrated.current,'enter-projects');assert.equal(migrated.session,undefined);
  assert.ok(validLearning(migrated.learning,ids));
  const restored=validateBackup(data,ids,new Set());
  assert.deepEqual(restored.completed,['where-am-i']);
  assert.deepEqual(restored.learning,{'where-am-i':learning['where-am-i']});
  assert.deepEqual(restored.bossCompleted,['common/missions']);
  assert.ok(data.session);assert.ok(data.learning['success-chain']);
  const review=retireLessonProgress({...data,current:'where-am-i',session:{lesson:'where-am-i',exercise:{queue:['where-am-i','success-chain']}}});
  assert.equal(review.session,undefined);assert.equal(review.current,'where-am-i');
  assert.throws(()=>validateBackup({...data,learning:{unknown:learning['where-am-i']}},ids,new Set()),/掌握记录/);
});
