import { validLearning, validExercise, validAttempt, validBossId } from './learning.mjs';
const object = value => !!value && typeof value === 'object' && !Array.isArray(value);
const text = value => typeof value === 'string' && value.length <= 100000;
export function validState(state) {
  if (!object(state) || !object(state.fs) || !text(state.cwd) || state.fs[state.cwd]?.type !== 'dir' || state.fs['/home/learner']?.type !== 'dir') return false;
  if (Object.keys(state.fs).length > 5000) return false;
  if (!Object.entries(state.fs).every(([path,node]) => path.startsWith('/') && text(path) && object(node) && ['file','dir','link'].includes(node.type) && /^[0-7]{3}$/.test(node.mode) && text(node.owner) && (node.type !== 'file' || text(node.text)) && (node.type !== 'link' || text(node.target)))) return false;
  return object(state.env) && Object.values(state.env).every(text) && Array.isArray(state.history) && state.history.length <= 200 && state.history.every(text)
    && Array.isArray(state.processes) && state.processes.every(item => object(item) && Number.isInteger(item.pid) && text(item.name))
    && object(state.services) && Object.values(state.services).every(item => object(item) && typeof item.active === 'boolean' && typeof item.enabled === 'boolean')
    && Array.isArray(state.packages) && state.packages.every(text) && object(state.archives) && object(state.network) && text(state.network.host) && text(state.network.ip) && object(state.network.dns) && object(state.network.urls);
}
const validTranscript = value => Array.isArray(value) && value.length <= 60 && value.every(item => object(item) && ['path','command','stdout','stderr','message'].every(key => item[key] === undefined || text(item[key])) && (!item.command || text(item.path)));
export function validSnapshot(snapshot) {
  return object(snapshot) && validState(snapshot.state) && validTranscript(snapshot.transcript)
    && Number.isInteger(snapshot.hint) && snapshot.hint >= 0 && snapshot.hint <= 3 && Array.isArray(snapshot.goalChecks)
    && snapshot.goalChecks.every(goal => object(goal) && typeof goal.type === 'string' && text(goal.label) && (goal.path === undefined || text(goal.path)) && typeof goal.done === 'boolean')
    && object(snapshot.lastResult) && Number.isInteger(snapshot.lastResult.code) && text(snapshot.browsePath) && (snapshot.previewPath === undefined || text(snapshot.previewPath))
    && Array.isArray(snapshot.changes) && snapshot.changes.every(text);
}
export function validHistory(history) {
  return object(history) && ['past','future'].every(key => Array.isArray(history[key]) && history[key].length <= 40 && history[key].every(validSnapshot));
}
export function validateBackup(data, ids, names) {
  if (!object(data) || ![1,2].includes(data.version) || !Array.isArray(data.completed) || !Array.isArray(data.favorites)) throw new Error('备份格式不匹配');
  if (data.courseRoute !== undefined && !['starter','full'].includes(data.courseRoute)) throw new Error('学习路线无效');
  if (data.bossCompleted !== undefined && (!Array.isArray(data.bossCompleted) || data.bossCompleted.length > 30 || !data.bossCompleted.every(validBossId))) throw new Error('Boss 挑战记录无效');
  if (data.learning !== undefined && !validLearning(data.learning, ids)) throw new Error('掌握记录无效');
  if (data.transfer !== undefined && (!object(data.transfer) || Object.keys(data.transfer).length > 10 || !Object.values(data.transfer).every(item => object(item) && typeof item.done === 'boolean' && Number.isSafeInteger(item.at) && item.at >= 0))) throw new Error('本地练习记录无效');
  if (data.version === 2) {
    if (data.session?.flowVersion !== undefined && data.session.flowVersion !== 1) throw new Error('关卡版本不支持');
    if (data.session?.exercise !== undefined && (!validExercise(data.session.exercise, ids) || data.session.exercise && data.session.exercise.queue[data.session.exercise.index] !== data.session.lesson)) throw new Error('复习或小测数据无效');
    if (data.session?.attempt !== undefined && !validAttempt(data.session.attempt)) throw new Error('本次训练记录无效');
    if (data.format !== 'learn-linux-backup' || !ids.has(data.current) || !['learn','sandbox','manual'].includes(data.mode)) throw new Error('备份信息不完整');
    if (data.session && (!ids.has(data.session.lesson) || data.session.revision !== 2 || !validState(data.session.state) || !validTranscript(data.session.transcript) || !Number.isInteger(data.session.hint) || data.session.hint < 0 || data.session.hint > 3 || !Array.isArray(data.session.outputs) || !data.session.outputs.every(value => typeof value === 'boolean') || !validHistory(data.session.undoRedo))) throw new Error('关卡数据无效');
    if (data.sandbox && (!validSnapshot(data.sandbox.snapshot) || !validHistory(data.sandbox.undoRedo))) throw new Error('自由练习数据无效');
    if (data.mode === 'learn' && !data.session || data.mode === 'sandbox' && !data.sandbox) throw new Error('缺少当前练习数据');
  }
  return { ...data, completed: data.completed.filter(id => ids.has(id)), favorites: data.favorites.filter(name => names.has(name)) };
}
