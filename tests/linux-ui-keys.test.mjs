import test from 'node:test';
import assert from 'node:assert/strict';
import {spatialNeighbor,setupKeyboardNavigation} from '../linux-lab/ui-keys.mjs';
const box=(x,y)=>({getBoundingClientRect:()=>({x,y,width:50,height:40})});
test('map arrows follow visible rows and columns, with no accidental wrap',()=>{
  const a=box(0,0),b=box(100,0),c=box(0,100),d=box(100,100),items=[a,b,c,d];
  assert.equal(spatialNeighbor(items,a,'ArrowRight'),b);
  assert.equal(spatialNeighbor(items,b,'ArrowDown'),d);
  assert.equal(spatialNeighbor(items,d,'ArrowLeft'),c);
  assert.equal(spatialNeighbor(items,a,'ArrowLeft'),undefined);
});
function keyboardPage() {
  const listeners={},nodes=new Map();let activeModal;
  const node=(id,shown=true)=> {
    const n={id,dataset:{},shown,disabled:false,clicks:0,focuses:0,open:true,
      getClientRects:()=>n.shown?[{}]:[],closest:()=>null,contains:other=>other===n,
      setAttribute(){},focus(){n.focuses++;doc.activeElement=n;},click(){n.clicks++;},close(){n.open=false;activeModal=null;},addEventListener(){}};
    nodes.set(id,n);return n;
  };
  const doc={activeElement:null,getElementById:id=>nodes.get(id),defaultView:{MutationObserver:class {observe(){}}},
    querySelectorAll:selector=>selector==='dialog:modal'?(activeModal?[activeModal]:[]):[],
    addEventListener(type,callback){listeners[type]=callback;}};
  for (const id of ['welcome-next','welcome-start','lesson-intro-start','completion-next','restart-cancel','command-input','review-start','review-return','review-area','mission-window','file-preview']) node(id,!['welcome-start','review-area','file-preview'].includes(id));
  setupKeyboardNavigation(doc);
  return {node,nodes,doc,modal(id){activeModal=node(id);return activeModal;},press(key,target,extra={}){
    let prevented=false;
    listeners.keydown({key,target,isComposing:false,preventDefault(){prevented=true;},stopPropagation(){},...extra});
    return prevented;
  }};
}
test('Enter advances welcome prose but preserves focused controls and input composition',()=>{
  const page=keyboardPage(),heading=page.node('heading');page.modal('welcome-dialog');
  assert.equal(page.press('Enter',heading),true);assert.equal(page.nodes.get('welcome-next').clicks,1);
  const select=page.node('language');select.closest=()=>select;
  assert.equal(page.press('Enter',select),false);
  assert.equal(page.press('Enter',heading,{isComposing:true}),false);
  assert.equal(page.press('Enter',heading,{repeat:true}),true);
  assert.equal(page.nodes.get('welcome-next').clicks,1);
});
test('restart prose defaults to cancel, and Escape closes only the active dialog',()=>{
  const page=keyboardPage(),heading=page.node('heading'),dialog=page.modal('restart-dialog');
  page.press('Enter',heading);assert.equal(page.nodes.get('restart-cancel').clicks,1);
  assert.equal(page.press('Escape',heading),true);assert.equal(dialog.open,false);
});
test('terminal Enter and Ctrl/Command+Enter remain with their existing handlers',()=>{
  const page=keyboardPage(),input=page.nodes.get('command-input');input.closest=()=>input;
  assert.equal(page.press('Enter',input),false);
  assert.equal(page.press('Enter',input,{ctrlKey:true}),false);
  assert.equal(page.press('Enter',input,{metaKey:true}),false);
});
test('review heading Enter activates its single entry, while Escape returns without recording failure',()=>{
  const page=keyboardPage(),heading=page.node('heading');page.nodes.get('review-area').shown=true;
  page.press('Enter',heading);assert.equal(page.nodes.get('review-start').clicks,1);assert.equal(page.nodes.has('review-resume'),false);
  page.press('Escape',heading);assert.equal(page.nodes.get('review-return').clicks,1);
});
test('hint arrows advance in their direction and stop at a disabled end',()=>{
  const page=keyboardPage(),previous=page.node('hint-previous'),next=page.node('hint-next');
  const group={classList:{contains:()=>true}};for (const button of [previous,next]) button.closest=selector=>selector.includes('#level-tabs')?group:selector==='button'?button:null;
  page.press('ArrowRight',next);assert.equal(next.clicks,1);assert.equal(previous.clicks,0);
  next.disabled=true;page.press('ArrowRight',previous);assert.equal(next.clicks,1);assert.equal(previous.clicks,0);
  page.press('ArrowLeft',previous);assert.equal(previous.clicks,1);
});
