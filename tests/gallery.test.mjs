import test from 'node:test';
import assert from 'node:assert/strict';
import { photoSize, wallLayout, movePhoto, createFlightImage, frameEdges, charmPosition, charmHook, hangingCharmPosition } from '../js/gallery.mjs';

test('restoring a wall preserves every known photo once despite stale or malformed storage', () => {
  const originals = [{src:'one.jpg',size:82},{src:'two.jpg',size:88},{src:'three.jpg',size:80}];
  const stored = [null,{src:'two.jpg',size:1000},{src:'two.jpg',size:60},{src:'missing.jpg',size:70},{src:'one.jpg',size:-2}];
  assert.deepEqual(wallLayout(stored,originals),[{src:'two.jpg',size:100},{src:'one.jpg',size:52},{src:'three.jpg',size:80}]);
  assert.deepEqual(wallLayout({},originals),originals);
  assert.deepEqual(wallLayout([{src:'one.jpg',size:'invalid'}],originals)[0],{src:'one.jpg',size:84});
});
test('moving clips in either direction preserves all other photos and permits returning home', () => {
  const order = ['one','two','three','four'];
  assert.deepEqual(movePhoto(order,'one','three'),['two','three','one','four']);
  assert.deepEqual(movePhoto(movePhoto(order,'one','three'),'one','two'),order);
  assert.deepEqual(movePhoto(order,'missing','two'),order);
  assert.deepEqual(order,['one','two','three','four']);
});
test('photo size is finite and bounded while retaining fractional drag precision', () => {
  for (const value of [NaN,Infinity,undefined,null,'90']) assert.equal(photoSize(value),84);
  assert.equal(photoSize(85.25),85.25);
  assert.equal(photoSize(-10),52);
  assert.equal(photoSize(120),100);
});

test('return flight remains visible when its source image has been hidden', () => {
  const source = {style:{visibility:'hidden'}, cloneNode() {
    return {style:{...this.style}, setAttribute() {}};
  }};
  const clone = createFlightImage(source);
  assert.equal(clone.style.visibility,'visible');
  assert.equal(source.style.visibility,'hidden');
});

test('animated frame retains its destination thickness through both zoom directions', () => {
  for (const scale of [.2, 1, 5]) {
    const edges = frameEdges([8,8,26,8],scale);
    assert.equal(-parseFloat(edges.top)*scale,8);
    assert.equal(-parseFloat(edges.bottom)*scale,26);
    assert.equal(-parseFloat(edges.left)*scale,8);
  }
});

test('saved charm positions accept only finite coordinates and stay within the wall', () => {
  const fallback = {x:40,y:30};
  assert.deepEqual(charmPosition(null,fallback),fallback);
  assert.deepEqual(charmPosition({x:NaN,y:'60'},fallback),fallback);
  assert.deepEqual(charmPosition({x:-50,y:800},fallback),{x:0,y:100});
  assert.deepEqual(charmPosition({x:42.75,y:18.5},fallback),{x:42.75,y:18.5});
});

test('charm hooks follow the curved rope and detach outside its reach', () => {
  const rows = [{y:32,sag:64},{y:350,sag:64}];
  assert.equal(charmHook(500,64,1000,rows),0);
  assert.equal(charmHook(10,40,1000,rows),-8);
  assert.equal(charmHook(500,382,1000,rows),0);
  assert.equal(charmHook(500,150,1000,rows),null);
  assert.equal(charmHook(0,32,1000,rows),null);
  assert.equal(charmHook(500,84,1000,rows),null);
  assert.equal(charmHook(500,84,1000,rows,22),-20);
});

test('bear and GPU defaults hang from their rope on wide and narrow walls', () => {
  for (const width of [280,1002]) {
    for (const [x,row] of [[32,{y:32,sag:64}],[10,{y:350,sag:64}]]) {
      const height = 1100, charmHeight = width < 500 ? 76 : 102;
      const position = hangingCharmPosition(x,row,width,height,charmHeight);
      const top = position.y/100*height-charmHeight/2;
      assert.ok(Math.abs(charmHook(x/100*width,top,width,[row])+6) < .001);
    }
  }
});
