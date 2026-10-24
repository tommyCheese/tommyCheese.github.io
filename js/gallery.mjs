export const photoSize = value => Number.isFinite(value) ? Math.max(52, Math.min(100, value)) : 84;
export function wallLayout(saved, originals) {
  const known = new Map(originals.map(photo => [photo.src, photo])), result = [];
  for (const photo of Array.isArray(saved) ? saved : []) {
    if (!photo || !known.has(photo.src)) continue;
    result.push({src:photo.src, size:photoSize(photo.size ?? known.get(photo.src).size)});
    known.delete(photo.src);
  }
  return [...result, ...known.values()].map(photo => ({...photo}));
}
export function movePhoto(order, source, target) {
  const next = [...order], from = next.indexOf(source), to = next.indexOf(target);
  if (from < 0 || to < 0) return next;
  next.splice(from, 1); next.splice(to, 0, source);
  return next;
}

export function charmPosition(position, fallback) {
  const coordinate = key => Math.max(0,Math.min(100,Number.isFinite(position?.[key]) ? position[key] : fallback[key]));
  return {x:coordinate('x'),y:coordinate('y')};
}

export function charmHook(x, top, width, rows, tolerance = 18) {
  if (width <= 20 || x < 10 || x > width-10) return null;
  const t = (x-10)/(width-20);
  let nearest = null;
  for (const row of rows) {
    const offset = row.y+2*(1-t)*t*row.sag-top;
    if (Math.abs(offset) <= tolerance && (nearest === null || Math.abs(offset) < Math.abs(nearest))) nearest = offset;
  }
  return nearest;
}

export function hangingCharmPosition(x, row, width, height, charmHeight) {
  const t = (x/100*width-10)/(width-20);
  return {x,y:(row.y+2*(1-t)*t*row.sag+charmHeight/2+6)/height*100};
}

export function printBounds(width, aspect, angle) {
  const height = (width-16)*aspect+34, radians = angle*Math.PI/180;
  const sine = Math.sin(radians), cosine = Math.cos(radians);
  const halfWidth = (width*cosine+height*Math.abs(sine))/2;
  const center = -(height/2+18)*sine;
  return {left:center-halfWidth,right:center+halfWidth,bottom:(height+18)*cosine-18+width/2*Math.abs(sine)};
}

export const frameEdges = (values, scale = 1) => Object.fromEntries(['top','right','bottom','left'].map((side,i) => [side,-values[i]/scale+'px']));

export function createFlightImage(image) {
  const clone = image.cloneNode();
  clone.style.visibility = 'visible'; clone.loading = 'eager';
  clone.className = 'photo-flight'; clone.alt = ''; clone.setAttribute('aria-hidden', 'true');
  return clone;
}

const wall = typeof document === 'undefined' ? null : document.querySelector('.photo-wall');
if (wall) {
  const grid = wall.querySelector('.photo-grid');
  const slots = new Map([...grid.querySelectorAll(':scope > .photo-slot')].map(slot => [slot.dataset.photoSrc, slot]));
  const originals = [...slots].map(([src, slot]) => ({src, size:Number(slot.dataset.photoSize)}));
  const storageKey = 'tommy-cheese-photo-wall-v1', reduced = matchMedia('(prefers-reduced-motion: reduce)'), animations = new Map();
  const dialog = document.getElementById('photo-lightbox'), large = dialog.querySelector('.photo-large'), rehang = dialog.querySelector('.photo-rehang');
  let gesture, charmGesture, taken, busy = false, suppressClick = false, previousOverflow, previousScroll;
  const duration = ms => reduced.matches ? 0 : ms;
  const order = () => [...grid.querySelectorAll(':scope > .photo-slot')].map(slot => slot.dataset.photoSrc);
  const sizeOf = slot => Number(slot.style.getPropertyValue('--photo-size').replace('%', '')) || 84;
  const setSize = (slot, size) => {
    size = photoSize(size); slot.style.setProperty('--photo-size', size + '%');
    slot.querySelector('.photo-resize').setAttribute('aria-valuenow', Math.round(size));
  };
  function applyLayout(layout) {
    for (const photo of layout) { const slot = slots.get(photo.src); setSize(slot, photo.size); grid.append(slot); }
  }
  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(order().map(src => ({src, size:sizeOf(slots.get(src))})))); } catch {}
  }
  try { applyLayout(wallLayout(JSON.parse(localStorage.getItem(storageKey)), originals)); } catch { applyLayout(originals); }
  const svgNS = 'http://www.w3.org/2000/svg', ropes = document.createElementNS(svgNS,'svg');
  const ropeRows = [];
  ropes.classList.add('photo-ropes'); ropes.setAttribute('aria-hidden','true'); grid.prepend(ropes);
  function layoutWall() {
    const width = grid.clientWidth, ids = order(), narrow = width < 500, medium = width < 850;
    const groups = narrow ? [1,1,1,1,1,1,1,1,1] : medium ? [2,2,2,2,1] : [3,2,4];
    const patterns = {1:[.49],2:[.26,.74],3:[.15,.49,.84],4:[.12,.37,.64,.88]};
    const slotWidth = width * (narrow ? .85 : medium ? .44 : .26);
    ropes.replaceChildren(); ropeRows.length = 0; let cursor = 0, rowY = 8, bottom = 0;
    for (const count of groups) {
      const group = ids.slice(cursor,cursor+count); cursor += count;
      if (!group.length) break;
      const centers = patterns[group.length], sag = narrow ? 44 : 64;
      let nextRowY = rowY;
      ropeRows.push({y:rowY+24,sag});
      const path = document.createElementNS(svgNS,'path');
      path.setAttribute('d',`M 10 ${rowY+24} Q ${width/2} ${rowY+24+sag} ${width-10} ${rowY+24}`);
      path.classList.add('photo-rope'); ropes.append(path);
      for (const x of [10,width-10]) {
        const pin = document.createElementNS(svgNS,'circle'); pin.setAttribute('cx',x); pin.setAttribute('cy',rowY+24); pin.setAttribute('r','3'); ropes.append(pin);
      }
      group.forEach((src,index) => {
        const slot = slots.get(src);
        const center = narrow ? [.46,.54,.48][(cursor-group.length+index)%3] : centers[index];
        const t = (center*width-10)/(width-20), ropeY = 24+2*(1-t)*t*sag;
        Object.assign(slot.style,{left:center*width-slotWidth/2+'px',top:rowY+ropeY-24.5+'px',width:slotWidth+'px'});
        const image = slot.querySelector('img');
        const bounds = printBounds(slotWidth*sizeOf(slot)/100,Number(image.getAttribute('height'))/Number(image.getAttribute('width')),parseFloat(slot.style.getPropertyValue('--photo-tilt')) || 0);
        const photoBottom = rowY+ropeY+21.5+bounds.bottom;
        const edgeSag = [bounds.left,bounds.right].map(edge => {
          const point = Math.max(0,Math.min(1,(center*width+edge-10)/(width-20)));
          return 2*(1-point)*point*sag;
        });
        nextRowY = Math.max(nextRowY,photoBottom+14-24-Math.min(...edgeSag));
        bottom = Math.max(bottom,photoBottom+24);
      });
      // Fit the next curved rope around the actual prints, including tilt.
      rowY = nextRowY;
    }
    grid.style.height = bottom+'px'; ropes.setAttribute('viewBox',`0 0 ${width} ${bottom}`);
    for (const charm of grid.querySelectorAll('.photo-charm')) updateCharmHook(charm);
  }
  layoutWall(); let lastWidth = grid.clientWidth;
  new ResizeObserver(() => { if (grid.clientWidth !== lastWidth) { lastWidth=grid.clientWidth; layoutWall(); } }).observe(grid);
  function animateLayout(change) {
    const before = new Map([...slots.values()].map(slot => [slot, slot.querySelector('.photo-tile').getBoundingClientRect()]));
    for (const animation of animations.values()) animation.cancel();
    animations.clear(); change(); layoutWall();
    for (const [slot, rect] of before) {
      const tile = slot.querySelector('.photo-tile'), after = tile.getBoundingClientRect();
      if (slot.classList.contains('is-lifted') || Math.abs(rect.left-after.left)+Math.abs(rect.top-after.top) < 1) continue;
      const animation = tile.animate([{transform:`translate(${rect.left-after.left}px, ${rect.top-after.top}px)`}, {transform:'translate(0, 0)'}], {duration:duration(420), easing:'cubic-bezier(.22,1,.36,1)'});
      animations.set(tile, animation);
      animation.finished.catch(() => {}).then(() => { if (animations.get(tile) === animation) animations.delete(tile); });
    }
  }
  function swing(tile) {
    if (!reduced.matches) tile.animate([{transform:'rotate(-1.5deg)'},{transform:'rotate(1deg)'},{transform:'rotate(0deg)'}], {duration:560, easing:'ease-out'});
  }
  function photoRect(image) {
    const rect = image.getBoundingClientRect(), style = getComputedStyle(image);
    const left = parseFloat(style.borderLeftWidth) || 0, top = parseFloat(style.borderTopWidth) || 0;
    const width = parseFloat(style.width)-left-(parseFloat(style.borderRightWidth)||0), height = parseFloat(style.height)-top-(parseFloat(style.borderBottomWidth)||0);
    return {left:rect.left+rect.width/2-width/2, top:rect.top+rect.height/2-height/2, width, height, angle:parseFloat(getComputedStyle(image.closest('.photo-tile') || image).rotate)||0};
  }
  function frameInsets(image) {
    const print = image.closest('.photo-print'), style = getComputedStyle(print || image);
    return ['Top','Right','Bottom','Left'].map(side => parseFloat(style[(print ? 'padding' : 'border')+side+(print ? '' : 'Width')]) || 0);
  }
  async function flight(image, from, to, parent, destination) {
    const clone = createFlightImage(image), shell = document.createElement('div'), frame = document.createElement('div');
    shell.className = 'photo-flight'; shell.setAttribute('aria-hidden','true');
    shell.dataset.photoFrame = taken.dataset.photoFrame;
    clone.className = ''; frame.className = 'photo-flight-frame'; shell.append(frame,clone);
    Object.assign(shell.style, {left:from.left+'px', top:from.top+'px', width:from.width+'px', height:from.height+'px'}); parent.append(shell);
    const scale = to.width/from.width, start = frameInsets(image), end = frameInsets(destination);
    const options = {duration:duration(460), easing:'cubic-bezier(.22,1,.36,1)', fill:'forwards'};
    // Counteract the image scale so the frame stays thin throughout the flight.
    frame.animate(Array.from({length:21}, (_,i) => {
      const progress = i/20;
      return frameEdges(start.map((value,j) => value+(end[j]-value)*progress),1+(scale-1)*progress);
    }),options);
    const dx=to.left+to.width/2-from.left-from.width/2, dy=to.top+to.height/2-from.top-from.height/2;
    const animation = shell.animate([{transform:`translate(0,0) scale(1) rotate(${from.angle}deg)`}, {transform:`translate(${dx}px, ${dy}px) scale(${scale}) rotate(${to.angle}deg)`}], options);
    await animation.finished.catch(() => {});
    return () => shell.remove();
  }
  async function takePhoto(slot) {
    if (busy || gesture || charmGesture || dialog.open) return;
    busy = true; taken = slot;
    const image = slot.querySelector('img'), from = photoRect(image);
    dialog.dataset.photoFrame = slot.dataset.photoFrame;
    large.src = image.src; large.width = image.naturalWidth || image.width; large.height = image.naturalHeight || image.height;
    try { await large.decode(); } catch {}
    previousScroll = {left:window.scrollX, top:window.scrollY};
    previousOverflow = document.documentElement.style.overflow; document.documentElement.style.overflow = 'hidden';
    large.style.visibility = 'hidden'; rehang.disabled = true; dialog.showModal();
    // Paint the transparent backdrop before starting its transition.
    getComputedStyle(dialog).backgroundColor;
    dialog.classList.add('is-open'); slot.classList.add('is-taken');
    const finishFlight = await flight(image, from, photoRect(large), dialog, large);
    large.style.visibility = ''; finishFlight(); rehang.disabled = false; busy = false; rehang.focus();
  }
  async function hangPhoto() {
    if (busy || !taken) return;
    busy = true; rehang.disabled = true;
    const slot = taken, image = slot.querySelector('img'), from = photoRect(large);
    window.scrollTo({...previousScroll,behavior:'instant'});
    large.style.visibility = 'hidden'; dialog.classList.remove('is-open');
    const finishFlight = await flight(large, from, photoRect(image), dialog, image);
    slot.classList.remove('is-taken'); finishFlight(); dialog.close(); document.documentElement.style.overflow = previousOverflow;
    window.scrollTo({...previousScroll,behavior:'instant'});
    taken = null; busy = false; rehang.disabled = false;
    slot.querySelector('.photo-open').focus({preventScroll:true}); swing(slot.querySelector('.photo-tile'));
  }
  rehang.addEventListener('click', hangPhoto);
  dialog.addEventListener('cancel', event => { event.preventDefault(); hangPhoto(); });
  dialog.addEventListener('click', event => { if (event.target === dialog) hangPhoto(); });
  wall.addEventListener('click', event => {
    if (suppressClick) { suppressClick = false; event.preventDefault(); return; }
    const open = event.target.closest('.photo-open'); if (open) takePhoto(open.closest('.photo-slot'));
  });
  wall.querySelector('.photo-wall-reset').addEventListener('click', () => {
    if (busy || gesture || charmGesture) return;
    animateLayout(() => applyLayout(originals)); resetCharms(); save();
  });
  wall.addEventListener('pointerdown', event => {
    if (busy || gesture || charmGesture || event.button !== 0) return;
    const handle = event.target.closest('.photo-clip, .photo-resize'), open = event.target.closest('.photo-open');
    if (!handle && (!open || event.pointerType === 'touch')) return;
    const slot = (handle || open).closest('.photo-slot'); if (!slot) return;
    const tile = slot.querySelector('.photo-tile');
    gesture = {slot, tile, id:event.pointerId, x:event.clientX, y:event.clientY, size:sizeOf(slot), mode:handle?.classList.contains('photo-resize') ? 'resize' : 'move', originalOrder:order()};
    if (handle) event.preventDefault();
  });
  function updateDropTarget(g, x, y) {
    const target = document.elementFromPoint(x,y)?.closest('.photo-slot');
    if (target && target !== g.slot && grid.contains(target)) {
      const next = movePhoto(order(),g.slot.dataset.photoSrc,target.dataset.photoSrc);
      animateLayout(() => { for (const src of next) grid.append(slots.get(src)); });
    }
  }
  function edgeScroll(g) {
    if (gesture !== g || g.mode !== 'move') return;
    const edge = 90, y = g.pointerY;
    const speed = y < edge ? -(edge-y)/8 : y > innerHeight-edge ? (y-innerHeight+edge)/8 : 0;
    if (speed) { window.scrollBy({top:speed,behavior:'instant'}); updateDropTarget(g,g.pointerX,g.pointerY); }
    requestAnimationFrame(() => edgeScroll(g));
  }
  wall.addEventListener('pointermove', event => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const g = gesture, dx = event.clientX-g.x, dy = event.clientY-g.y;
    g.pointerX = event.clientX; g.pointerY = event.clientY;
    if (!g.started && Math.hypot(dx,dy) < 5) return;
    if (!g.started) {
      g.started = true;
      wall.setPointerCapture(event.pointerId);
      if (g.mode === 'move') {
        const rect = g.tile.getBoundingClientRect();
        g.ghost = g.tile.cloneNode(true); g.ghost.classList.add('photo-drag-ghost'); g.ghost.setAttribute('aria-hidden','true');
        g.ghost.dataset.photoFrame = g.slot.dataset.photoFrame;
        const width=g.tile.offsetWidth, height=g.tile.offsetHeight;
        Object.assign(g.ghost.style,{left:rect.left+rect.width/2-width/2+'px',top:rect.top+rect.height/2-height/2+'px',width:width+'px',rotate:getComputedStyle(g.tile).rotate,transformOrigin:'50% 50%'});
        document.body.append(g.ghost); g.slot.classList.add('is-lifted');
        g.ghost.inert = true; edgeScroll(g);
      } else g.slot.classList.add('is-resizing');
    }
    if (g.mode === 'resize') { setSize(g.slot, g.size + dx/g.slot.clientWidth*200); layoutWall(); }
    else {
      g.ghost.style.translate = dx+'px '+dy+'px';
      updateDropTarget(g,event.clientX,event.clientY);
    }
  });
  async function finishGesture(event, cancelled = false) {
    if (!gesture || gesture.id !== event.pointerId) return;
    const g = gesture; gesture = null;
    if (wall.hasPointerCapture(event.pointerId)) wall.releasePointerCapture(event.pointerId);
    if (!g.started) return;
    suppressClick = true; setTimeout(() => { suppressClick = false; }, 0);
    if (cancelled) {
      setSize(g.slot,g.size); animateLayout(() => { for (const src of g.originalOrder) grid.append(slots.get(src)); });
    }
    g.slot.classList.remove('is-resizing');
    if (g.ghost) {
      busy = true;
      const from = g.ghost.getBoundingClientRect(), to = g.tile.getBoundingClientRect(), width=g.ghost.offsetWidth, height=g.ghost.offsetHeight;
      g.ghost.style.translate = ''; Object.assign(g.ghost.style,{left:from.left+from.width/2-width/2+'px',top:from.top+from.height/2-height/2+'px'});
      await g.ghost.animate([{transform:'translate(0,0)'},{transform:`translate(${to.left+to.width/2-from.left-from.width/2}px,${to.top+to.height/2-from.top-from.height/2}px)`}], {duration:duration(360), easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'}).finished.catch(() => {});
      g.ghost.remove(); g.slot.classList.remove('is-lifted'); busy = false; swing(g.tile);
    }
    layoutWall(); save();
  }
  wall.addEventListener('pointerup', event => finishGesture(event));
  wall.addEventListener('pointercancel', event => finishGesture(event,true));
  wall.addEventListener('keydown', event => {
    if (busy || gesture) return;
    const handle = event.target.closest('.photo-clip, .photo-resize');
    if (!handle || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const slot = handle.closest('.photo-slot'), forward = ['ArrowRight','ArrowDown'].includes(event.key);
    if (handle.classList.contains('photo-resize')) { setSize(slot,sizeOf(slot)+(forward?3:-3)); layoutWall(); }
    else {
      const ids = order(), index = ids.indexOf(slot.dataset.photoSrc), columns = grid.clientWidth < 500 ? 1 : grid.clientWidth < 850 ? 2 : 3;
      const offset = ['ArrowUp','ArrowDown'].includes(event.key) ? columns : 1, target = ids[index+(forward?offset:-offset)];
      if (target) animateLayout(() => { for (const src of movePhoto(ids,slot.dataset.photoSrc,target)) grid.append(slots.get(src)); });
      handle.focus({preventScroll:true});
    }
    save();
  });
  const charms = [...grid.querySelectorAll('.photo-charm')], charmStorageKey = 'tommy-cheese-wall-charms-v1';
  function charmDefaults(charm) {
    const position = {x:Number(charm.dataset.charmX),y:Number(charm.dataset.charmY)};
    const row = charm.hasAttribute('data-charm-rope') && ropeRows[Number(charm.dataset.charmRope)];
    return row ? hangingCharmPosition(position.x,row,grid.clientWidth,grid.clientHeight,charm.offsetHeight) : position;
  }
  function updateCharmHook(charm) {
    const x = parseFloat(charm.style.left)/100*grid.clientWidth;
    const top = parseFloat(charm.style.top)/100*grid.clientHeight-charm.offsetHeight/2;
    // A little hysteresis keeps the hook from flickering at the edge.
    let offset = charmHook(x,top,grid.clientWidth,ropeRows,charm.classList.contains('is-hooked') ? 22 : 18);
    if (offset !== null) {
      const bounds = grid.getBoundingClientRect(), hookX = bounds.left+x, hookY = bounds.top+top+offset;
      const covered = [...grid.querySelectorAll('.photo-print')].some(print => {
        const rect = print.getBoundingClientRect();
        return hookX >= rect.left-3 && hookX <= rect.right+3 && hookY >= rect.top-3 && hookY <= rect.bottom+3;
      });
      if (covered) offset = null;
    }
    charm.classList.toggle('is-hooked',offset !== null);
    if (offset !== null) {
      charm.style.setProperty('--hook-top',offset-4+'px');
      charm.style.setProperty('--hook-length',Math.max(4,charm.offsetHeight*.22-offset-4)+'px');
    }
  }
  function placeCharm(charm, position) {
    const xMargin = charm.offsetWidth/2/grid.clientWidth*100, yMargin = charm.offsetHeight/2/grid.clientHeight*100;
    const safe = charmPosition(position,charmDefaults(charm));
    charm.style.left = Math.max(xMargin,Math.min(100-xMargin,safe.x))+'%';
    charm.style.top = Math.max(yMargin,Math.min(100-yMargin,safe.y))+'%';
    updateCharmHook(charm);
  }
  const charmLocation = charm => ({x:parseFloat(charm.style.left),y:parseFloat(charm.style.top)});
  function saveCharms() {
    try { localStorage.setItem(charmStorageKey,JSON.stringify(Object.fromEntries(charms.map(charm => [charm.dataset.charm,charmLocation(charm)])))); } catch {}
  }
  function resetCharms() { for (const charm of charms) placeCharm(charm,charmDefaults(charm)); saveCharms(); }
  let storedCharms;
  try { storedCharms = JSON.parse(localStorage.getItem(charmStorageKey)); } catch {}
  for (const charm of charms) {
    placeCharm(charm,storedCharms?.[charm.dataset.charm]);
    charm.addEventListener('pointerdown', event => {
      if (busy || gesture || charmGesture || event.button !== 0) return;
      event.preventDefault(); event.stopPropagation();
      charmGesture = {charm,id:event.pointerId,x:event.clientX,y:event.clientY,original:charmLocation(charm)};
      charm.setPointerCapture(event.pointerId); charm.classList.add('is-moving');
    });
    charm.addEventListener('pointermove', event => {
      const g = charmGesture;
      if (!g || g.charm !== charm || g.id !== event.pointerId) return;
      placeCharm(charm,{x:g.original.x+(event.clientX-g.x)/grid.clientWidth*100,y:g.original.y+(event.clientY-g.y)/grid.clientHeight*100});
    });
    const finish = event => {
      const g = charmGesture;
      if (!g || g.charm !== charm || g.id !== event.pointerId) return;
      if (event.type === 'pointercancel') placeCharm(charm,g.original);
      charmGesture = null; charm.classList.remove('is-moving');
      if (charm.hasPointerCapture(event.pointerId)) charm.releasePointerCapture(event.pointerId);
      saveCharms(); swing(charm);
    };
    charm.addEventListener('pointerup',finish); charm.addEventListener('pointercancel',finish);
    charm.addEventListener('lostpointercapture',finish);
    charm.addEventListener('keydown',event => {
      if (busy || gesture || charmGesture || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return;
      event.preventDefault(); event.stopPropagation();
      const position = charmLocation(charm), step = event.shiftKey ? 20 : 6;
      position.x += (event.key === 'ArrowRight' ? step : event.key === 'ArrowLeft' ? -step : 0)/grid.clientWidth*100;
      position.y += (event.key === 'ArrowDown' ? step : event.key === 'ArrowUp' ? -step : 0)/grid.clientHeight*100;
      placeCharm(charm,position); saveCharms();
    });
  }
  new ResizeObserver(() => { for (const charm of charms) placeCharm(charm,charmLocation(charm)); }).observe(grid);

}
