import test from 'node:test';
import assert from 'node:assert/strict';
import { compareSolutions, completionMessage } from '../linux-lab/guidance.mjs';

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
test('celebration distinguishes lesson, review and boss without grading retries or hints',()=>{
  const lesson={id:'where-am-i',title:'你现在在哪里？'};
  assert.match(completionMessage(lesson).detail,/完整路径/);
  assert.match(completionMessage(lesson,{review:true}).title,/手感/);
  assert.match(completionMessage(lesson,{boss:true}).title,/Boss/);
  assert.equal(completionMessage(lesson,{errors:5,maxHint:3}).title,completionMessage(lesson).title);
});
