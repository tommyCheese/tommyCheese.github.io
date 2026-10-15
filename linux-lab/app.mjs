import { goalReference } from './task-copy.mjs';
import { completionMessage, compareSolutions, stateHint, methodInsights, describeChanges, nextTransition, pipelineStages, lessonIntroduction } from './guidance.mjs?v=20261016-intro';
import { restoreFlowAssets, restoreFlowSnapshot } from './lesson-flow.mjs';
import { starterRoute, starterPhases, starterPhase, goalDifference, explainCommand, alternativeSolutions } from './practice-support.mjs';
import { createBossLesson } from './bosses.mjs';
import { terminalLabs } from './terminal-labs.mjs';
import { validLearning, recordPractice, mastery, reviewQueue, varyExercise, validExercise, validAttempt, bossChallenges, bossUnlocked } from './learning.mjs';
import { validHistory, validSnapshot, validateBackup } from './backup.mjs';
import { PracticeHistory } from './history.mjs';
import { Shell, HOME, seedState, evaluate, resolve, basicCommands } from './shell.mjs';
import { lessons, chapters, manuals, levels, createLessonShell } from './curriculum.mjs';

const $ = id => document.getElementById(id);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const activeMotions = new Map();
function reveal(node, distance = 6) {
  activeMotions.get(node)?.cancel();
  if (reducedMotion.matches || node.hidden) return;
  const animation = node.animate([
    { opacity: .35, translate: `0 ${distance}px` },
    { opacity: 1, translate: '0 0' }
  ], { duration: 240, easing: 'cubic-bezier(.22,1,.36,1)' });
  activeMotions.set(node, animation);
  animation.finished.then(() => {
    if (activeMotions.get(node) === animation) activeMotions.delete(node);
  }).catch(() => {});
}
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) { for (const animation of activeMotions.values()) animation.cancel(); activeMotions.clear(); }
});
const element = (tag, text, className) => { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; if (className) node.className = className; return node; };
const KEY = 'tommy-cheese-linux-lab-v1';
const supportedNames = new Set(manuals.map(item => item.name));
const ids = new Set(lessons.map(item => item.id));
let storageAvailable = true;
let saved = {};
try { saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch { saved = {}; }
if (typeof saved !== 'object' || Array.isArray(saved)) saved = {};
const completed = new Set(Array.isArray(saved.completed) ? saved.completed.filter(id => ids.has(id)) : []);
const favorites = new Set(Array.isArray(saved.favorites) ? saved.favorites.filter(name => supportedNames.has(name)) : []);
let currentId = ids.has(saved.current) ? saved.current : lessons[0].id;
let lesson = lessons.find(item => item.id === currentId);
let mode = 'learn'; let shell; let transcript = []; let hint = 0; let goalChecks = [];
let browsePath = HOME; let previewPath; let lastResult = { stdout: '', code: 1 };
let historyCursor = 0; let draft = ''; let changes = new Set();
let selectedLevel = lesson.level;
let sandboxSession;
const practiceHistory = new PracticeHistory();
let learning = validLearning(saved.learning, ids) ? saved.learning : {};
const bosses = bossChallenges(lessons);
const bossIds = new Set(bosses.map(item => item.id));
let bossCompleted = new Set(Array.isArray(saved.bossCompleted) ? saved.bossCompleted.filter(id => bossIds.has(id)) : []);
let training = null;
let starterMode = false;
let solutionCache;
let exerciseInitialState;
let onboardingReady = false;
let latestChanges = [];
let guideLesson;
let hintVisible = false;
const chapterExpansion = new Map();
const goalExpansion = new Map();
let guideVisible = true;
const guideLayoutIds = ['world-area','practice-area','terminal-resize'];
let guideLayoutMotion;
function finishGuideLayout() {
  const panel = $('mission-window');
  $('workspace').classList.remove('guide-moving');
  for (const property of ['position','left','top','width','height','grid-column','grid-row','overflow','--guide-content-width']) panel.style.removeProperty(property);
  panel.hidden = !(guideVisible && mode === 'learn');
}
function cancelGuideLayout() {
  for (const id of [...guideLayoutIds,'mission-window']) activeMotions.get($(id))?.cancel();
  guideLayoutMotion = undefined;
  finishGuideLayout();
}
// Animate actual widths, keeping terminal text and file icons unscaled.
function animateGuideLayout(before, shown) {
  const animations = [];
  $('workspace').classList.add('guide-moving');
  const panel = $('mission-window');
  panel.style.setProperty('--guide-content-width', panel.clientWidth + 'px');
  panel.style.overflow = 'hidden';
  for (const id of [...guideLayoutIds,'mission-window']) {
    const node = $(id), after = node.getBoundingClientRect(), previous = before.get(id);
    const guideFrames = [
      {width:'0px',borderWidth:'0px',translate:after.width+'px 0'},
      {width:after.width+'px',borderWidth:'1px',translate:'0 0'}
    ];
    const frames = id === 'mission-window' ? (shown ? guideFrames : guideFrames.reverse()) : [
      {width:previous.width+'px',translate:`${previous.x-after.x}px ${previous.y-after.y}px`},
      {width:after.width+'px',translate:'0 0'}
    ];
    // One shared edge: the guide gains exactly the space the workspace releases.
    const animation = node.animate(frames,{duration:280,easing:'cubic-bezier(.22,1,.36,1)'});
    activeMotions.set(node,animation); animations.push(animation.finished);
    animation.finished.finally(()=> { if (activeMotions.get(node) === animation) activeMotions.delete(node); }).catch(()=> {});
  }
  const pending = Promise.allSettled(animations);
  guideLayoutMotion = pending;
  pending.then(()=> { if (guideLayoutMotion === pending) { guideLayoutMotion = undefined; finishGuideLayout(); updateTerminalResize(); } });
}
function setGuideVisible(visible) {
  const panel = $('mission-window'), terminal = $('practice-area');
  const shown = visible && mode === 'learn', wasShown = !panel.hidden;
  const animate = !reducedMotion.matches && mode === 'learn' && !terminal.hidden && wasShown !== shown && window.matchMedia('(min-width:901px)').matches;
  const before = animate ? new Map([...guideLayoutIds,'mission-window'].map(id=>[id,$(id).getBoundingClientRect()])) : null;
  cancelGuideLayout();
  const oldGuideWidth = panel.hidden ? 0 : panel.getBoundingClientRect().width;
  const oldTerminalWidth = terminal.getBoundingClientRect().width;
  const customWidth = $('workspace').style.getPropertyValue('--terminal-width');
  guideVisible = visible;
  panel.hidden = !shown;
  if (animate && !shown) {
    const previous = before.get('mission-window'), workspace = $('workspace').getBoundingClientRect();
    Object.assign(panel.style,{position:'absolute',gridColumn:'auto',gridRow:'auto',left:previous.x-workspace.x+'px',top:previous.y-workspace.y+'px',width:previous.width+'px',height:previous.height+'px'});
    panel.hidden = false;
  }
  $('workspace').classList.toggle('guide-hidden', !shown);
  $('task-goal-button').setAttribute('aria-expanded', String(shown));
  $('task-goal-label').textContent = shown ? '隐藏目标' : '显示目标';
  const newGuideWidth = shown ? panel.getBoundingClientRect().width : 0;
  if (mode === 'learn' && customWidth && oldTerminalWidth > 0 && oldGuideWidth !== newGuideWidth && window.matchMedia('(min-width:901px)').matches) {
    resizeTerminal(oldTerminalWidth + (oldGuideWidth - newGuideWidth) / 2);
  } else updateTerminalResize();
  if (animate) animateGuideLayout(before,shown);
}
function showTaskGuide() {
  if (mode !== 'learn') return;
  setGuideVisible(true);
  $('task-title').focus({preventScroll:true});
  $('mission-window').scrollTop = 0;
}
function showLessonIntro() {
  if (mode !== 'learn' || document.querySelector('dialog:modal')) return;
  const intro = lessonIntroduction(lesson, {review:training?.kind === 'review',boss:training?.challengeVersion === 1});
  $('lesson-intro-title').textContent = lesson.title;
  $('lesson-intro-category').textContent = $('task-category').textContent;
  $('lesson-intro-lead').textContent = intro.lead;
  $('lesson-intro-knowledge').textContent = intro.knowledge;
  const manual = intro.showTool && manuals.find(item => item.name === lesson.command);
  $('lesson-intro-tool').hidden = !manual;
  $('lesson-intro-syntax').textContent = manual?.syntax || '';
  $('lesson-intro-dialog').showModal();
}
$('lesson-intro-button').addEventListener('click', showLessonIntro);
for (const id of ['lesson-intro-start','lesson-intro-close']) $(id).addEventListener('click', () => $('lesson-intro-dialog').close());
$('lesson-intro-dialog').addEventListener('close', () => {
  if (mode === 'learn' && !document.querySelector('dialog:modal')) $('command-input').focus({preventScroll:true});
});
function prepareTaskGuide() {
  if (mode !== 'learn' || guideLesson === lesson) return;
  $('task-commands').replaceChildren();
  $('task-tools').open = !training && lesson.level === 'common' && (!starterMode || ['orientation','workspace'].includes(starterPhase(currentId)?.id));
  const names = training?.challengeVersion === 1 ? [] : [...new Set([lesson.command,...(lesson.reviewCommands || [])])];
  $('task-tools').hidden = !names.length;
  for (const name of names) {
    const manual = manuals.find(item=>item.name === name); if (!manual) continue;
    const row = element('div',undefined,'intro-command');
    row.append(element('code',name),element('span',manual.summary));
    if (manual.syntax !== name) row.append(element('code',manual.syntax,'intro-syntax'));
    $('task-commands').append(row);
  }
  guideLesson = lesson;
}
$('task-goal-button').addEventListener('click',()=> {
  if (guideVisible) { setGuideVisible(false); $('command-input').focus({preventScroll:true}); }
  else showTaskGuide();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !event.isComposing && mode === 'learn' && guideVisible && !document.querySelector('dialog:modal')) {
    event.preventDefault(); setGuideVisible(false); $('command-input').focus({preventScroll:true});
  }
});
const navigationLessons = () => starterMode ? starterRoute.map(id => lessons.find(item => item.id === id)) : lessons;
const taskRoute = id => (starterMode ? 'starter/' : 'task/') + id;
let transfer = saved.transfer && typeof saved.transfer === 'object' ? saved.transfer : {};
let attempt = { maxHint:0, errors:0, graded:false };
function makeExercise() {
  const source = training?.challengeVersion === 1 ? createBossLesson(bosses.find(item => item.id === training.boss), currentId) : lessons.find(item => item.id === currentId);
  const seeded = createLessonShell(Shell, seedState, source);
  if (!training) { lesson = source; return seeded; }
  const varied = varyExercise(source, seeded.state, training.variant);
  lesson = varied.lesson;
  return new Shell(varied.state, manuals);
}
function renderLearning() {
  const due = reviewQueue(lessons, completed, learning);
  $('review-count').textContent = due.length ? String(due.length) : '';
  $('learning-summary').textContent = `已完成 ${completed.size} · 已掌握 ${Object.values(learning).filter(record => mastery(record) === '已掌握').length}`;
  $('review-start').disabled = !due.length;
  $('review-status').textContent = due.length ? `今日 ${due.length} 题` : completed.size ? '今天没有待复习任务' : '完成关卡后解锁复习';
  $('review-return').href = '#' + (saved.session?.exercise?.kind || (saved.courseRoute === 'starter' && starterRoute.includes(currentId) ? 'starter' : 'task')) + '/' + currentId;
  $('review-button').setAttribute('aria-current', mode === 'review' ? 'page' : 'false');
  $('review-list').replaceChildren();
  for (const id of due) {
    const item = lessons.find(entry => entry.id === id); const card = element('article', undefined, 'review-card');
    const content = element('div'); content.append(element('h2', item.title), element('span', mastery(learning[id]), 'mastery-state'));
    const button = element('button', '复习 →'); button.setAttribute('aria-label', '复习：' + item.title);
    button.addEventListener('click', () => beginTraining('review', [id]));
    card.append(content, button); $('review-list').append(card);
  }
  $('mastery-list').replaceChildren();
  for (const item of lessons.filter(item => completed.has(item.id))) {
    const record = learning[item.id]; const row = element('li');
    const link = element('a', item.title); link.href = '#task/' + item.id;
    row.append(link, element('span', mastery(record), 'mastery-state'));
    if (record) row.title = `${record.passes} 次完成 · 下次复习 ${new Date(record.dueAt).toLocaleDateString('zh-CN')}`;
    $('mastery-list').append(row);
  }
}
function beginTraining(kind, queue, boss) {
  if (!queue.length) return;
  if (shell) persist();
  saved.session = undefined; shell = undefined;
  training = { kind, queue, index:0, variant:Date.now() % 997 + 1, ...(boss ? {boss,challengeVersion:1} : {}) };
  const route = kind + '/' + queue[0];
  history.pushState(null, '', '#' + route); navigate('#' + route);
}
function startBoss(boss) {
  if (!bossUnlocked(boss, completed)) return;
  beginTraining('quiz', [boss.prerequisites[0]], boss.id);
}
function advanceLesson() {
  if ($('completion-dialog').open) $('completion-dialog').close();
  if (training) {
    if (training.index + 1 < training.queue.length) {
      persist(); shell = undefined; saved.session = undefined;
      training.index++; training.variant++;
      location.hash = training.kind + '/' + training.queue[training.index];
    } else {
      const kind = training.kind;
      const boss = training.boss;
      persist();
      if (kind === 'review') {
        history.replaceState(null, '', '#review'); navigate('#review');
        $('review-status').textContent = '本轮复习完成！';
      } else {
        history.replaceState(null, '', '#task/' + currentId);
        navigate('#task/' + currentId, false, {showGuide:false});
        selectedLevel = lesson.level; renderChapters(); $('levels-dialog').showModal();
        announce(boss ? 'Boss 挑战完成！' : '专题小测完成！');
      }
    }
    return;
  }
  const items = navigationLessons(); const next = items[items.findIndex(item => item.id === currentId) + 1];
  if (next) location.hash = taskRoute(next.id);
  else { selectedLevel = starterMode ? 'common' : lesson.level; renderChapters(); $('levels-dialog').showModal(); }
}


function announce(text) { $('announcement').textContent = text; }

function showCompletion(newBoss) {
  const copy = completionMessage(lesson,{boss:training?.challengeVersion === 1,review:training?.kind === 'review'});
  $('completion-title').textContent = copy.title;
  $('completion-detail').textContent = copy.detail;
  $('completion-lesson').textContent = lesson.title;
  const sequence = training ? training.queue.map(id=>lessons.find(item=>item.id === id)) : navigationLessons();
  const position = training ? training.index : sequence.findIndex(item=>item.id === currentId);
  const next = sequence[position+1];
  const count = training ? position+1 : sequence.filter(item=>completed.has(item.id)).length;
  $('completion-progress').max = sequence.length; $('completion-progress').value = count;
  $('completion-count').textContent = `${training ? '本轮训练' : starterMode ? '入门路线' : '课程进度'} · ${count} / ${sequence.length}`;
  $('completion-next-preview').textContent = next ? nextTransition(lesson,next) : training ? '本轮目标已全部完成。' : '路线完成，可以选择新的专题了。';
  $('completion-next').textContent = next ? '继续挑战 →' : training ? '完成本轮 ✓' : '去关卡地图 →';
  $('completion-unlock').hidden = !newBoss;
  if (newBoss) $('completion-unlock').textContent = '👾 新的 Boss 挑战已解锁';
  $('completion-comparison').open = true;
  renderComparison($('completion-comparison-content'));
  $('completion-dialog').showModal();
}
function renderComparison(container) {
  if (!solutionCache) solutionCache = alternativeSolutions(lesson, exerciseInitialState);
  const comparison = compareSolutions(shell.state.history, solutionCache);
  container.replaceChildren(element('p',comparison.message,'comparison-note'));
  const columns = element('div',undefined,'solution-columns');
  for (const [title,lines,differences] of [[`你的操作 · ${comparison.yours.length} 行${shell.state.history.length >= 200 ? '（最近记录）' : ''}`,comparison.yours,comparison.yoursDifferent],['参考解法'+(comparison.reference ? ` · ${comparison.reference.lines.length} 行` : ''),comparison.reference?.lines || [],comparison.referenceDifferent]]) {
    const block = element('section'); block.append(element('h3',title));
    const list = element('ol',undefined,'solution-lines');
    for (const [index,line] of lines.entries()) {
      const item = element('li'); item.classList.toggle('different', differences?.[index] === true);
      item.append(element('code',line)); list.append(item);
    }
    block.append(list); columns.append(block);
  }
  container.append(columns,element('p','高亮部分为不同写法；参考解法不是唯一解。','comparison-note'));
  const insights = methodInsights(shell.state.history,comparison.reference?.lines,shell.state.env);
  if (insights.length) {
    const list=element('ul',undefined,'method-insights');
    for (const text of insights) list.append(element('li',text));
    container.append(list);
  }
}
for (const id of ['completion-close','completion-stay']) $(id).addEventListener('click',()=> $('completion-dialog').close());
$('completion-next').addEventListener('click',advanceLesson);
$('completion-dialog').addEventListener('close',()=> { if (mode === 'learn' && !document.querySelector('dialog:modal')) $('command-input').focus({preventScroll:true}); });

function persist() {
  const payload = { version: 1, completed: [...completed], favorites: [...favorites], current: currentId, learning, transfer, bossCompleted:[...bossCompleted], courseRoute:mode === 'learn' && !training ? starterMode ? 'starter' : 'full' : saved.courseRoute || 'full',
    session: mode === 'learn' && shell ? { revision: 2, flowVersion:2, lesson: currentId, state: shell.state, transcript: transcript.slice(-60), hint, hintVisible, exercise:training, attempt, outputs: goalChecks.map(goal => goal.type === 'output' && goal.done), undoRedo: { past: practiceHistory.past, future: practiceHistory.future } } : saved.session,
    sandbox: mode === 'sandbox' && shell ? { snapshot: practiceSnapshot(), undoRedo: { past: practiceHistory.past, future: practiceHistory.future } } : saved.sandbox };
  try { localStorage.setItem(KEY, JSON.stringify(payload)); saved = payload; storageAvailable = true; }
  catch { storageAvailable = false; }
  $('save-status').textContent = storageAvailable ? '已保存' : '未保存 · 可导出';
}
function validSession(session) {
  return session && session.revision === 2 && session.lesson === currentId && session.state?.fs?.[HOME]?.type === 'dir'
    && typeof session.state.cwd === 'string' && session.state.fs[session.state.cwd]?.type === 'dir'
    && session.state.env && Array.isArray(session.state.processes) && session.state.services
    && Array.isArray(session.state.packages) && session.state.archives && session.state.network && Array.isArray(session.state.history);
}
for (const level of [{id:'starter', title:'入门路线'}, ...levels]) {
  const button = element('button', level.title); button.dataset.level = level.id;
  button.setAttribute('aria-pressed', String(level.id === selectedLevel));
  button.addEventListener('click', () => { selectedLevel = level.id; renderChapters(); });
  $('level-tabs').append(button);
}
$('course-progress').max = lessons.length;
function renderChapters() {
  const query = $('course-search').value.trim().toLowerCase();
  $('chapters').replaceChildren();
  const starter = selectedLevel === 'starter';
  for (const chapter of starter ? starterPhases : chapters) {
    const items = starter ? chapter.lessons.map(id => lessons.find(item => item.id === id)) : lessons.filter(item => item.chapter === chapter.id && item.level === selectedLevel);
    const matches = items.filter(item => !query || `${chapter.title} ${item.title} ${item.context} ${item.commands.join(' ')}`.toLowerCase().includes(query));
    const boss = bosses.find(item => item.level === selectedLevel && item.chapter === chapter.id);
    const showBoss = boss && (!query || `${chapter.title} boss 挑战 专题小测 ${items.map(item => item.command).join(' ')}`.toLowerCase().includes(query));
    if (!matches.length && !showBoss) continue;
    const group = element('details', undefined, 'chapter'); group.dataset.chapter = chapter.id;
    const expansionKey = selectedLevel + '/' + chapter.id;
    group.open = !!query || chapterExpansion.get(expansionKey) !== false;
    group.addEventListener('toggle', () => { if (!query && group.isConnected) chapterExpansion.set(expansionKey, group.open); });
    const summary = element('summary'); summary.append(element('span', chapter.number, 'chapter-number'), element('span', chapter.title));
    summary.title = `${chapter.description} ${items.filter(item => completed.has(item.id)).length}/${items.length} 已完成`;
    const list = element('ol');
    for (const item of matches) {
      const row = element('li'); const link = element('a', undefined, 'lesson-link' + (completed.has(item.id) ? ' done' : ''));
      link.href = '#' + (starter ? 'starter/' : 'task/') + item.id;
      if (item.id === currentId && mode === 'learn') link.setAttribute('aria-current', 'step');
      link.append(element('span', completed.has(item.id) ? '✓' : String(items.indexOf(item) + 1).padStart(2, '0'), 'lesson-marker'), element('span', item.title));
      const commandHint = element('span', item.command, 'lesson-command-tooltip');
      commandHint.setAttribute('aria-hidden', 'true'); link.append(commandHint);
      link.setAttribute('aria-label', item.title + '，' + item.command + (completed.has(item.id) ? '，已完成' : ''));
      if (completed.has(item.id)) link.title = mastery(learning[item.id]);
      row.append(link); list.append(row);
    }
    if (showBoss) {
      const unlocked = bossUnlocked(boss, completed);
      const done = bossCompleted.has(boss.id);
      const count = boss.prerequisites.filter(id => completed.has(id)).length;
      const row = element('li', undefined, 'boss-level');
      const button = element('button', undefined, 'lesson-link boss-link' + (unlocked ? ' available' : ' locked') + (done ? ' beaten' : ''));
      button.disabled = !unlocked; button.dataset.boss = boss.id;
      button.append(element('span', '👾', 'boss-marker'), element('strong', 'Boss 挑战'), element('span', done ? '已击败 · 再挑战' : unlocked ? '可挑战' : `未解锁 · ${count}/${boss.prerequisites.length}`, 'boss-status'));
      button.setAttribute('aria-label', `${chapter.title} Boss 挑战，${done ? '已击败，可再次挑战' : unlocked ? '可挑战' : '未解锁'}`);
      button.addEventListener('click', () => startBoss(boss));
      const requirements = element('details', undefined, 'boss-requirements');
      requirements.append(element('summary', '解锁关卡'));
      const requiredList = element('ul');
      for (const id of boss.prerequisites) {
        const item = lessons.find(entry => entry.id === id); const entry = element('li'); const link = element('a', (completed.has(id) ? '✓ ' : '○ ') + item.title);
        link.href = '#task/' + id; entry.append(link); requiredList.append(entry);
      }
      requirements.append(requiredList); row.append(button, requirements); list.append(row);
    }
    group.append(summary, list); $('chapters').append(group);
  }
  if (!$('chapters').childElementCount) $('chapters').append(element('p', '没有找到任务，试试命令名称。', 'empty-directory'));
  const tierLessons = starter ? starterRoute.map(id => lessons.find(item => item.id === id)) : lessons.filter(item => item.level === selectedLevel);
  $('progress-text').textContent = `${tierLessons.filter(item => completed.has(item.id)).length} / ${tierLessons.length}`;
  for (const button of $('level-tabs').children) button.setAttribute('aria-pressed', String(button.dataset.level === selectedLevel));
  $('course-progress').max = tierLessons.length;
  $('course-progress').value = tierLessons.filter(item => completed.has(item.id)).length;
  document.querySelector('[data-mode="learn"]').href = '#' + taskRoute(currentId);
  renderLearning();
}

function rememberGoalExpansion(details, key) {
  details.open = goalExpansion.get(key) === true;
  details.addEventListener('toggle', () => { if (details.isConnected) goalExpansion.set(key, details.open); });
}

function renderTask() {
  const sandbox = mode === 'sandbox'; const chapter = chapters.find(item => item.id === lesson.chapter);
  const items = lessons.filter(item => item.chapter === lesson.chapter && item.level === lesson.level);
  $('task-category').textContent = training ? (training.kind === 'review' ? '今日复习' : '👾 Boss 挑战') : sandbox ? '自由练习' : starterMode ? starterPhase(currentId).title : `${levels.find(item => item.id === lesson.level).title} · ${chapter.title}`;
  $('console-command').textContent = sandbox ? 'sandbox' : training ? training.challengeVersion === 1 ? 'Boss' : '复习' : lesson.command;
  $('task-position').textContent = training ? `${training.index + 1} / ${training.queue.length}` : sandbox ? '' : starterMode ? `${starterRoute.indexOf(currentId) + 1} / ${starterRoute.length}` : `${items.indexOf(lesson) + 1} / ${items.length}`;
  $('task-title').textContent = sandbox ? '自由练习' : lesson.title;
  prepareTaskGuide();
  $('task-goal-button').hidden = sandbox;
  $('goals').replaceChildren();
  document.querySelector('.mission-target').hidden = sandbox;
  if (!sandbox) for (const [index, goal] of goalChecks.entries()) {
    const item = element('li', undefined, goal.done ? 'done' : '');
    const check = element('span', goal.done ? '✓' : '', 'goal-check'); check.setAttribute('aria-hidden', 'true');
    const label = element('div', goal.label, 'goal-copy'); if (goal.done) label.append(element('span', '（已达成）', 'sr-only'));
    if (goal.path && !goal.label.includes(goal.path)) label.append(element('code', goal.path, 'goal-path'));
    const reference = goalReference(goal);
    if (reference) {
      const details = element('details', undefined, 'goal-reference');
      rememberGoalExpansion(details, 'reference/' + index);
      details.append(element('summary', reference.title), element('pre', reference.text));
      label.append(details);
    }
    const difference = hintVisible && lastResult.commands?.length ? goalDifference(goal, shell.state, lastResult) : null;
    if (difference) {
      const details = element('details', undefined, 'goal-difference');
      rememberGoalExpansion(details, 'difference/' + index);
      details.append(element('summary', '对照当前结果'));
      const comparison = element('div', undefined, 'goal-comparison');
      for (const [title, value] of [['目标',difference.expected],['当前',difference.actual]]) {
        const block = element('div'); block.append(element('strong',title), element('pre',value.slice(0,4000) + (value.length > 4000 ? '\n…' : ''))); comparison.append(block);
      }
      details.append(comparison); label.append(details);
    }
    item.append(check, label); $('goals').append(item);
  }
  const allDone = !sandbox && goalChecks.length && goalChecks.every(goal => goal.done);
  const achieved = goalChecks.filter(goal => goal.done).length;
  const progress = allDone ? '✓ 目标完成' : `${achieved} / ${goalChecks.length}`;
  if ($('goal-progress').textContent !== progress) $('goal-progress').textContent = progress;
  document.querySelector('.mission-target').classList.toggle('complete', !!allDone);
  $('task-badge').hidden = allDone || sandbox || !!training || !completed.has(currentId);
  $('task-badge').textContent = '已通关';
  $('task-badge').classList.toggle('complete', !!allDone);
  $('lesson-navigation').hidden = mode !== 'learn';
  const sequence = navigationLessons(); const lessonIndex = sequence.findIndex(item => item.id === currentId);
  $('previous-lesson').disabled = !!training || lessonIndex <= 0;
  $('next-lesson').disabled = training ? !allDone : lessonIndex >= sequence.length - 1;
  $('previous-lesson').title = sequence[lessonIndex - 1]?.title || '已是第一关';
  $('next-lesson').title = training ? training.index + 1 < training.queue.length ? '完成当前题后继续' : '完成本轮训练' : sequence[lessonIndex + 1]?.title || '已是最后一关';
  $('next-button').hidden = !allDone;
  $('next-button').textContent = training ? (training.index + 1 === training.queue.length ? '完成训练 ✓' : '下一题 →') : lessonIndex === sequence.length - 1 ? starterMode ? starterRoute.every(id => completed.has(id)) ? '路线完成 · 选择专题 →' : '选择专题继续 →' : '回到关卡地图 ↗' : '下一关 →';
  $('next-lesson').textContent = training ? $('next-button').textContent : '下一关 →';
  $('solution-review').hidden = !allDone;
  if (!allDone) { $('solution-review').open = false; $('solution-review-content').replaceChildren(); }
  else { $('solution-review').open = true; renderSolutionReview(); }
  $('mastery-badge').hidden = sandbox || training?.challengeVersion === 1 || !completed.has(currentId) || mastery(learning[currentId]) !== '已掌握';
  $('mastery-badge').textContent = mastery(learning[currentId]);
  $('hint-button').hidden = sandbox;
  $('hint-button').textContent = hintVisible ? '隐藏提示' : hint ? '显示提示' : '💡 给点提示';
  $('hint-button').setAttribute('aria-expanded',String(!sandbox && hintVisible));
  $('hint-box').hidden = sandbox || !hint || !hintVisible;
  $('hint-previous').disabled = hint <= 1;
  $('hint-next').disabled = hint >= 3;
  $('hint-position').textContent = `${hint || 1} / 3`;
  if (hint) {
    $('hint-title').textContent = ['给你一点线索','再往前想一步','一起看看一种做法'][hint-1];
    $('hint-content').textContent = stateHint(lesson,shell.state,goalChecks,hint,lastResult);
  }
  $('related-commands').replaceChildren();
  for (const command of training && !hint ? [] : sandbox ? ['help', 'ls', 'grep', 'man'] : lesson.commands) {
    const button = element('a', command + ' 手册', 'command-chip');
    button.href = './commands/' + encodeURIComponent(command) + '/';
    button.target = '_blank'; button.rel = 'noopener noreferrer';
    button.addEventListener('click', () => { if (mode === 'learn' && !attempt.graded) { attempt.maxHint = Math.max(1, attempt.maxHint); persist(); } });
    $('related-commands').append(button);
  }
}

function renderSolutionReview() {
  const content = $('solution-review-content'); content.replaceChildren();
  const comparison = element('div'); renderComparison(comparison); content.append(comparison);
  const entry = transcript.findLast(item => item.command);
  if (entry) {
    content.append(element('h3','最后一步的参数'));
    const list = element('dl', undefined, 'command-parts');
    const before = practiceHistory.past.at(-1)?.state || shell.state;
    for (const part of explainCommand(entry.command, before)) {
      const term = element('dt');
      if (part.command && supportedNames.has(part.command)) {
        const link = element('a', part.token); link.href = './commands/' + encodeURIComponent(part.command) + '/'; link.target = '_blank'; link.rel = 'noopener noreferrer'; term.append(link);
      } else term.append(element('code', part.token));
      list.append(term, element('dd',part.description));
    }
    content.append(list);
  }
  if (!solutionCache) solutionCache = alternativeSolutions(lesson, exerciseInitialState);
  const reference = compareSolutions(shell.state.history, solutionCache).reference;
  const normalize = text => text.split('\n').map(line => line.trim()).filter(Boolean).join('\n');
  const used = new Set([normalize(reference?.command || ''), normalize(shell.state.history.join('\n'))]);
  const alternatives = solutionCache.filter(candidate => { const command = normalize(candidate.command); if (used.has(command)) return false; used.add(command); return true; });
  if (alternatives.length) content.append(element('h3', '其他解法'));
  for (const candidate of alternatives) {
    const block = element('div', undefined, 'solution-example');
    block.append(element('p',candidate.note), element('pre',candidate.command)); content.append(block);
  }
}
$('solution-review').addEventListener('toggle', () => { if ($('solution-review').open && !$('solution-review').hidden) renderSolutionReview(); });

function appendTranscript(entry) {
  const row = element('div', undefined, 'terminal-entry');
  if (entry.command) row.append(element('pre', entry.path.replace(HOME, '~') + ' $ ' + entry.command, 'terminal-command'));
  if (entry.stdout) row.append(element('pre', entry.stdout));
  if (entry.stderr) row.append(element('pre', entry.stderr, 'terminal-error'));
  if (entry.message) row.append(element('pre', entry.message, 'terminal-welcome'));
  $('transcript').append(row); while ($('transcript').childElementCount > 60) $('transcript').firstChild.remove();
  $('transcript').scrollTop = $('transcript').scrollHeight;
}
function renderTranscript() {
  $('transcript').replaceChildren();
  for (const entry of transcript) if (entry && typeof entry === 'object') appendTranscript(entry);
  updatePrompt();
}
function updatePrompt() { $('prompt').textContent = shell.state.cwd.replace(HOME, '~') + ' $'; historyCursor = shell.state.history.length; }

const expandedDirectories = new Set(['/', '/home', HOME]);
function renderDirectoryTree() {
  const tree = $('file-tree'); tree.replaceChildren();
  const appendDirectory = (path, parent) => {
    const children = shell.children(path).filter(child => shell.state.fs[child].type === 'dir').sort();
    const row = element('button', path === '/' ? '/' : path === HOME ? '~' : path.split('/').pop(), 'directory-link');
    row.title = path;
    if (path === browsePath) row.setAttribute('aria-current', 'location');
    if (path === shell.state.cwd) row.classList.add('working-directory');
    row.addEventListener('click', event => {
      event.preventDefault(); browsePath = path; previewPath = undefined; renderWorld();
    });
    if (children.length) {
      const branch = element('details', undefined, 'directory-branch');
      branch.open = expandedDirectories.has(path) || browsePath === path || browsePath.startsWith(path === '/' ? '/' : path + '/');
      const summary = element('summary'); summary.append(row); branch.append(summary);
      const descendants = element('div', undefined, 'directory-children');
      for (const child of children) appendDirectory(child, descendants);
      branch.append(descendants);
      branch.addEventListener('toggle', () => { if (branch.open) expandedDirectories.add(path); else expandedDirectories.delete(path); });
      parent.append(branch);
    } else {
      const leaf = element('div', undefined, 'directory-leaf'); leaf.append(row); parent.append(leaf);
    }
  };
  appendDirectory('/', tree);
}
let displayedDirectory;
let displayedPreview;
function renderWorld(animateChanges = false) {
  const s = shell.state;
  if (s.fs[browsePath]?.type !== 'dir') browsePath = s.fs[s.cwd]?.type === 'dir' ? s.cwd : HOME;
  renderDirectoryTree();
  $('file-location').textContent = browsePath.replace(HOME, '~'); $('file-up').disabled = browsePath === '/';
  $('file-list').replaceChildren();
  const children = shell.children(browsePath).sort((a, b) => Number(s.fs[b].type === 'dir') - Number(s.fs[a].type === 'dir') || a.localeCompare(b));
  $('file-count').textContent = `${children.length} 项`;
  const svgNS = 'http://www.w3.org/2000/svg';
  for (const path of children) {
    const node = s.fs[path];
    const button = element('button', undefined, 'finder-item' + (changes.has(path) ? ' changed' : '') + (previewPath === path ? ' selected' : ''));
    button.title = path + ' · 权限 ' + node.mode;
    const icon = document.createElementNS(svgNS, 'svg');
    icon.setAttribute('viewBox', '0 0 80 70'); icon.setAttribute('aria-hidden', 'true'); icon.setAttribute('class', 'finder-icon');
    const shape = (d, fill, stroke) => {
      const part = document.createElementNS(svgNS, 'path'); part.setAttribute('d', d); part.setAttribute('fill', fill);
      if (stroke) part.setAttribute('stroke', stroke);
      icon.append(part);
    };
    if (node.type === 'dir') {
      shape('M5 19 Q5 15 9 15 H28 L35 22 H71 Q75 22 75 26 V59 Q75 63 71 63 H9 Q5 63 5 59 Z', '#50b8ec', '#3999cc');
      shape('M7 25 H73 V58 Q73 61 70 61 H10 Q7 61 7 58 Z', '#8ad6f6');
      shape('M7 25 H73 V30 H7 Z', '#a3e3fb');
      shape('M11 59 H69', 'none', '#67bce5');
    } else {
      shape('M20 5 H47 L62 20 V62 Q62 65 59 65 H20 Q17 65 17 62 V8 Q17 5 20 5 Z', '#fff', '#c6cbd1');
      shape('M47 5 V18 Q47 21 50 21 H62 Z', '#e8edf2', '#c6cbd1');
      for (const y of [31, 37, 43]) shape(`M25 ${y} H54`, 'none', '#dce2e7');
      const suffix = path.split('.').pop().toLowerCase();
      const tag = element('span', node.type === 'link' ? '↗' : ({sh:'SH',csv:'CSV',tar:'TAR',gz:'GZ'}[suffix] || 'TXT'), 'finder-file-tag');
      button.append(tag);
    }
    button.append(icon, element('span', path.split('/').pop(), 'finder-name'));
    if (path === s.cwd) button.append(element('span', '当前位置', 'finder-current'));
    button.addEventListener('click', () => {
      if (node.type === 'dir') { browsePath = path; previewPath = undefined; }
      else previewPath = path;
      renderWorld();
    });
    $('file-list').append(button);
    if (animateChanges && changes.has(path)) reveal(button,5);
  }
  if (!children.length) $('file-list').append(element('p', '空文件夹', 'finder-empty'));
  $('file-preview').hidden = !previewPath || !s.fs[previewPath];
  if (previewPath && s.fs[previewPath]) {
    const node = s.fs[previewPath]; $('preview-name').textContent = previewPath.split('/').pop();
    $('preview-meta').textContent = `权限 ${node.mode} · ${node.owner} · ${node.type === 'link' ? '符号链接' : '文本文件'}`;
    try { $('preview-text').textContent = node.type === 'link' ? '→ ' + node.target + '\n\n' + shell.read(previewPath) : node.text; }
    catch (error) { $('preview-text').textContent = error.message; }
  }
  $('system-view').replaceChildren();
  const section = (heading, rows) => {
    const block = element('div', undefined, 'system-section'); block.append(element('h3', heading));
    for (const [key, value] of rows) {
      const row = element('div', undefined, 'system-row'); row.append(element('span', key), element('span', String(value))); block.append(row);
      if (latestChanges.some(event=>event.name === key || event.kind === 'process' && key === event.name)) { row.classList.add('state-changed'); if (animateChanges) reveal(row,3); }
    }
    $('system-view').append(block);
  };
  section('进程 / PID', s.processes.map(item => [item.name, item.pid]));
  section('服务', Object.entries(s.services).map(([name, service]) => [name, `${service.active ? '运行中' : '未运行'} · ${service.enabled ? '开机启动' : '手动启动'}`]));
  section('网络', [['hostname', s.network.host], ['eth0', s.network.ip], ['example.com', s.network.dns['example.com']]]);
  section('已安装软件包', s.packages.map(name => [name, '已安装']));
  section('环境变量', Object.entries(s.env));
  if (displayedDirectory !== browsePath) reveal($('file-list'), 4);
  if (displayedPreview !== previewPath && previewPath) reveal($('file-preview'), 4);
  displayedDirectory = browsePath; displayedPreview = previewPath;
  $('world-changes').replaceChildren();
  const names={created:'新增',moved:'移动',removed:'移除',updated:'内容更新',permission:'权限',owner:'所有者',directory:'当前位置',service:'服务更新',package:'软件包更新',env:'变量更新',process:'进程结束'};
  for (const event of latestChanges.slice(0,4)) {
    const label=event.path ? event.path.replace(HOME,'~') : event.name;
    const text = event.kind === 'permission' || event.kind === 'owner' ? `${label} · ${event.from} → ${event.to}` : event.kind === 'moved' ? `${event.from.replace(HOME,'~')} → ${label}` : `${names[event.kind]} · ${label}`;
    $('world-changes').append(element('span',text,'world-change '+event.kind));
  }
  $('world-changes').hidden = !latestChanges.length;
  if (animateChanges && latestChanges.some(event=>event.kind === 'directory')) reveal($('file-location'),3);
}
function setWorldTab(system) {
  const changed = $('files-view').hidden !== system;
  $('files-view').hidden = system; $('system-view').hidden = !system;
  $('files-tab').setAttribute('aria-pressed', String(!system)); $('system-tab').setAttribute('aria-pressed', String(system));
  if (changed) reveal($(system ? 'system-view' : 'files-view'));
}

function startTask(id, restore = false, showGuide = true) {
  goalExpansion.clear();
  guideLesson=undefined; hintVisible=false;
  latestChanges=[]; $('pipeline-flow').hidden=true;
  solutionCache = undefined; $('solution-review').open = false;
  practiceHistory.clear(); updatePracticeActions();
  currentId = id; lesson = lessons.find(item => item.id === id);
  const restoring = restore && validSession(saved.session) && (saved.session.exercise?.kind || null) === (training?.kind || null) && (!training || saved.session.exercise?.variant === training.variant);
  restore = restoring;
  attempt = restore && validAttempt(saved.session.attempt) ? { ...saved.session.attempt } : { maxHint:0, errors:0, graded:false };
  shell = makeExercise(); exerciseInitialState = structuredClone(shell.state); transcript = []; hint = 0; lastResult = { stdout: '', code: 1 };
  if (restore && validSession(saved.session)) {
    try { shell = new Shell(saved.session.state, manuals); transcript = Array.isArray(saved.session.transcript) ? saved.session.transcript.slice(-60) : []; hint = Math.min(3, Math.max(0, Number(saved.session.hint) || 0)); attempt.maxHint = Math.max(attempt.maxHint, hint); }
    catch { shell = makeExercise(); transcript = []; }
    if (saved.session.flowVersion !== 2) {
      restoreFlowAssets(shell.state,exerciseInitialState,lesson);
    }
    hintVisible = hint > 0 && saved.session.hintVisible !== false;
  }
  goalChecks = evaluate(lesson.goals, shell.state);
  if (restore && validSession(saved.session)) goalChecks.forEach((goal, index) => { if (goal.type === 'output' && saved.session.outputs?.[index] && (!goal.requiresPath || shell.state.fs[resolve(goal.requiresPath)])) goal.done = true; });
  if (restore && validSession(saved.session) && validHistory(saved.session.undoRedo)) {
    practiceHistory.past = structuredClone(saved.session.undoRedo.past); practiceHistory.future = structuredClone(saved.session.undoRedo.future);
    if (saved.session.flowVersion !== 2) for (const snapshot of [...practiceHistory.past,...practiceHistory.future]) restoreFlowSnapshot(snapshot,exerciseInitialState,lesson);
  }
  updatePracticeActions();
  browsePath = shell.state.cwd; previewPath = undefined; changes = new Set(); $('command-input').value = '';
  focusGoalDirectory();
  setWorldTab(['system', 'network', 'services'].includes(lesson.chapter));
  renderTask(); renderChapters(); renderTranscript(); renderWorld(); persist();
  reveal($('mission-window'));
  if (!restore) $('world-area').scrollTop = 0;
  if (showGuide && onboardingReady && (!restore || !transcript.some(item=>item.command))) { showTaskGuide(); showLessonIntro(); }
}
function focusGoalDirectory() {
  const goal = lesson.goals.find(goal => goal.path && ['file','dir','absent','mode','owner','link','archive'].includes(goal.type));
  if (!goal) return;
  let directory = resolve('..', resolve(goal.path));
  while (directory !== '/' && shell.state.fs[directory]?.type !== 'dir') directory = resolve('..', directory);
  browsePath = directory;
}

function updatePracticeActions() {
  $('undo-button').disabled = !practiceHistory.past.length;
  $('redo-button').disabled = !practiceHistory.future.length;
}
function practiceSnapshot() {
  return { state: shell.state, transcript, hint, hintVisible, goalChecks, lastResult, browsePath, previewPath, changes: [...changes] };
}
function restorePractice(snapshot) {
  shell = new Shell(snapshot.state, manuals);
  ({ transcript, hint, goalChecks, lastResult, browsePath, previewPath } = snapshot);
  hintVisible = hint > 0 && snapshot.hintVisible !== false;
  changes = new Set(snapshot.changes);
}
function practiceAction(action) {
  latestChanges=[]; $('pipeline-flow').hidden=true;
  if (action === 'reset') {
    practiceHistory.record(practiceSnapshot());
    shell = mode === 'learn' ? makeExercise() : new Shell(seedState(), manuals);
    if (attempt.graded) attempt = { maxHint:0, errors:0, graded:false };
    transcript = []; hint = 0; hintVisible=false; lastResult = { stdout: '', code: 1 }; changes = new Set();
    goalChecks = mode === 'learn' ? evaluate(lesson.goals, shell.state) : [];
    browsePath = shell.state.cwd; previewPath = undefined;
    if (mode === 'learn') focusGoalDirectory();
    announce('已重置');
  } else {
    const snapshot = practiceHistory[action](practiceSnapshot());
    if (!snapshot) { announce(action === 'undo' ? '没有可撤销的操作' : '没有可重做的操作'); return; }
    restorePractice(snapshot); announce(action === 'undo' ? '已撤销' : '已重做');
  }
  $('exit-code').textContent = ''; $('command-input').value = ''; draft = '';
  renderTask(); renderTranscript(); renderWorld(); updatePracticeActions(); persist();
}
function executeCommand(command) {
  let celebrate = false; let unlockedBoss; let achievedGoals = [];
  if (['reset', 'undo', 'redo'].includes(command)) { practiceAction(command); return; }
  practiceHistory.record(practiceSnapshot());
  const beforeState=structuredClone(shell.state), path = shell.state.cwd;
  const oldFiles = beforeState.fs; lastResult = shell.execute(command);
  latestChanges=describeChanges(beforeState,shell.state,lastResult.commands);
  changes = new Set(Object.keys(shell.state.fs).filter(key => JSON.stringify(oldFiles[key]) !== JSON.stringify(shell.state.fs[key])));
  if (path !== shell.state.cwd) browsePath = shell.state.cwd;
  else if (changes.size) {
    const effect=latestChanges.find(event=>event.path && shell.state.fs[event.path]?.type !== 'dir' && shell.state.fs[event.path]) || latestChanges.findLast(event=>event.path && shell.state.fs[event.path]);
    if (effect) browsePath=resolve('..',effect.path); else if (mode === 'learn') focusGoalDirectory();
  }
  if (lastResult.clear) { transcript = []; $('transcript').replaceChildren(); }
  const entry = { path, command, stdout: lastResult.stdout, stderr: lastResult.stderr };
  transcript.push(entry); transcript = transcript.slice(-60); appendTranscript(entry);
  $('exit-code').textContent = `退出码 ${lastResult.code}`;
  $('exit-code').classList.toggle('failed', !!lastResult.code);
  if (mode === 'learn') {
    if (!attempt.graded && lastResult.commands?.some(name => ['man','help'].includes(name))) attempt.maxHint = Math.max(1, attempt.maxHint);
    const previous = goalChecks; const wasDone = previous.length > 0 && previous.every(goal => goal.done); goalChecks = evaluate(lesson.goals, shell.state, lastResult);
    goalChecks.forEach((goal, index) => { if (goal.type === 'output' && previous[index]?.done) goal.done = true; });
    achievedGoals = goalChecks.flatMap((goal,index) => goal.done && !previous[index]?.done ? [index] : []);
    if (goalChecks.every(goal => goal.done)) {
      const unlockedBefore = new Set(bosses.filter(item => bossUnlocked(item, completed)).map(item => item.id));
      const isBoss = training?.challengeVersion === 1;
      if (isBoss) bossCompleted.add(training.boss);
      else completed.add(currentId);
      const newBoss = bosses.find(item => !unlockedBefore.has(item.id) && bossUnlocked(item, completed));
      if (!wasDone && !attempt.graded) { if (!isBoss) recordPractice(learning, currentId, attempt, training?.kind || 'lesson'); attempt.graded = true; }
      renderChapters();
      announce(isBoss ? `击败「${lesson.title}」！` : `完成「${lesson.title}」！已完成 ${completed.size} / ${lessons.length} 关。`);
      if (!wasDone) { celebrate = true; unlockedBoss = newBoss; }
    } else {
      if (!attempt.graded && (lastResult.code || (!training?.challengeVersion && lastResult.commands.some(name => name === lesson.command || !basicCommands.has(name))))) attempt.errors++;
    }
  }
  renderTask();
  for (const index of achievedGoals) reveal($('goals').children[index].querySelector('.goal-check'), 0);
  updatePrompt(); renderWorld(true); updatePracticeActions(); persist();
  const stages=pipelineStages(command,beforeState,manuals);
  $('pipeline-flow').hidden=!stages.length; $('pipeline-flow').open=false; $('pipeline-stages').replaceChildren();
  if (stages.length) {
    $('pipeline-summary').textContent=stages.map(stage=>stage.name).join(' → ');
    for (const stage of stages) {
      const block=element('section'); block.append(element('code',stage.command),element('pre',stage.stdout.slice(0,500) || '（无输出）')); $('pipeline-stages').append(block);
    }
  }
  if (celebrate) showCompletion(unlockedBoss);
}
$('practice-area').addEventListener('click', event => {
  if (event.target.closest('button, a, input, select, textarea, summary, [role=separator]')) return;
  const selection = window.getSelection();
  if (selection && !selection.isCollapsed && $('practice-area').contains(selection.anchorNode)) return;
  $('command-input').focus({ preventScroll: true });
});
$('command-form').addEventListener('submit', event => { event.preventDefault(); const command = $('command-input').value.trim(); if (!command) return; executeCommand(command); $('command-input').value = ''; draft = ''; if (!document.querySelector('dialog:modal')) $('command-input').focus(); });
$('command-input').addEventListener('keydown', event => {
  if (event.isComposing) return;
  if (event.ctrlKey && event.key.toLowerCase() === 'l') { event.preventDefault(); transcript = []; renderTranscript(); persist(); return; }
  if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
    event.preventDefault(); if (historyCursor === shell.state.history.length) draft = event.target.value;
    historyCursor = Math.max(0, Math.min(shell.state.history.length, historyCursor + (event.key === 'ArrowUp' ? -1 : 1)));
    event.target.value = shell.state.history[historyCursor] ?? draft; return;
  }
  if (event.key === 'Tab' && !event.shiftKey) {
    event.preventDefault(); const values = shell.complete(event.target.value);
    if (values.length === 1) event.target.value = event.target.value.replace(/[^\s]*$/, values[0].replace(/\s/g, '\\ ') + (values[0].endsWith('/') ? '' : ' '));
    else if (values.length) { appendTranscript({ message: values.join('   ') }); }
    else announce('没有匹配的补全项。');
  }
});
function updateHint(direction = 0) {
  if (direction || !hint) hint = Math.max(1,Math.min(3,hint+(direction || 1)));
  hintVisible = !!direction || !hintVisible;
  attempt.maxHint = Math.max(attempt.maxHint,hint);
  renderTask(); persist();
}
$('hint-button').addEventListener('click',()=>updateHint());
for (const [id,direction] of [['hint-previous',-1],['hint-next',1]]) $(id).addEventListener('click',()=> {
  updateHint(direction);
  if ($(id).disabled) $(direction === 1 ? 'hint-previous' : 'hint-next').focus({preventScroll:true});
});
for (const action of ['reset', 'undo', 'redo']) {
  $(action + '-button').addEventListener('click', () => { practiceAction(action); $('command-input').focus({ preventScroll: true }); });
}
$('next-button').addEventListener('click', advanceLesson);
document.addEventListener('keydown', event => {
  if (event.isComposing || event.key !== 'Enter' || !(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey) return;
  event.preventDefault();
  if (!event.repeat && $('completion-dialog').open) { $('completion-next').click(); return; }
  if (event.repeat || mode !== 'learn' || document.querySelector('dialog:modal') || $('next-lesson').disabled) return;
  $('next-lesson').click();
});
for (const [id, offset] of [['previous-lesson', -1], ['next-lesson', 1]]) {
  $(id).addEventListener('click', () => {
    if (mode !== 'learn') return;
    if (training) { if (offset === 1 && goalChecks.every(goal => goal.done)) advanceLesson(); return; }
    const sequence = navigationLessons(); const target = sequence[sequence.findIndex(item => item.id === currentId) + offset];
    if (target) location.hash = taskRoute(target.id);
  });
}
for (const link of document.querySelectorAll('a[href="./commands/"]')) link.addEventListener('click', () => { if (mode === 'learn' && !attempt.graded) { attempt.maxHint = Math.max(1, attempt.maxHint); persist(); } });
$('review-button').addEventListener('click', () => { if (mode !== 'review') location.hash = 'review'; });
$('review-start').addEventListener('click', () => beginTraining('review', reviewQueue(lessons, completed, learning)));
for (const chapter of chapters) { const option = element('option', chapter.title); option.value = chapter.id; $('transfer-topic').append(option); }
function renderTransfer(choose = true) {
  if (choose) $('transfer-topic').value = lesson.chapter;
  const chapter = $('transfer-topic').value; const lab = terminalLabs[chapter];
  $('transfer-setup').textContent = 'LAB_DIR=$(mktemp -d)\ncd "$LAB_DIR"\n' + lab.setup;
  $('transfer-goal').textContent = lab.goal; $('transfer-check').textContent = lab.check;
  $('transfer-difference').textContent = lab.difference; $('transfer-solution').textContent = lab.solution;
  $('transfer-done').checked = !!transfer[chapter]?.done;
  $('transfer-status').textContent = transfer[chapter]?.done ? '已保存自评，不计入沙盒掌握判定' : '';
  $('transfer-solution').parentElement.open = false;
}
$('transfer-topic').addEventListener('change', () => renderTransfer(false));
$('transfer-done').addEventListener('change', () => { transfer[$('transfer-topic').value] = { done:$('transfer-done').checked, at:Date.now() }; persist(); renderTransfer(false); });
$('transfer-button').addEventListener('click', () => { if (mode === 'learn' && !attempt.graded) { attempt.maxHint = Math.max(1, attempt.maxHint); persist(); } renderTransfer(); $('transfer-dialog').showModal(); });
$('transfer-close').addEventListener('click', () => $('transfer-dialog').close());
$('course-search').addEventListener('input', renderChapters);
$('files-tab').addEventListener('click', () => setWorldTab(false));
$('system-tab').addEventListener('click', () => setWorldTab(true));
$('file-up').addEventListener('click', () => { browsePath = resolve('..', browsePath); previewPath = undefined; renderWorld(); });
$('preview-close').addEventListener('click', () => { previewPath = undefined; renderWorld(); });

function navigate(hash, initial = false, {showGuide = true} = {}) {
  if ($('lesson-intro-dialog').open) $('lesson-intro-dialog').close();
  latestChanges=[]; $('pipeline-flow').hidden=true;
  if ($('completion-dialog').open) $('completion-dialog').close();
  if ($('levels-dialog').open) $('levels-dialog').close();
  if ($('restart-dialog').open) $('restart-dialog').close();
  if ($('help-dialog').open) $('help-dialog').close();
  if ($('transfer-dialog').open) $('transfer-dialog').close();
  const [view, id] = hash.replace(/^#/, '').split('/'); const previousMode = mode;
  if (view === 'manual') {
    if (shell) persist();
    location.replace('./commands/' + (supportedNames.has(id) ? encodeURIComponent(id) + '/' : ''));
    return;
  }
  if (previousMode === 'sandbox' && shell) sandboxSession = { state: shell.state, transcript, undoRedo: { past: practiceHistory.past, future: practiceHistory.future } };
  if (previousMode === 'learn' && shell) {
    persist();
  }
  if (['review','quiz'].includes(view) && ids.has(id) && completed.has(id)) {
    if ((!training || training.kind !== view || training.queue[training.index] !== id) && saved.session?.exercise?.kind === view && validExercise(saved.session.exercise, ids) && saved.session.exercise.queue[saved.session.exercise.index] === id) training = structuredClone(saved.session.exercise);
    if (!training || training.kind !== view || training.queue[training.index] !== id) training = { kind:view, queue:[id], index:0, variant:Date.now() % 997 + 1 };
  } else training = null;
  starterMode = view === 'starter' && starterRoute.includes(id);
  if (starterMode) selectedLevel = 'starter';
  else if (selectedLevel === 'starter' && mode === 'learn') selectedLevel = lesson.level;
  mode = view === 'review' && !id ? 'review' : view === 'sandbox' ? 'sandbox' : 'learn';
  const overview = mode === 'review';
  $('workspace').classList.toggle('review-mode', overview);
  $('review-area').hidden = !overview;
  $('save-status').hidden = overview;
  $('task-goal-button').hidden = mode !== 'learn';
  setGuideVisible(guideVisible);
  for (const id of ['world-area','practice-area','terminal-resize']) $(id).hidden = overview;
  for (const id of ['reset-button','undo-button','redo-button','lesson-navigation']) $(id).hidden = overview;
  if (overview) { renderLearning(); $('review-area').focus({preventScroll:true}); }
  $('levels-button').hidden = mode !== 'learn';
  for (const link of document.querySelectorAll('[data-mode]')) { if (link.dataset.mode === mode) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current'); }
  if (mode === 'learn') startTask(ids.has(id) ? id : currentId, initial || id === currentId, showGuide);
  else if (mode === 'sandbox') {
    practiceHistory.clear(); updatePracticeActions();
    shell = sandboxSession ? new Shell(sandboxSession.state, manuals) : new Shell(seedState(), manuals);
    transcript = sandboxSession?.transcript || []; browsePath = shell.state.cwd; previewPath = undefined; changes = new Set();
    if (sandboxSession && validHistory(sandboxSession.undoRedo)) { practiceHistory.past = structuredClone(sandboxSession.undoRedo.past); practiceHistory.future = structuredClone(sandboxSession.undoRedo.future); }
    if (!sandboxSession && validSnapshot(saved.sandbox?.snapshot) && validHistory(saved.sandbox.undoRedo)) {
      restorePractice(structuredClone(saved.sandbox.snapshot)); practiceHistory.past = structuredClone(saved.sandbox.undoRedo.past); practiceHistory.future = structuredClone(saved.sandbox.undoRedo.future);
    }
    updatePracticeActions();
    $('command-input').value = ''; setWorldTab(false); renderTask(); renderChapters(); renderTranscript(); renderWorld();
  }
  $('exit-code').textContent = '';
  const expected = mode === 'learn' ? (training?.kind || (starterMode ? 'starter' : 'task')) + '/' + currentId : mode === 'review' ? 'review' : 'sandbox';
  if (location.hash !== '#' + expected) history.replaceState(null, '', '#' + expected);
  try { localStorage.setItem('learn-linux-last-route', expected); } catch {}
}
window.addEventListener('hashchange', () => navigate(location.hash));

function exportBackup() {
  if (mode === 'review' && !saved.session) {
    const source = lessons.find(item => item.id === currentId);
    const initial = createLessonShell(Shell, seedState, source);
    saved.session = { revision:2, lesson:currentId, state:initial.state, transcript:[], hint:0, exercise:null, attempt:{maxHint:0, errors:0, graded:false}, outputs:source.goals.map(() => false), undoRedo:{past:[],future:[]} };
  }
  persist();
  const data = { ...saved, version: 2, format: 'learn-linux-backup', mode:mode === 'review' ? 'learn' : mode, exportedAt: new Date().toISOString() };
  const url = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }));
  const link = element('a'); link.href = url; link.download = 'learn-linux-backup.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  $('backup-status').textContent = '备份已导出'; announce('练习备份已导出。');
}
async function importBackup(event) {
  const file = event.target.files[0]; if (!file) return;
  try {
    if (file.size > 30000000) throw new Error('文件超过 30 MB');
    const data = validateBackup(JSON.parse(await file.text()), ids, supportedNames);
    if (data.version === 1) {
      for (const id of data.completed) completed.add(id);
      for (const name of data.favorites) favorites.add(name);
      persist(); renderChapters();
    } else {
      completed.clear(); for (const id of data.completed) completed.add(id);
      favorites.clear(); for (const name of data.favorites) favorites.add(name);
      // Retire the current workspace before routing so navigate cannot overwrite the imported data.
      shell = undefined; sandboxSession = undefined; training = null; learning = data.learning || {}; transfer = data.transfer || {}; bossCompleted = new Set(data.bossCompleted || []); saved = data; currentId = data.current;
      lesson = lessons.find(item => item.id === currentId); selectedLevel = lesson.level;
      navigate(data.mode === 'sandbox' ? 'sandbox' : (data.session?.exercise?.kind || (data.courseRoute === 'starter' && starterRoute.includes(currentId) ? 'starter' : 'task')) + '/' + currentId, true);
      persist(); renderChapters();
    }
    $('backup-status').textContent = data.version === 1 ? '旧版进度已合并' : '练习备份已恢复'; announce($('backup-status').textContent);
  } catch (error) { $('backup-status').textContent = '导入失败：' + error.message; announce($('backup-status').textContent); }
  event.target.value = '';
}
$('export-backup').addEventListener('click', exportBackup);
$('import-backup').addEventListener('change', importBackup);
$('restart-practice').addEventListener('click', () => { $('restart-status').textContent = ''; $('restart-dialog').showModal(); });
for (const id of ['restart-cancel', 'restart-close']) $(id).addEventListener('click', () => $('restart-dialog').close());
$('restart-export').addEventListener('click', () => { exportBackup(); $('restart-status').textContent = '备份已导出'; });
$('restart-confirm').addEventListener('click', () => {
  try { localStorage.removeItem(KEY); }
  catch { $('restart-status').textContent = '无法清除本地记录，请检查浏览器存储权限。'; return; }
  completed.clear(); favorites.clear(); learning = {}; transfer = {}; bossCompleted.clear(); training = null; practiceHistory.clear(); saved = {}; sandboxSession = undefined; shell = undefined;
  currentId = lessons[0].id; lesson = lessons[0]; selectedLevel = lesson.level;
  transcript = []; hint = 0; draft = ''; historyCursor = 0; previewPath = undefined; changes = new Set();
  expandedDirectories.clear(); for (const path of ['/', '/home', HOME]) expandedDirectories.add(path);
  $('course-search').value = '';
  $('backup-status').textContent = '';
  navigate('task/' + currentId); announce('练习记录已清空，从第一关重新开始。');
  $('command-input').focus({ preventScroll: true });
});
$('help-button').addEventListener('click', () => $('help-dialog').showModal());
$('help-close').addEventListener('click', () => $('help-dialog').close());
$('help-dialog').addEventListener('click', event => {
  if (event.target !== $('help-dialog')) return;
  const bounds = $('help-dialog').getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) $('help-dialog').close();
});
$('levels-button').addEventListener('click', () => { selectedLevel = starterMode ? 'starter' : lesson.level; renderChapters(); $('levels-dialog').showModal(); });
$('levels-close').addEventListener('click', () => $('levels-dialog').close());
$('levels-dialog').addEventListener('click', event => { if (event.target === $('levels-dialog')) { const bounds = $('levels-dialog').getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) $('levels-dialog').close(); } });

const terminalResize = $('terminal-resize');
const workspace = $('workspace');
let terminalDrag;
function terminalBounds() {
  const style = getComputedStyle(workspace);
  const available = workspace.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
  const sidebar = $('mission-window').hidden || window.matchMedia('(max-width:900px)').matches ? 0 : $('mission-window').getBoundingClientRect().width;
  const gap = parseFloat(style.columnGap) || 0;
  const max = Math.min(available / 2, available - sidebar - gap * (sidebar ? 4 : 2) - (sidebar ? 16 : 8) - 230);
  return { available, min: Math.min(240, max), max };
}
function updateTerminalResize() {
  if (guideLayoutMotion || mode === 'review' || window.matchMedia('(max-width:780px)').matches) return;
  const { available, min, max } = terminalBounds();
  const width = $('practice-area').getBoundingClientRect().width;
  if (width > max) workspace.style.setProperty('--terminal-width', max + 'px');
  terminalResize.setAttribute('aria-valuemin', String(Math.round(min / available * 100)));
  terminalResize.setAttribute('aria-valuenow', String(Math.min(50, Math.round(width / available * 100))));
  terminalResize.setAttribute('aria-valuetext', `${Math.round(Math.min(width, max))} 像素`);
}
function resizeTerminal(width) {
  const { min, max } = terminalBounds();
  workspace.style.setProperty('--terminal-width', Math.max(min, Math.min(max, width)) + 'px');
  updateTerminalResize();
}
terminalResize.addEventListener('pointerdown', event => {
  if (event.button !== 0) return;
  cancelGuideLayout();
  event.preventDefault();
  terminalResize.focus();
  terminalDrag = { pointerId: event.pointerId, x: event.clientX, width: $('practice-area').getBoundingClientRect().width };
  terminalResize.setPointerCapture(event.pointerId);
  document.body.classList.add('terminal-resizing');
});
terminalResize.addEventListener('pointermove', event => {
  if (terminalDrag?.pointerId === event.pointerId) resizeTerminal(terminalDrag.width + terminalDrag.x - event.clientX);
});
const endTerminalDrag = () => { terminalDrag = undefined; document.body.classList.remove('terminal-resizing'); };
terminalResize.addEventListener('pointerup', endTerminalDrag);
terminalResize.addEventListener('pointercancel', endTerminalDrag);
terminalResize.addEventListener('lostpointercapture', endTerminalDrag);
terminalResize.addEventListener('keydown', event => {
  cancelGuideLayout();
  const { min, max } = terminalBounds();
  const width = $('practice-area').getBoundingClientRect().width;
  const target = { ArrowLeft: width + 24, ArrowRight: width - 24, Home: min, End: max }[event.key];
  if (target === undefined) return;
  event.preventDefault(); resizeTerminal(target);
});
window.addEventListener('resize',cancelGuideLayout);
terminalResize.addEventListener('dblclick', () => { cancelGuideLayout(); workspace.style.removeProperty('--terminal-width'); updateTerminalResize(); });
new ResizeObserver(updateTerminalResize).observe(workspace);
new ResizeObserver(updateTerminalResize).observe($('mission-window'));
function wireFileResize(id, axis, measure, bounds, apply, reset, direction = 1) {
  const handle = $(id); let drag;
  const className = axis === 'x' ? 'directory-resizing' : 'files-resizing';
  const update = () => {
    if (!handle.getClientRects().length) return;
    const { min, max } = bounds();
    const size = Math.max(min, Math.min(max, measure()));
    handle.setAttribute('aria-valuemin', String(Math.round(min)));
    handle.setAttribute('aria-valuemax', String(Math.round(max)));
    handle.setAttribute('aria-valuenow', String(Math.round(size)));
    handle.setAttribute('aria-valuetext', `${Math.round(size)} 像素`);
  };
  const resize = value => { const { min, max } = bounds(); apply(Math.max(min, Math.min(max, value))); update(); };
  handle.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    event.preventDefault(); handle.focus({ preventScroll: true });
    drag = { id: event.pointerId, start: axis === 'x' ? event.clientX : event.clientY, size: measure() };
    handle.setPointerCapture(event.pointerId); handle.classList.add('dragging'); document.body.classList.add(className);
  });
  handle.addEventListener('pointermove', event => {
    if (drag?.id === event.pointerId) resize(drag.size + direction * ((axis === 'x' ? event.clientX : event.clientY) - drag.start));
  });
  const end = () => { drag = undefined; handle.classList.remove('dragging'); document.body.classList.remove(className); };
  for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) handle.addEventListener(event, end);
  handle.addEventListener('keydown', event => {
    const { min, max } = bounds(); const size = measure();
    const value = { Home: min, End: max, [axis === 'x' ? 'ArrowLeft' : 'ArrowUp']: size - 24 * direction, [axis === 'x' ? 'ArrowRight' : 'ArrowDown']: size + 24 * direction }[event.key];
    if (value !== undefined) { event.preventDefault(); resize(value); }
  });
  handle.addEventListener('dblclick', () => { reset(); update(); });
  new ResizeObserver(update).observe($('files-view'));
}
const guideResize = $('guide-resize');
for (const event of ['pointerdown','keydown','dblclick']) guideResize.addEventListener(event, cancelGuideLayout);
const guideWidth = () => $('mission-window').getBoundingClientRect().width;
function resizeGuide(size) {
  const terminalWidth = $('practice-area').getBoundingClientRect().width;
  const difference = size - guideWidth();
  workspace.style.setProperty('--guide-width', size + 'px');
  resizeTerminal(terminalWidth - difference);
}
wireFileResize('guide-resize', 'x', guideWidth,
  () => ({ min:260, max:Math.max(260, Math.min(terminalBounds().available / 2, guideWidth() + $('practice-area').getBoundingClientRect().width - 240)) }),
  resizeGuide,
  () => resizeGuide(window.matchMedia('(max-width:1100px)').matches ? 300 : 350), -1);
wireFileResize('directory-resize', 'x', () => $('file-tree').getBoundingClientRect().width,
  () => ({ min: 90, max: Math.max(90, $('files-view').clientWidth / 2) }),
  size => $('files-view').style.setProperty('--directory-width', size + 'px'),
  () => $('files-view').style.removeProperty('--directory-width'));
wireFileResize('files-resize', 'y', () => $('files-view').getBoundingClientRect().height,
  () => ({ min: 220, max: Math.max(260, window.innerHeight - 180) }),
  size => { $('files-view').style.setProperty('--files-height', size + 'px'); $('files-view').classList.add('user-sized'); },
  () => { $('files-view').style.removeProperty('--files-height'); $('files-view').classList.remove('user-sized'); });
wireFileResize('preview-resize', 'y', () => $('file-preview').getBoundingClientRect().height,
  () => ({ min: 85, max: Math.max(85, Math.min(600, $('file-preview').parentElement.clientHeight - 55)) }),
  size => { $('file-preview').style.setProperty('--preview-height', size + 'px'); $('file-preview').classList.add('user-sized-preview'); },
  () => { $('file-preview').style.removeProperty('--preview-height'); $('file-preview').classList.remove('user-sized-preview'); }, -1);
navigate(location.hash || (saved.current ? '#' + (saved.courseRoute === 'starter' && starterRoute.includes(currentId) ? 'starter/' : 'task/') + currentId : '#starter/' + starterRoute[0]), true);
updateTerminalResize();

const WELCOME_KEY = 'tommy-cheese-linux-lab-welcome-v1';
$('welcome-start').addEventListener('click', () => {
  $('welcome-dialog').close();
  if (mode === 'sandbox') navigate('task/' + currentId);
  $('command-input').focus();
});
$('welcome-dialog').addEventListener('close', () => {
  try { localStorage.setItem(WELCOME_KEY, 'seen'); } catch { /* Still allow practice when storage is unavailable. */ }
  if (onboardingReady) { showTaskGuide(); showLessonIntro(); }
});
let showWelcome = true;
try { showWelcome = localStorage.getItem(WELCOME_KEY) !== 'seen'; } catch { /* Show the introduction without requiring storage. */ }
onboardingReady = true;
if (showWelcome) $('welcome-dialog').showModal();
else if (mode === 'learn' && !transcript.some(item=>item.command)) { showTaskGuide(); showLessonIntro(); }

// Keep favorites in sync when a standalone reference page changes them.
window.addEventListener('storage', event => {
  if (event.key !== KEY) return;
  try {
    const data = JSON.parse(event.newValue || '{}');
    favorites.clear();
    for (const name of Array.isArray(data.favorites) ? data.favorites : []) if (supportedNames.has(name)) favorites.add(name);
  } catch {}
});
const exampleName = new URLSearchParams(location.search).get('example');
if (mode === 'sandbox' && exampleName) {
  const item = manuals.find(entry => entry.name === exampleName && entry.practice);
  if (item) { $('command-input').value = item.example; $('command-input').focus(); }
  const url = new URL(location.href); url.searchParams.delete('example'); history.replaceState(null, '', url);
}
