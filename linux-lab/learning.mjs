const DAY = 86400000;
const object = value => !!value && typeof value === 'object' && !Array.isArray(value);
export function validLearning(data, ids) {
  return object(data) && Object.entries(data).every(([id, item]) => ids.has(id) && object(item)
    && ['attempts','passes','independent','retrievals','stage','errors','hints','solutions','lastAt','dueAt'].every(key => Number.isSafeInteger(item[key]) && item[key] >= 0)
    && (item.lastPassed === undefined || typeof item.lastPassed === 'boolean') && item.stage <= 5 && Array.isArray(item.days) && item.days.length <= 60 && item.days.every(day => Number.isSafeInteger(day) && day >= 0)
    && ['passed','failed','independent','hinted','solution','retry'].includes(item.lastOutcome));
}
export function recordPractice(records, id, attempt, kind = 'lesson', now = Date.now(), passed = true) {
  const old = records[id] || { attempts:0, passes:0, independent:0, retrievals:0, stage:0, errors:0, hints:0, solutions:0, days:[] };
  const date = new Date(now);
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY);
  const newDay = !old.days.includes(day);
  const stage = passed && newDay ? Math.min(5, old.stage + 1) : passed ? old.stage : 0;
  records[id] = { ...old, attempts: old.attempts + 1, passes:old.passes + Number(passed),
    retrievals:old.retrievals + Number(passed && kind !== 'lesson' && newDay),
    // Keep legacy counters for backup compatibility; hints and retries no longer affect assessment.
    days:passed ? [...new Set([...old.days, day])].slice(-60) : old.days,
    stage, lastPassed:passed, lastOutcome:passed ? 'passed' : 'failed', lastAt:now, dueAt:now + (passed ? [1,1,3,7,14,30][stage] : 1) * DAY };
  return records[id];
}
export function mastery(record) {
  if (!record) return '待复习';
  if (record.lastPassed === false) return '待巩固';
  if (record.days.length >= 2 && record.retrievals >= 1) return '已掌握';
  return '已完成';
}
export function reviewQueue(lessons, completed, records, now = Date.now()) {
  return lessons.filter(item => completed.has(item.id) && (!records[item.id] || records[item.id].dueAt <= now))
    .sort((a,b) => {
      const x = records[a.id], y = records[b.id];
      const priority = item => !item ? 0 : item.lastPassed === false ? 1 : 2;
      return priority(x) - priority(y) || (x?.dueAt || 0) - (y?.dueAt || 0);
    }).slice(0, 5).map(item => item.id);
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
    if (name.includes('.') && source.solution.join(' ').includes(name) && !replacements.some(([from]) => name.includes(from))) replacements.push([name, 'practice-'+suffix+'-'+name]);
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
    && Number.isInteger(attempt.errors) && attempt.errors >= 0 && typeof attempt.graded === 'boolean';
}
export function validExercise(exercise, ids) {
  return exercise === null || object(exercise) && ['review','quiz'].includes(exercise.kind)
    && Number.isSafeInteger(exercise.variant) && exercise.variant > 0 && exercise.variant < 10000000000000
    && Array.isArray(exercise.queue) && exercise.queue.length > 0 && exercise.queue.length <= 5 && exercise.queue.every(id => ids.has(id))
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
