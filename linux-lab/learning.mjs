const DAY = 86400000;
const object = value => !!value && typeof value === 'object' && !Array.isArray(value);
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const dayOf = now => { const date = new Date(now); return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY); };
const validTime = value => Number.isSafeInteger(value) && value >= 0;
const finite = (value, low, high) => Number.isFinite(value) && value >= low && value <= high;
function validMemory(memory) {
  return object(memory) && memory.version === 1 && finite(memory.halfLife, .25, 3650) && finite(memory.difficulty, 1, 10)
    && validTime(memory.lastAt) && validTime(memory.lastSuccessAt) && validTime(memory.dueAt)
    && Array.isArray(memory.history) && memory.history.length <= 120 && memory.history.every(item => object(item)
      && validTime(item.at) && typeof item.passed === 'boolean' && typeof item.delayed === 'boolean'
      && ['lesson','review','quiz'].includes(item.kind) && finite(item.seconds, 0, 1800)
      && (item.elapsedDays === undefined || finite(item.elapsedDays,0,100000000))
      && (item.probability === undefined || item.probability === null || finite(item.probability,0,1)));
}
export function validAnswer(answer) {
  return object(answer) && typeof answer.title === 'string' && answer.title.length <= 500
    && Array.isArray(answer.commands) && answer.commands.length <= 200 && answer.commands.every(command => typeof command === 'string' && command.length <= 4096);
}
export function validLearning(data, ids) {
  return object(data) && Object.entries(data).every(([id, item]) => ids.has(id) && object(item)
    && ['attempts','passes','independent','retrievals','stage','errors','hints','solutions','lastAt','dueAt'].every(key => validTime(item[key]))
    && (item.memory === undefined || validMemory(item.memory) && item.memory.dueAt === item.dueAt)
    && (item.lastAnswer === undefined || validAnswer(item.lastAnswer))
    && (item.lastPassed === undefined || typeof item.lastPassed === 'boolean') && item.stage <= 5 && Array.isArray(item.days) && item.days.length <= 60 && item.days.every(validTime)
    && ['passed','failed','independent','hinted','solution','retry'].includes(item.lastOutcome));
}
// One record describes one objective skill (stable lesson ID), shared by all its task variants.
// Completed lessons remain a separate, permanent progress record.
export function migrateLearning(records) {
  return Object.fromEntries(Object.entries(records).map(([id, record]) => {
    if (record.memory) return [id, record];
    const interval = Math.max(1, (record.dueAt - record.lastAt) / DAY);
    return [id, {...record, memory:{version:1, halfLife:clamp(interval / -Math.log2(.85), .25, 3650), difficulty:5,
      lastAt:record.lastAt, lastSuccessAt:record.lastPassed === false ? 0 : record.lastAt, dueAt:record.dueAt, history:[]}}];
  }));
}
export function recallProbability(record, now = Date.now()) {
  const memory = record?.memory;
  return memory ? 2 ** (-Math.max(0, now-memory.lastAt) / DAY / memory.halfLife) : 0;
}
export function recordPractice(records, id, attempt, kind = 'lesson', now = Date.now(), passed = true) {
  const old = records[id] || { attempts:0, passes:0, independent:0, retrievals:0, stage:0, errors:0, hints:0, solutions:0, days:[] };
  const previous = old.memory || (records[id] ? migrateLearning({[id]:old})[id].memory : null);
  const day = dayOf(now), newDay = !old.days.includes(day);
  const delayed = !!previous && newDay && now-previous.lastAt >= 20*3600000;
  let halfLife = previous?.halfLife || 4, difficulty = previous?.difficulty || 5;
  let anchor = previous?.lastAt ?? now, dueAt = previous?.dueAt ?? now+DAY;
  if (!passed) {
    halfLife = clamp(halfLife * .5, .25, 3650); difficulty = clamp(difficulty + .8, 1, 10);
    anchor = now; dueAt = now + DAY;
  } else if (delayed) {
    const p = recallProbability({memory:previous}, now);
    // Conservative product defaults, not fitted Linux memory parameters or an SSP optimum.
    halfLife = clamp(halfLife * (1 + clamp((1-p) * (4-difficulty*.2), .25, 2.5)), .25, 3650);
    difficulty = clamp(difficulty - .15, 1, 10);
    anchor = now; dueAt = now + Math.round(clamp(-halfLife*Math.log2(.85), 1, 60)*DAY);
  }
  const event = {at:now, passed, delayed, kind, elapsedDays:previous ? Math.max(0,now-previous.lastAt)/DAY : 0,
    probability:previous ? recallProbability({memory:previous},now) : null, seconds:clamp(Math.round(attempt?.activeSeconds || 0),0,1800)};
  records[id] = {...old, attempts:old.attempts+1, passes:old.passes+Number(passed),
    retrievals:old.retrievals+Number(passed && kind !== 'lesson' && delayed),
    days:passed ? [...new Set([...old.days,day])].slice(-60) : old.days,
    stage:passed && delayed ? Math.min(5,old.stage+1) : passed ? old.stage : 0,
    lastPassed:passed, lastOutcome:passed ? 'passed' : 'failed', lastAt:now, dueAt,
    memory:{version:1,halfLife,difficulty,lastAt:anchor,lastSuccessAt:passed ? now : previous?.lastSuccessAt || 0,dueAt,
      history:[...(previous?.history || []),event].slice(-120)}};
  return records[id];
}
export function mastery(record, now = Date.now()) {
  if (!record) return '待复习';
  if (record.lastPassed === false) return '待巩固';
  if (record.dueAt <= now) return '待复习';
  return record.retrievals >= 2 && record.memory?.halfLife >= 14 ? '保持良好' : '已完成';
}
export function reviewPlan(lessons, completed, records, now = Date.now()) {
  const pool = lessons.filter(item => completed.has(item.id) && (!records[item.id] || records[item.id].dueAt <= now))
    .sort((a,b) => recallProbability(records[a.id],now) - recallProbability(records[b.id],now)
      || (records[a.id]?.dueAt || 0) - (records[b.id]?.dueAt || 0));
  const due = pool.map(item=>item.id), queue = [], chapters = new Set();
  while (pool.length) {
    let index = pool.findIndex(item=>!chapters.has(item.chapter));
    if (index < 0) { chapters.clear(); index = 0; }
    const [item] = pool.splice(index,1);
    queue.push(item.id); chapters.add(item.chapter);
  }
  return {due,queue};
}
export function reviewQueue(lessons, completed, records, now = Date.now()) {
  return reviewPlan(lessons,completed,records,now).queue;
}
export function quizQueue(lessons, completed, chapter, random = Math.random) {
  const pool = lessons.filter(item => item.chapter === chapter && completed.has(item.id));
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [pool[i],pool[j]] = [pool[j],pool[i]]; }
  return pool.slice(0,3).map(item => item.id);
}
// Rename paths in both the seeded shell and the task, so old solutions cannot simply be pasted.
export function varyExercise(source, state, variant) {
  const suffix = String(variant);
  const pid = 400 + variant;
  const replacements = [['314',String(pid)],['projects','workspace-'+suffix],['downloads','inbox-'+suffix],['logs','records-'+suffix],['data','datasets-'+suffix],['README','GUIDE-'+suffix],['notes','memo-'+suffix],['deploy.sh','launch-'+suffix+'.sh']];
  // Also change task-specific file names, including destinations not yet present.
  const paths = source.goals.flatMap(goal => [goal.path, goal.target]).filter(Boolean);
  for (const path of new Set(paths)) {
    const name = path.split('/').pop();
    if (name.includes('.') && !/\.0+\d+$/.test(name) && source.solution.join(' ').includes(name) && !replacements.some(([from]) => name.includes(from))) replacements.push([name, 'practice-'+suffix+'-'+name]);
  }
  const replace = text => replacements.reduce((value,[from,to]) => value.split(from).join(to), text);
  const transform = value => typeof value === 'string' ? replace(value) : Array.isArray(value) ? value.map(transform)
    : object(value) ? Object.fromEntries(Object.entries(value).map(([key,item]) => [replace(key), transform(item)])) : value === 314 ? pid : value;
  const exercise = transform(source);
  exercise.id = source.id; exercise.title = source.title; exercise.command = source.command; exercise.commands = source.commands;
  if (source.command === 'cp') {
    // A backup must retain its source: moving a file is not a successful copy.
    for (const line of exercise.solution) {
      const args = line.trim().split(/\s+/).filter(word => !word.startsWith('-'));
      if (args[0] !== 'cp') continue;
      for (const name of args.slice(1,-1)) {
        const path = name.startsWith('/') ? name : state.cwd + '/' + name;
        const node = transform(state).fs[path];
        if (node?.type === 'file') exercise.goals.push({type:'file', path, text:node.text, label:'原文件仍保留：' + name});
        if (node?.type === 'dir') exercise.goals.push({type:'dir', path, label:'原目录仍保留：' + name});
      }
    }
  }
  return { lesson:exercise, state:transform(state) };
}
export function validAttempt(attempt) {
  return object(attempt) && Number.isInteger(attempt.maxHint) && attempt.maxHint >= 0 && attempt.maxHint <= 3
    && (attempt.relearning === undefined || typeof attempt.relearning === 'boolean')
    && (attempt.activeSeconds === undefined || finite(attempt.activeSeconds,0,1800))
    && Number.isInteger(attempt.errors) && attempt.errors >= 0 && typeof attempt.graded === 'boolean';
}
export function validExercise(exercise, ids) {
  return exercise === null || object(exercise) && ['review','quiz'].includes(exercise.kind)
    && Number.isSafeInteger(exercise.variant) && exercise.variant > 0 && exercise.variant < 10000000000000
    && Array.isArray(exercise.queue) && exercise.queue.length > 0 && exercise.queue.length <= (exercise.kind === 'review' ? ids.size : 12) && exercise.queue.every(id => ids.has(id)) && new Set(exercise.queue).size === exercise.queue.length
    && (exercise.reviewVersion === undefined || [1,2].includes(exercise.reviewVersion) && exercise.kind === 'review')
    && (exercise.reviewVersion !== 2 || object(exercise.rounds) && Object.keys(exercise.rounds).length === exercise.queue.length
      && exercise.queue.every(id=>Object.hasOwn(exercise.rounds,id) && Number.isSafeInteger(exercise.rounds[id]) && exercise.rounds[id]>=0))
    && (exercise.spentSeconds === undefined || finite(exercise.spentSeconds,0,21600))
    && (exercise.budget === undefined || [180,300,600].includes(exercise.budget))
    && (exercise.results === undefined || Array.isArray(exercise.results) && exercise.results.length <= exercise.queue.length && new Set(exercise.results.map(item=>item?.id)).size === exercise.results.length && exercise.results.every(item=>object(item) && exercise.queue.includes(item.id) && ['passed','relearn','skipped'].includes(item.outcome)))
    && (exercise.boss === undefined || validBossId(exercise.boss))
    && (exercise.challengeVersion === undefined || exercise.challengeVersion === 1 && exercise.kind === 'quiz' && validBossId(exercise.boss) && exercise.queue.length === 1)
    && Number.isInteger(exercise.index) && exercise.index >= 0 && exercise.index < exercise.queue.length;
}

// Complete the entire topic before its integrated Boss challenge.
export function bossChallenges(course) {
  const groups = new Map();
  for (const item of course) {
    const id = item.level + '/' + item.chapter;
    if (!groups.has(id)) groups.set(id, {id, level:item.level, chapter:item.chapter, lessons:[], prerequisites:[]});
    groups.get(id).lessons.push(item.id);
  }
  return [...groups.values()].map(item => ({...item, prerequisites:[...item.lessons]}));
}
export function bossUnlocked(boss, completed) {
  return boss.prerequisites.length > 0 && boss.prerequisites.every(id => completed.has(id));
}
export function validBossId(id) {
  return typeof id === 'string' && /^(common|advanced|master)\/(navigation|files|text|shell|permissions|archives|system|network|services|missions)$/.test(id);
}
