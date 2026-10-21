import { Shell, seedState, resolve, tokenize, evaluate } from './shell.mjs?v=20261020-judging-1';
import { createLessonShell, manuals } from './curriculum.mjs?v=20261022-sleep-focus-1';

// A route through existing lessons, with the same goals and completion records.
export const starterPhases = [
  {id:'orientation',number:'01',title:'建立方向感',description:'先观察，再核对；认识路径与手册。',lessons:['where-am-i','look-around','enter-projects','parent-directory','read-welcome','lookup-copy']},
  {id:'workspace',number:'02',title:'整理与交付',description:'搭建目录、保留原件，在文件任务中复用导航。',lessons:['create-workspace','new-readme','copy-note','hidden-profile','rename-note','cleanup-temp']},
  {id:'information',number:'03',title:'保存与筛选',description:'先掌握输出保存，再从日志中提取信息。',lessons:['write-note','append-note','preview-log','latest-error','filter-errors','count-lines']},
  {id:'transfer',number:'04',title:'组合与迁移',description:'穿插文本、权限、归档和系统任务，选择合适的工具。',lessons:['numeric-sort','unique-names','csv-column','make-executable','create-archive','process-list']}
];
export const starterRoute = starterPhases.flatMap(phase=>phase.lessons);
export const starterPhase = id => starterPhases.find(phase=>phase.lessons.includes(id));
const typeNames = { file:'文件', dir:'目录', link:'符号链接' };
const text = value => value === '' ? '（空）' : String(value ?? '（未设置）');
const lineCount = value => value ? value.replace(/\n$/, '').split('\n').length : 0;

export function goalDifference(goal, state, result) {
  if (goal.done) return null;
  const path = goal.path && resolve(goal.path);
  const node = state.fs[path];
  let expected, actual, summary;
  const missing = () => ({ summary:'还缺 ' + goal.path, expected:typeNames[goal.type] || '目标文件或目录', actual:'不存在' });
  switch (goal.type) {
    case 'file':
      if (!node) return missing();
      if (node.type !== 'file') return { summary:goal.path + ' 应为文件', expected:'文件', actual:typeNames[node.type] };
      expected = goal.text ?? ('包含：' + goal.includes); actual = node.text;
      summary = goal.path + (goal.text === undefined ? ' 缺少指定内容' : ' 内容不匹配');
      break;
    case 'output':
      expected = goal.exact ?? ('包含：' + goal.includes); actual = result.stdout || '';
      summary = result.code !== (goal.code ?? 0) ? `目标退出码 ${goal.code ?? 0}，当前 ${result.code}` : goal.exact !== undefined && lineCount(goal.exact) !== lineCount(actual.trim()) ? `目标 ${lineCount(goal.exact)} 行，实际 ${lineCount(actual.trim())} 行` : '终端输出不匹配';
      break;
    case 'cwd': expected = path; actual = state.cwd; summary = '当前目录还未到达目标'; break;
    case 'dir': return node ? { summary:goal.path + ' 应为目录', expected:'目录', actual:typeNames[node.type] } : missing();
    case 'absent': expected = '不存在'; actual = typeNames[node?.type] || '仍存在'; summary = goal.path + ' 尚未移除'; break;
    case 'mode': case 'owner':
      if (!node) return missing();
      expected = goal.value; actual = node[goal.type]; summary = `目标${goal.type === 'mode' ? '权限' : '所有者'} ${expected}，当前 ${actual}`; break;
    case 'link':
      if (!node) return missing();
      expected = resolve(goal.target); actual = node.type === 'link' ? resolve(node.target, resolve('..', path)) : typeNames[node.type]; summary = '链接目标不匹配'; break;
    case 'archive': {
      const entries = state.archives[path];
      if (!entries) return {summary:goal.path + ' 尚未创建归档', expected:(goal.entries || []).join('\n'), actual:'不存在'};
      const absent = (goal.entries || []).filter(name => !(name in entries));
      const extra = goal.exact ? Object.keys(entries).filter(name => !(goal.entries || []).includes(name)) : [];
      const changed = Object.entries(goal.contents || {}).filter(([name, content]) => entries[name]?.text !== content).map(([name]) => name);
      summary = absent.length ? '归档还缺：' + absent.join('、') : extra.length ? '归档多出：' + extra.join('、') : '归档内容不匹配：' + changed.join('、');
      expected = changed.length && !absent.length && !extra.length ? changed.map(name => name + ':\n' + goal.contents[name]).join('\n') : (goal.entries || Object.keys(goal.contents || {})).join('\n');
      actual = changed.length && !absent.length && !extra.length ? changed.map(name => name + ':\n' + text(entries[name]?.text)).join('\n') : Object.keys(entries).join('\n'); break;
    }
    case 'env': expected = goal.value; actual = state.env[goal.name]; summary = '环境变量 ' + goal.name + ' 不匹配'; break;
    case 'setting': expected = goal.value; actual = state[goal.name]; summary = goal.name + ' 尚未设置为 ' + expected; break;
    case 'service': expected = goal.value ? '是' : '否'; actual = state.services[goal.name]?.[goal.property] ? '是' : '否'; summary = goal.name + (goal.property === 'active' ? ' 运行状态' : ' 开机启动状态') + '不匹配'; break;
    case 'package': expected = goal.present === false ? '未安装' : '已安装'; actual = state.packages.includes(goal.name) ? '已安装' : '未安装'; summary = goal.name + ' 安装状态不匹配'; break;
    case 'processAbsent': case 'processPresent': expected = goal.type === 'processPresent' ? '运行中' : '未运行'; actual = state.processes.some(item => item.name === goal.name) ? '运行中' : '未运行'; summary = goal.name + ' 进程状态不匹配'; break;
    case 'clear': expected = '终端已清空'; actual = '未清空'; summary = '终端尚未清空'; break;
    default: return null;
  }
  return {summary, expected:text(expected), actual:text(actual)};
}

const operators = { '|':'将前一条命令的标准输出送给下一条命令', '>':'将标准输出写入文件，覆盖原内容', '>>':'将标准输出追加到文件末尾', '<':'从文件读取标准输入', ';':'依次执行命令', '&&':'前一条成功后才执行下一条', '||':'前一条失败后才执行下一条' };
const valueOptions = { head:'n', tail:'n', grep:'e', cut:'df', sort:'k', curl:'o', wget:'O', tar:'fC', find:'' };
const quote = value => "'" + value.replace(/'/g, "'\\''") + "'";
function optionHelp(command, value) {
  const options = manuals.find(item => item.name === command)?.options || [];
  const direct = options.find(([flags]) => flags.split(/\s+\/\s+|,\s*/).some(flag => flag.split(/\s/)[0] === value));
  if (direct) return direct[1];
  if (/^-[^-]/.test(value)) {
    const descriptions = [];
    for (const flag of value.slice(1)) {
      const found = options.find(([flags]) => flags.split(/\s+\/\s+|,\s*/).some(item => item.split(/\s/)[0] === '-' + flag));
      if (!found) return '参数；详见该命令手册';
      descriptions.push(found[1]);
      if ((valueOptions[command] || '').includes(flag)) break;
    }
    return descriptions.join('；');
  }
  return '参数；详见该命令手册';
}
export function explainCommand(input, state) {
  let tokens;
  try { tokens = tokenize(input, state.env); } catch { return []; }
  let command = '', start = true, redirect = false, optionValue = false, operands = 0, endOptions = false, explicitPattern = false;
  return tokens.map(token => {
    const part = {token:token.raw ?? token.value, description:''};
    if (token.operator) {
      part.description = operators[token.value]; redirect = ['>','>>','<'].includes(token.value);
      if (!redirect) { start = true; operands = 0; endOptions = false; optionValue = false; explicitPattern = false; }
    } else if (redirect) { part.description = '重定向的文件路径'; redirect = false; }
    else if (start) {
      command = token.value; start = command === 'sudo';
      part.description = manuals.find(item => item.name === command)?.summary || '命令'; part.command = command;
    } else if (optionValue) { part.description = '前一个参数的值'; optionValue = false; }
    else if (!endOptions && token.value === '--') { part.description = '结束参数选项，后面按普通参数处理'; endOptions = true; }
    else if (!endOptions && /^-[^-]|^--./.test(token.value)) {
      part.description = optionHelp(command, token.value);
      if (command === 'grep' && /^-[^-]*e/.test(token.value)) explicitPattern = true;
      const valueIndex = [...token.value.slice(1)].findIndex(flag => (valueOptions[command] || '').includes(flag));
      optionValue = !token.value.startsWith('--') && valueIndex >= 0 && valueIndex === token.value.length - 2;
    } else {
      operands++;
      part.description = command === 'grep' && operands === 1 && !explicitPattern ? '要匹配的文本模式' : command === 'chmod' && operands === 1 ? '目标权限或权限变更' : ['echo','printf'].includes(command) ? '输出文本或格式参数' : ['cp','mv'].includes(command) ? '源或目标路径（最后一个是目标）' : command === 'cd' ? '要进入的目录' : ['cat','head','tail','ls','touch','mkdir','rm','rmdir','sort','uniq','wc','less','more','tree','grep'].includes(command) ? '文件或目录路径' : '位置参数；用法见命令手册';
    }
    if (token.raw?.includes('$') && token.raw !== token.value) part.description += '；展开为 ' + token.value;
    return part;
  });
}

function candidates(lesson, initial) {
  const source = lesson.solution.join('\n'); const result = [{command:source, note:'参考解法'}];
  const paths = new Set(Object.keys(initial.fs).concat(lesson.goals.map(goal => goal.path && resolve(goal.path)).filter(Boolean)));
  const absolute = lesson.solution.map(line => tokenize(line, initial.env).map(token => token.operator ? token.value : paths.has(resolve(token.value, initial.cwd)) && !token.value.startsWith('/') ? quote(resolve(token.value, initial.cwd)) : token.raw).join(' ')).join('\n');
  result.push({command:absolute, note:'使用绝对路径，不依赖当前目录'});
  for (const from of ['cat','less','more']) if (source.startsWith(from + ' ')) for (const to of ['cat','less','more'].filter(name => name !== from)) result.push({command:source.replace(new RegExp('^' + from + ' '), to + ' '), note:'在教学沙盒中读取同一文件；真实 less / more 会进入分页'});
  if (source === 'pwd') result.push({command:'realpath .', note:'解析当前目录的完整路径'});
  if (source === 'ls') result.push({command:'ls .', note:'明确指定当前目录'});
  if (/^ls -a\b/.test(source)) result.push({command:source.replace(/^ls -a\b/, 'ls --all'), note:'使用长参数显示隐藏文件'});
  if (/^grep /.test(source)) {
    const tokens = tokenize(source, initial.env); const pattern = tokens.findIndex((token, index) => index > 0 && !token.operator && !token.value.startsWith('-'));
    if (pattern > 0 && !tokens.some(token => token.value === '-e')) result.push({command:tokens.map((token,index) => (index === pattern ? '-e ' : '') + (token.raw ?? token.value)).join(' '), note:'用 -e 明确指定匹配模式'});
    const redirection = tokens.findIndex(token => token.value === '>');
    if (redirection > 0) result.push({command:tokens.slice(0,redirection).map(token => token.raw ?? token.value).join(' ') + ' | tee ' + tokens[redirection+1].raw, note:'tee 同时显示结果并保存到文件'});
  }
  const mode = lesson.goals.find(goal => goal.type === 'mode');
  if (mode && lesson.command === 'chmod') result.push({command:'chmod ' + mode.value + ' ' + quote(mode.path), note:'使用数字明确设置最终权限'});
  return result;
}
export function alternativeSolutions(lesson, initialState, localizeContent = value => value) {
  const initial = initialState || createLessonShell(Shell, seedState, lesson).state;
  const seen = new Set(); const accepted = [];
  for (const candidate of candidates(lesson, initial)) {
    if (seen.has(candidate.command)) continue; seen.add(candidate.command);
    const shell = new Shell(initial, manuals, localizeContent); const outputs = new Set(); let result;
    for (const line of candidate.command.split('\n')) {
      result = shell.execute(line);
      evaluate(lesson.goals, shell.state, result).forEach((goal, index) => { if (goal.type === 'output' && goal.done) outputs.add(index); });
      if (result.code && result.code !== 1 && !lesson.goals.some(goal=>goal.type === 'output' && goal.code === result.code)) break;
    }
    if (evaluate(lesson.goals, shell.state, result).every((goal,index) => goal.done || goal.type === 'output' && outputs.has(index))) accepted.push(candidate);
    if (accepted.length === 3) break;
  }
  return accepted;
}
