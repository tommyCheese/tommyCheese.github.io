const interactive = 'button,a[href],input,textarea,select,summary,[contenteditable="true"],[role="separator"]';
const defaults = {
  'welcome-dialog':['welcome-next','welcome-start'],
  'lesson-intro-dialog':['lesson-intro-start'],
  'completion-dialog':['completion-next'],
  'help-dialog':['help-close'],
  // Enter on prose never confirms a destructive action.
  'restart-dialog':['restart-cancel'],
};
const visible = node => !!node && !node.disabled && !!node.getClientRects().length && !node.closest('[hidden],dialog:not([open])');
export function spatialNeighbor(items, current, key) {
  const origin=current.getBoundingClientRect(), horizontal=key==='ArrowLeft'||key==='ArrowRight';
  const sign=key==='ArrowLeft'||key==='ArrowUp' ? -1 : 1;
  const cx=origin.x+origin.width/2, cy=origin.y+origin.height/2;
  return items.filter(item=>item!==current).map(item=> {
    const box=item.getBoundingClientRect(), dx=box.x+box.width/2-cx, dy=box.y+box.height/2-cy;
    const forward=(horizontal?dx:dy)*sign, across=Math.abs(horizontal?dy:dx);
    return {item,forward,score:forward+across*3};
  }).filter(item=>item.forward>1).sort((a,b)=>a.score-b.score)[0]?.item;
}
export function setupKeyboardNavigation(doc) {
  const byId=id=>doc.getElementById(id);
  const shown=selector=>[...doc.querySelectorAll(selector)].filter(visible);
  const modal=()=>[...doc.querySelectorAll('dialog:modal')].at(-1);
  const openers=new Map();
  let lastTarget=doc.activeElement;
  const remember=event=> { lastTarget=event.target.closest(interactive) || event.target; };
  doc.addEventListener('pointerdown',remember,true);
  doc.addEventListener('click',remember,true);
  // Keep labels outside dynamic button text, so renderers can update their captions freely.
  for (const id of ['welcome-next','welcome-start','lesson-intro-start','completion-next','review-start']) {
    const button=byId(id); if (button) { button.dataset.key='Enter'; button.setAttribute('aria-keyshortcuts','Enter'); }
  }
  for (const id of ['completion-stay','restart-cancel']) {
    const button=byId(id); if (button) { button.dataset.key='Esc'; button.setAttribute('aria-keyshortcuts','Escape'); }
  }
  for (const close of doc.querySelectorAll('dialog button[id$="-close"]')) {
    close.setAttribute('aria-keyshortcuts','Escape'); close.title='Esc';
  }
  for (const dialog of doc.querySelectorAll('dialog')) {
    const observer=new doc.defaultView.MutationObserver(()=> {
      if (dialog.open && !openers.has(dialog)) {
        openers.set(dialog,visible(lastTarget) && !dialog.contains(lastTarget) ? lastTarget : null);
        if (dialog.id==='levels-dialog') byId('course-search').focus();
      }
    });
    observer.observe(dialog,{attributes:true,attributeFilter:['open']});
    dialog.addEventListener('close',()=> {
      if (dialog.open) return;
      const selected=dialog.id==='levels-dialog' && dialog.returnValue==='selected';
      dialog.returnValue='';
      const opener=openers.get(dialog); openers.delete(dialog);
      queueMicrotask(()=> {
        const active=modal();
        if (!active && (selected || ['lesson-intro-dialog','completion-dialog'].includes(dialog.id)) && visible(byId('command-input'))) {
          byId('command-input').focus({preventScroll:true}); return;
        }
        if (visible(opener) && (!active || active.contains(opener))) opener.focus({preventScroll:true});
        else if (!active) {
          const fallback=visible(byId('review-area')) ? byId('review-start') : byId('command-input');
          if (visible(fallback)) fallback.focus({preventScroll:true});
        }
      });
    });
  }
  doc.addEventListener('keydown',event=> {
    if (event.isComposing || event.keyCode===229) return;
    const target=event.target, dialog=modal();
    const consume=()=> { event.preventDefault(); event.stopPropagation(); };
    if (event.key==='Escape' && !event.ctrlKey && !event.altKey && !event.metaKey) {
      if (dialog) { consume(); dialog.close(); return; }
      if (visible(byId('review-area'))) { consume(); byId('review-return').click(); return; }
      if (target.closest('#world-area') && visible(byId('file-preview'))) {
        consume(); byId('preview-close').click(); byId('files-tab').focus(); return;
      }
      // Existing Escape behavior hides the goal panel; otherwise return to the terminal.
      if (!visible(byId('mission-window')) && visible(byId('command-input'))) {
        consume(); byId('command-input').focus(); return;
      }
    }
    if (event.key==='F6' && !event.ctrlKey && !event.altKey && !event.metaKey && !dialog) {
      const panes=[['world-area','files-tab'],['practice-area','command-input'],['mission-window','task-title']].filter(([id])=>visible(byId(id)));
      if (!panes.length) return;
      const index=panes.findIndex(([id])=>byId(id).contains(target)), step=event.shiftKey?-1:1;
      const next=index<0 ? (step>0?0:panes.length-1) : (index+step+panes.length)%panes.length;
      consume(); byId(panes[next][1]).focus({preventScroll:true}); return;
    }
    if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) return;
    if (event.key==='Enter') {
      if (dialog && event.repeat) { consume(); return; }
      if (dialog?.id==='levels-dialog' && target===byId('course-search')) {
        const first=shown('#chapters a.lesson-link,#chapters button.boss-link:not(:disabled)')[0];
        consume(); if (first) first.click(); return;
      }
      if (target.closest(interactive)) return; // Native activation of the focused control wins.
      const action=dialog ? (defaults[dialog.id] || []).map(byId).find(visible)
        : visible(byId('review-area')) ? byId('review-start') : null;
      if (action) { consume(); action.click(); }
      return;
    }
    if (event.key==='ArrowDown' && dialog?.id==='levels-dialog' && target===byId('course-search')) {
      const first=shown('#chapters a.lesson-link,#chapters button.boss-link:not(:disabled)')[0];
      if (first) { consume(); first.focus(); } return;
    }
    if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)) return;
    const group=target.closest('#level-tabs,.scene-controls,.hint-navigation');
    if (group && target.closest('button')) {
      if (group.classList.contains('hint-navigation')) {
        if (event.key==='Home' || event.key==='End') return;
        const action=byId(['ArrowLeft','ArrowUp'].includes(event.key)?'hint-previous':'hint-next');
        consume(); if (visible(action)) action.click(); return;
      }
      const buttons=[...group.querySelectorAll('button')].filter(visible), current=target.closest('button');
      const index=buttons.indexOf(current), offset=['ArrowLeft','ArrowUp'].includes(event.key)?-1:1;
      const next=event.key==='Home'?buttons[0]:event.key==='End'?buttons.at(-1):buttons[(index+offset+buttons.length)%buttons.length];
      if (next) { consume(); next.focus(); next.click(); } return;
    }
    const item=target.closest('#chapters .lesson-link,#chapters .boss-link,#file-list .finder-item');
    if (item) {
      const items=shown(item.closest('#chapters') ? '#chapters .lesson-link,#chapters .boss-link:not(:disabled)' : '#file-list .finder-item');
      const next=event.key==='Home'?items[0]:event.key==='End'?items.at(-1):spatialNeighbor(items,item,event.key);
      consume(); if (next) next.focus();
    }
  },true);
}
