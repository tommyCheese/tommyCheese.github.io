import { runExtra } from './extra-commands.mjs';
// A deterministic teaching shell. No host commands, eval, fetch or external I/O.
export const HOME = '/home/learner';
export const basicCommands = new Set(['pwd', 'ls', 'cd', 'tree', 'cat', 'less', 'more', 'head', 'tail', 'file', 'stat', 'realpath', 'readlink', 'which', 'type', 'env', 'printenv', 'history', 'man', 'help', 'clear']);
const clone = value => JSON.parse(JSON.stringify(value));
const fail = message => { throw new Error(message); };
const lines = text => text ? text.replace(/\n$/, '').split('\n') : [];
const outLines = values => values.length ? values.join('\n') + '\n' : '';
const basename = path => path.split('/').pop();
const parent = path => path.slice(0, path.lastIndexOf('/')) || '/';
const globRE = value => new RegExp('^' + value.replace(/[.+^${}()|\\]/g, '\\$&').replace(/\*/g, '[^/]*').replace(/\?/g, '[^/]') + '$');

export function resolve(path = '.', cwd = HOME) {
  if (path === '~' || path.startsWith('~/')) path = HOME + path.slice(1);
  const parts = (path.startsWith('/') ? path : cwd + '/' + path).split('/');
  const result = [];
  for (const part of parts) {
    if (part === '..') result.pop();
    else if (part && part !== '.') result.push(part);
  }
  return '/' + result.join('/');
}

export function seedState(extra = {}) {
  const state = {
    cwd: HOME, previous: HOME, env: { HOME, PWD: HOME, USER: 'learner', SHELL: '/bin/bash', PATH: '/usr/local/bin:/usr/bin:/bin' },
    fs: { '/': { type: 'dir', mode: '755', owner: 'root' } },
    processes: [{ pid: 1, name: 'systemd' }, { pid: 42, name: 'bash' }, { pid: 314, name: 'worker' }],
    services: { nginx: { active: false, enabled: false } }, packages: ['bash', 'coreutils'], archives: {}, history: [],
    umask: '022', date: '2026-10-11',
    network: { host: 'lab', ip: '192.0.2.10', dns: { 'example.com': '192.0.2.20' },
      urls: { 'https://example.com/health': 'ok\n', 'https://example.com/config.json': '{"port":8080}\n' } }
  };
  function dir(path) {
    if (state.fs[path]) return;
    if (path !== '/') dir(parent(path));
    state.fs[path] = { type: 'dir', mode: '755', owner: 'learner' };
  }
  for (const path of [HOME, HOME + '/projects', HOME + '/downloads', HOME + '/logs', HOME + '/data', '/tmp', '/etc', '/var/log', '/srv']) dir(path);
  const defaults = {
    'README.txt': '欢迎来到 Linux 命令实验室。\n先理解目标，再选择命令。\n',
    '.profile': 'export EDITOR=vim\n', 'projects/notes.txt': 'draft\n',
    'logs/app.log': 'INFO server started\nERROR timeout\nINFO request complete\nERROR disk full\n',
    'data/users.csv': 'name,role\nalice,developer\nbob,admin\ncarol,developer\n',
    'data/numbers.txt': '30\n2\n10\n2\n', 'data/names.txt': 'bob\nalice\nbob\ncarol\n',
    'downloads/old.tmp': 'temporary\n', 'deploy.sh': '#!/bin/sh\necho deploy\n',
    '/etc/app.conf': 'PORT=3000\nDEBUG=true\n', '/var/log/nginx.log': 'INFO nginx ready\nERROR upstream timeout\n'
  };
  for (const [path, text] of Object.entries({ ...defaults, ...(extra.files || {}) })) {
    const full = resolve(path); dir(parent(full));
    state.fs[full] = { type: 'file', text, mode: '644', owner: full.startsWith('/etc/') ? 'root' : 'learner' };
  }
  for (const path of extra.dirs || []) dir(resolve(path));
  for (const [key, value] of Object.entries(extra)) if (!['files', 'dirs'].includes(key)) state[key] = clone(value);
  state.env.PWD = state.cwd;
  return state;
}

// Operators are tokens, so quoted pipes/redirection remain ordinary file/text data.
export function tokenize(input, env = {}) {
  if (input.length > 4096) fail('命令过长（上限 4096 字符）。');
  const tokens = []; let value = ''; let active = false; let quote = ''; let quoted = false; let start = 0;
  const flush = end => { if (active) tokens.push({ value, raw: input.slice(start, end), quoted, operator: false }); value = ''; active = false; quoted = false; };
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (!active) start = i;
    if (char === "'" || char === '"') {
      if (!quote) { quote = char; active = true; quoted = true; continue; }
      if (quote === char) { quote = ''; continue; }
    }
    if (char === '\\' && quote !== "'") {
      if (quote === '"' && !['$', '`', '"', '\\', '\n'].includes(input[i + 1])) { value += char; active = true; continue; }
      if (++i >= input.length) fail('反斜杠后缺少字符。'); value += input[i]; active = true; quoted = true; continue;
    }
    if ((char === '`' || (char === '$' && input[i + 1] === '(')) && quote !== "'") fail('沙盒暂不支持命令替换，请分步执行。');
    if (char === '$' && quote !== "'") {
      const match = input.slice(i).match(/^\$(?:\{([A-Za-z_]\w*)\}|([A-Za-z_]\w*))/);
      if (match) { value += env[match[1] || match[2]] || ''; i += match[0].length - 1; active = true; continue; }
    }
    if (!quote && /\s/.test(char)) { flush(i); continue; }
    if (!quote && char === '#' && !active) break;
    if (!quote && '|&;><'.includes(char)) {
      flush(i); let operator = char;
      if (input[i + 1] === char && '|&>'.includes(char)) operator += input[++i];
      if (operator === '&') fail('沙盒暂不支持后台任务（&）。');
      tokens.push({ value: operator, operator: true }); continue;
    }
    value += char; active = true;
  }
  if (quote) fail('引号未闭合。'); flush(input.length); return tokens;
}

function parseOptions(args, short = '', valued = '', long = {}) {
  const options = {}; const operands = []; let end = false;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--') { end = true; continue; }
    if (!end && arg.startsWith('--')) {
      const [name, inline] = arg.slice(2).split(/=(.*)/s);
      if (!(name in long)) fail('沙盒暂不支持参数 --' + name + '，可用参数请查阅手册。');
      const key = long[name];
      options[key] = valued.includes(key) ? (inline ?? args[++i] ?? fail('参数缺少值：' + arg)) : true;
    } else if (!end && /^-[^-]/.test(arg)) {
      for (let j = 1; j < arg.length; j++) {
        const key = arg[j];
        if (!short.includes(key) && !valued.includes(key)) fail('沙盒暂不支持参数 -' + key + '，可用参数请查阅手册。');
        if (valued.includes(key)) { options[key] = arg.slice(j + 1) || args[++i] || fail('参数缺少值：-' + key); break; }
        options[key] = true;
      }
    } else operands.push(arg);
  }
  return { options, operands };
}

export class Shell {
  constructor(state = seedState(), manuals = []) { this.state = clone(state); this.manuals = manuals; }
  path(value) { return resolve(value, this.state.cwd); }
  node(value, follow = true, seen = new Set()) {
    const path = this.path(value); const node = this.state.fs[path];
    if (!node) fail(value + '：没有这个文件或目录');
    if (node.type === 'link' && follow) {
      if (seen.has(path) || seen.size > 20) fail('符号链接循环');
      seen.add(path); return this.node(resolve(node.target, parent(path)), true, seen);
    }
    return node;
  }
  read(value) { const node = this.node(value); if (node.type !== 'file') fail(value + '：不是普通文件'); return node.text; }
  write(value, text, append = false) {
    if (text.length > 100000) fail('练习文件超过大小限制。');
    let path = this.path(value); const old = this.state.fs[path];
    if (old?.type === 'link') path = resolve(old.target, parent(path));
    if (this.node(parent(path)).type !== 'dir') fail('父路径不是目录');
    if (this.state.fs[path]?.type === 'dir') fail('不能向目录写入文本');
    this.state.fs[path] = { type: 'file', mode: old?.mode || this.defaultMode('666'), owner: old?.owner || 'learner', text: (append ? this.state.fs[path]?.text || '' : '') + text };
  }
  defaultMode(mode) { return (parseInt(mode, 8) & ~parseInt(this.state.umask, 8)).toString(8).padStart(3, '0'); }
  paths(value = '.') { const base = this.path(value); return Object.keys(this.state.fs).filter(path => path === base || path.startsWith(base === '/' ? '/' : base + '/')).sort(); }
  children(value = '.') { const path = this.path(value); this.node(path); return Object.keys(this.state.fs).filter(key => key !== path && parent(key) === path).sort(); }
  expand(token) {
    if (token.quoted || !/[*?]/.test(token.value)) return [token.value];
    const pattern = this.path(token.value); const regex = globRE(pattern);
    const matches = Object.keys(this.state.fs).filter(path => regex.test(path) && (basename(pattern).startsWith('.') || !basename(path).startsWith('.'))).sort();
    return matches.length ? matches : [token.value];
  }
  execute(input) {
    const result = { stdout: '', stderr: '', code: 0, commands: [], clear: false };
    try {
      const initial = tokenize(input, this.state.env);
      if (!initial.length) return result;
      const groups = []; let group = []; let connector = ';';
      for (const token of initial) {
        if (token.operator && [';', '&&', '||'].includes(token.value)) {
          if (!group.length) fail('连接符前缺少命令。');
          groups.push({ group, connector }); group = []; connector = token.value;
        } else group.push(token);
      }
      if (!group.length && connector !== ';') fail('连接符后缺少命令。');
      if (group.length) groups.push({ group, connector });
      for (const entry of groups) {
        if (entry.connector === '&&' && result.code !== 0 || entry.connector === '||' && result.code === 0) continue;
        const pipelines = []; let stage = [];
        for (const token of entry.group) {
          if (token.operator && token.value === '|') { if (!stage.length) fail('管道前缺少命令。'); pipelines.push(stage); stage = []; }
          else stage.push(token);
        }
        if (!stage.length) fail('管道后缺少命令。'); pipelines.push(stage);
        let stdin = ''; let code = 0;
        for (let index = 0; index < pipelines.length; index++) {
          const stageTokens = pipelines[index]; const argv = []; let redirect; let inputFile;
          for (let i = 0; i < stageTokens.length; i++) {
            const token = stageTokens[i];
            if (token.operator && ['>', '>>', '<'].includes(token.value)) {
              const target = stageTokens[++i]; if (!target || target.operator) fail('重定向后缺少文件名。');
              const value = tokenize(target.raw, this.state.env)[0]?.value ?? '';
              if (token.value === '<') inputFile = value;
              else redirect = { path: value, append: token.value === '>>' };
            } else if (token.operator) fail('不支持的操作符：' + token.value);
            else argv.push(...this.expand(tokenize(token.raw, this.state.env)[0] || { value: '' }));
          }
          if (!argv.length) fail('缺少命令。');
          // Like a shell, output redirection creates/truncates its target before execution.
          if (redirect) this.write(redirect.path, '', redirect.append);
          let response;
          try { response = this.run(argv, inputFile ? this.read(inputFile) : stdin); }
          catch (error) { response = { stdout: '', stderr: error.message + '\n', code: 1 }; }
          result.commands.push(argv[0] === 'sudo' ? argv[1] : argv[0]);
          result.stderr += response.stderr || ''; code = response.code || 0; stdin = response.stdout || '';
          result.clear ||= response.clear || false;
          if (redirect) { this.write(redirect.path, stdin, true); stdin = ''; }
        }
        result.stdout += stdin; result.code = code;
      }
    } catch (error) { result.stderr += error.message + '\n'; result.code = 1; }
    if (input.trim()) this.state.history.push(input);
    this.state.history = this.state.history.slice(-200);
    return result;
  }
  run(argv, stdin = '') {
    let [command, ...args] = argv; const s = this.state;
    const output = stdout => ({ stdout, code: 0 });
    const textOf = files => files.length ? files.map(file => this.read(file)).join('') : stdin;
    const requireArgs = count => { if (args.length < count) fail(command + '：缺少参数'); };
    if (command === 'sudo') { requireArgs(1); if (args[0].startsWith('-')) fail('本沙盒只支持 sudo 命令 参数。'); return this.run(args, stdin); }
    if (args.includes('--help') || command === 'man' || command === 'help') {
      const name = ['man', 'help'].includes(command) ? args[0] : command;
      if (!name) return output('可用命令：\n' + this.manuals.map(item => item.name).join(' ') + '\n输入 man 命令名 查看中文手册。\n');
      const manual = this.manuals.find(item => item.name === name);
      if (!manual) fail('没有该命令的教学手册：' + name);
      return output(manual.name + ' — ' + manual.summary + '\n用法：' + manual.syntax + '\n' + manual.options.map(item => item.join('  ')).join('\n') + '\n' + manual.note + '\n');
    }
    const extraResult = runExtra(this, command, args, stdin);
    if (extraResult !== undefined) return extraResult;
    switch (command) {
      case 'pwd': if (args.length) fail('pwd 在沙盒中不接受参数'); return output(s.cwd + '\n');
      case 'cd': {
        if (args.length > 1) fail('cd：参数过多'); const path = args[0] === '-' ? s.previous : this.path(args[0] || '~');
        if (this.node(path).type !== 'dir') fail('cd：目标不是目录'); s.previous = s.cwd; s.cwd = path; s.env.PWD = path;
        return output(args[0] === '-' ? path + '\n' : '');
      }
      case 'ls': {
        const { options: o, operands: files } = parseOptions(args, 'alhRd', '', { all: 'a' }); const values = [];
        for (const file of files.length ? files : ['.']) {
          const path = this.path(file); const node = this.node(file, false);
          const entries = node.type !== 'dir' || o.d ? [path] : (o.R ? this.paths(path).slice(1) : this.children(path));
          for (const entry of entries) {
            if (!o.a && basename(entry).startsWith('.')) continue;
            const item = s.fs[entry]; let name = o.R ? entry : basename(entry);
            if (item.type === 'dir') name += '/'; if (item.type === 'link') name += ' -> ' + item.target;
            values.push(o.l ? `${item.type === 'dir' ? 'd' : item.type === 'link' ? 'l' : '-'}${this.modeText(item.mode)} learner ${item.owner} ${item.text?.length || 0} Oct 11 ${name}` : name);
          }
        } return output(outLines(values));
      }
      case 'tree': {
        const { options: o, operands } = parseOptions(args, 'a'); const root = this.path(operands[0] || '.'); this.node(root);
        return output(root + '\n' + outLines(this.paths(root).slice(1).filter(path => o.a || !path.split('/').some(part => part.startsWith('.'))).map(path => '  '.repeat(path.slice(root.length).split('/').length - 2) + '└─ ' + basename(path))));
      }
      case 'mkdir': {
        const { options: o, operands } = parseOptions(args, 'p', 'm'); if (!operands.length) fail('mkdir：缺少目录');
        if (o.m && !/^[0-7]{3}$/.test(o.m)) fail('mkdir：权限请使用三位八进制');
        for (const value of operands) {
          const path = this.path(value); if (s.fs[path] && !o.p) fail(value + '：已经存在');
          const create = path => {
            if (s.fs[path]) { if (s.fs[path].type !== 'dir') fail(path + '：不是目录'); return; }
            if (o.p) create(parent(path)); else this.node(parent(path));
            s.fs[path] = { type: 'dir', mode: o.m || this.defaultMode('777'), owner: 'learner' };
          }; create(path);
        } return output('');
      }
      case 'touch': {
        const { operands } = parseOptions(args); if (!operands.length) fail('touch：缺少文件名');
        for (const file of operands) if (!s.fs[this.path(file)]) this.write(file, ''); return output('');
      }
      case 'cp': case 'mv': {
        const { options: o, operands } = parseOptions(args, command === 'cp' ? 'rRaf' : 'f');
        if (operands.length < 2) fail(command + '：需要源文件和目标路径');
        const destination = this.path(operands.at(-1)); const sources = operands.slice(0, -1);
        if (sources.length > 1 && s.fs[destination]?.type !== 'dir') fail('多个源文件需要目录作为目标');
        for (const source of sources) {
          const from = this.path(source); const item = this.node(from, false);
          const to = s.fs[destination]?.type === 'dir' ? destination + '/' + basename(from) : destination;
          if (from === to || to.startsWith(from + '/')) fail('不能把路径复制或移动到自身内部');
          this.node(parent(to));
          if (item.type === 'dir' && command === 'cp' && !(o.r || o.R || o.a)) fail('cp：复制目录需要 -r');
          if (s.fs[to] && s.fs[to].type !== item.type) fail('目标路径类型不匹配');
          const entries = this.paths(from);
          for (const key of entries) {
            s.fs[to + key.slice(from.length)] = clone(s.fs[key]);
            if (s.archives[key]) s.archives[to + key.slice(from.length)] = clone(s.archives[key]);
          }
          if (command === 'mv') {
            if (s.cwd === from || s.cwd.startsWith(from + '/')) { s.cwd = to + s.cwd.slice(from.length); s.env.PWD = s.cwd; }
            for (const key of entries) { delete s.fs[key]; delete s.archives[key]; }
          }
        } return output('');
      }
      case 'rm': case 'rmdir': {
        const { options: o, operands } = parseOptions(args, command === 'rm' ? 'rfR' : '');
        if (!operands.length) fail(command + '：缺少路径');
        for (const file of operands) {
          const path = this.path(file); if (['/', HOME].includes(path)) fail('教学沙盒保留根目录和主目录。');
          if (!s.fs[path]) { if (o.f) continue; fail(file + '：不存在'); }
          const item = this.node(path, false); const keys = this.paths(path);
          if (command === 'rmdir' && (item.type !== 'dir' || keys.length > 1)) fail('rmdir：需要空目录');
          if (command === 'rm' && item.type === 'dir' && !(o.r || o.R)) fail('rm：删除目录需要 -r');
          for (const key of keys) { delete s.fs[key]; delete s.archives[key]; }
        } return output('');
      }
      case 'cat': case 'less': case 'more': {
        const { options: o, operands } = parseOptions(args, command === 'cat' ? 'n' : '');
        const text = textOf(operands); return output(o.n ? outLines(lines(text).map((line, index) => `${index + 1}\t${line}`)) : text);
      }
      case 'head': case 'tail': {
        const { options: o, operands } = parseOptions(args, command === 'tail' ? 'f' : '', 'n');
        const count = Number(o.n || 10); if (!Number.isInteger(count) || count < 0) fail('行数需要非负整数');
        const values = lines(textOf(operands)); return output(outLines(command === 'head' ? values.slice(0, count) : count ? values.slice(-count) : []));
      }
      case 'echo': {
        let newline = true; let escapes = false;
        while (/^-[neE]+$/.test(args[0] || '')) { const flags = args.shift(); newline &&= !flags.includes('n'); if (flags.includes('e')) escapes = true; if (flags.includes('E')) escapes = false; }
        let text = args.join(' '); if (escapes) text = text.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\\\/g, '\\'); return output(text + (newline ? '\n' : ''));
      }
      case 'printf': {
        requireArgs(1); const format = args.shift().replace(/\\n/g, '\n').replace(/\\t/g, '\t'); let index = 0;
        if (/%[^%sd]/.test(format)) fail('printf 在沙盒中支持 %s、%d 和 %%');
        return output(format.replace(/%%|%[sd]/g, token => token === '%%' ? '%' : token === '%d' ? String(Number(args[index++] || 0)) : args[index++] || ''));
      }
      case 'grep': {
        const { options: o, operands } = parseOptions(args, 'invcrREFl', 'e'); const pattern = o.e ?? operands.shift(); if (pattern === undefined) fail('grep：缺少模式');
        let regex; try { regex = new RegExp(o.F ? pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : pattern, o.i ? 'i' : ''); } catch { fail('grep：无效正则表达式'); }
        let files = operands;
        if (o.r || o.R) files = (files.length ? files : ['.']).flatMap(file => this.paths(file).filter(path => s.fs[path].type === 'file'));
        const groups = files.length ? files.map(file => [file, this.read(file)]) : [['', stdin]]; const found = []; let matched = false;
        for (const [file, text] of groups) {
          const hits = lines(text).map((line, index) => ({ line, index })).filter(({ line }) => o.v ? !regex.test(line) : regex.test(line));
          matched ||= hits.length > 0;
          if (o.l) { if (hits.length) found.push(file); }
          else if (o.c) found.push((groups.length > 1 ? file + ':' : '') + hits.length);
          else for (const hit of hits) found.push((groups.length > 1 ? file + ':' : '') + (o.n ? hit.index + 1 + ':' : '') + hit.line);
        } return { stdout: outLines(found), code: matched ? 0 : 1 };
      }
      case 'find': {
        let start = '.'; if (args[0] && !args[0].startsWith('-')) start = args.shift(); const base = this.path(start); this.node(base);
        const filters = []; let deleteFiles = false;
        while (args.length) {
          const flag = args.shift(); if (flag === '-delete') { deleteFiles = true; continue; } if (flag === '-print') continue;
          if (!['-name', '-type', '-maxdepth'].includes(flag)) fail('find：沙盒支持 -name、-type、-maxdepth、-print、-delete');
          const value = args.shift(); if (value === undefined) fail('find：参数缺少值');
          if (flag === '-name') { const regex = globRE(value); filters.push(path => regex.test(basename(path))); }
          if (flag === '-type') { if (!['f', 'd', 'l'].includes(value)) fail('find：类型使用 f、d 或 l'); filters.push(path => s.fs[path].type === ({ f: 'file', d: 'dir', l: 'link' })[value]); }
          if (flag === '-maxdepth') { if (!/^\d+$/.test(value)) fail('find：层数需要非负整数'); filters.push(path => path === base || path.slice(base.length + 1).split('/').length <= Number(value)); }
        }
        const hits = this.paths(base).filter(path => filters.every(filter => filter(path)));
        if (deleteFiles) {
          for (const path of hits.reverse()) { if (['/', HOME].includes(path) || this.children(path).length) fail('find：不能删除保留目录或非空目录'); delete s.fs[path]; }
          return output('');
        }
        return output(outLines(hits.map(path => start.startsWith('/') ? path : start.replace(/\/$/, '') + path.slice(base.length))));
      }
      case 'wc': {
        const { options: o, operands } = parseOptions(args, 'lwc'); const values = [];
        for (const file of operands.length ? operands : ['']) {
          const text = file ? this.read(file) : stdin;
          const counts = [((text.match(/\n/g) || []).length), text.trim() ? text.trim().split(/\s+/).length : 0, new TextEncoder().encode(text).length];
          const chosen = ['l', 'w', 'c'].filter(key => o[key]); const result = (chosen.length ? chosen.map(key => counts['lwc'.indexOf(key)]) : counts).join(' ');
          values.push(result + (file ? ' ' + file : ''));
        } return output(outLines(values));
      }
      case 'sort': {
        const { options: o, operands } = parseOptions(args, 'nru'); let values = lines(textOf(operands));
        values.sort(o.n ? (a, b) => Number(a) - Number(b) : (a, b) => a < b ? -1 : a > b ? 1 : 0);
        if (o.r) values.reverse(); if (o.u) values = [...new Set(values)]; return output(outLines(values));
      }
      case 'uniq': {
        const { options: o, operands } = parseOptions(args, 'cd'); const grouped = [];
        for (const line of lines(textOf(operands))) { if (grouped.at(-1)?.line === line) grouped.at(-1).count++; else grouped.push({ line, count: 1 }); }
        return output(outLines(grouped.filter(item => !o.d || item.count > 1).map(item => (o.c ? item.count + ' ' : '') + item.line)));
      }
      case 'cut': {
        const { options: o, operands } = parseOptions(args, '', 'dfc'); if (!o.f && !o.c) fail('cut：需要 -f 或 -c');
        if (o.d && o.d.length !== 1) fail('cut：分隔符需要一个字符');
        const indexes = [];
        for (const range of (o.f || o.c).split(',')) {
          if (!/^\d+(?:-\d+)?$/.test(range)) fail('cut：沙盒支持字段数字、列表及闭合范围');
          const [first, end = first] = range.split('-').map(Number); if (first < 1 || end < first || end > 10000) fail('cut：字段范围无效');
          for (let index = first; index <= end; index++) indexes.push(index - 1);
        }
        return output(outLines(lines(textOf(operands)).map(line => {
          if (o.f && !line.includes(o.d || '\t')) return line;
          const fields = o.c ? [...line] : line.split(o.d || '\t'); return indexes.filter(index => index < fields.length).map(index => fields[index]).join(o.c ? '' : o.d || '\t');
        })));
      }
      case 'tr': {
        const { options: o, operands } = parseOptions(args, 'd'); if (!operands.length || !o.d && operands.length !== 2) fail('tr：需要字符集合');
        const expand = value => value.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/([a-zA-Z0-9])-([a-zA-Z0-9])/g, (_, a, b) => Array.from({ length: Math.max(0, b.charCodeAt(0) - a.charCodeAt(0) + 1) }, (_, i) => String.fromCharCode(a.charCodeAt(0) + i)).join(''));
        const from = expand(operands[0]); const to = expand(operands[1] || '');
        return output([...stdin].map(char => { const index = from.indexOf(char); return index < 0 ? char : o.d ? '' : to[index] || to.at(-1) || char; }).join(''));
      }
      case 'sed': {
        const { options: o, operands } = parseOptions(args, 'in'); const script = operands.shift(); if (!script) fail('sed：缺少表达式');
        const substitution = script.match(/^s(.)(.*?)\1(.*?)\1(g?)$/); const printing = script.match(/^(\d+)(?:,(\d+))?p$/);
        if (!substitution && !printing) fail('sed：教学沙盒支持 s/旧/新/g 和 n[,m]p');
        const transform = text => {
          if (printing) return o.n ? outLines(lines(text).slice(Number(printing[1]) - 1, Number(printing[2] || printing[1]))) : fail('行范围练习请配合 sed -n');
          let regex; try { regex = new RegExp(substitution[2], substitution[4]); } catch { fail('sed：无效正则'); }
          return lines(text).map(line => line.replace(regex, substitution[3])).join('\n') + (text.endsWith('\n') ? '\n' : '');
        };
        if (o.i) { if (!operands.length) fail('sed -i：需要文件'); for (const file of operands) this.write(file, transform(this.read(file))); return output(''); }
        return output(transform(textOf(operands)));
      }
      case 'awk': {
        const { options: o, operands } = parseOptions(args, '', 'F'); const script = operands.shift();
        const match = script?.match(/^\{\s*print\s+\$(\d+)\s*\}$/);
        if (!match) fail('awk：教学沙盒支持 {print $n}，其他脚本请在真实 Linux 中练习');
        return output(outLines(lines(textOf(operands)).map(line => match[1] === '0' ? line : (o.F ? line.split(o.F) : line.trim().split(/\s+/))[Number(match[1]) - 1] || '')));
      }
      case 'tee': {
        const { options: o, operands } = parseOptions(args, 'a'); for (const file of operands) this.write(file, stdin, !!o.a); return output(stdin);
      }
      case 'xargs': {
        if (args[0]?.startsWith('-')) fail('xargs：本沙盒支持默认空白分隔，请勿用于含空格的文件名');
        const values = tokenize(stdin).filter(token => !token.operator).map(token => token.value);
        if (values.length > 500) fail('xargs：参数过多'); return this.run([...(args.length ? args : ['echo']), ...values]);
      }
      case 'chmod': {
        const { options: o, operands } = parseOptions(args, 'R'); const mode = operands.shift(); if (!mode || !operands.length) fail('chmod：需要权限和文件');
        for (const file of operands) for (const path of o.R ? this.paths(file) : [this.path(file)]) {
          const node = this.node(path); if (/^[0-7]{3,4}$/.test(mode)) node.mode = mode.slice(-3);
          else {
            const match = mode.match(/^([ugoa]*)([+=-])([rwx]+)$/); if (!match) fail('chmod：沙盒支持八进制权限或 [ugoa][+-=][rwx]');
            const who = match[1] || 'a'; const bits = [...match[3]].reduce((result, key) => result | ({ r: 4, w: 2, x: 1 })[key], 0);
            node.mode = node.mode.split('').map((digit, index) => { if (!who.includes('a') && !who.includes('ugo'[index])) return digit; const current = Number(digit); return String(match[2] === '+' ? current | bits : match[2] === '-' ? current & ~bits : bits); }).join('');
          }
        } return output('');
      }
      case 'chown': {
        const { options: o, operands } = parseOptions(args, 'R'); const owner = operands.shift(); if (!owner || !operands.length) fail('chown：需要所有者和文件');
        for (const file of operands) for (const path of o.R ? this.paths(file) : [this.path(file)]) this.node(path, false).owner = owner;
        return output('');
      }
      case 'umask': if (!args.length) return output('0' + s.umask + '\n'); if (!/^[0-7]{3}$/.test(args[0])) fail('umask：请使用三位八进制'); s.umask = args[0]; return output('');
      case 'ln': {
        const { options: o, operands } = parseOptions(args, 's'); if (!o.s || operands.length !== 2) fail('ln：本沙盒支持 ln -s 目标 链接');
        const path = this.path(operands[1]); if (s.fs[path]) fail('ln：目标已经存在'); this.node(parent(path));
        s.fs[path] = { type: 'link', target: operands[0], mode: '777', owner: 'learner' }; return output('');
      }
      case 'readlink': {
        const { options: o, operands } = parseOptions(args, 'f'); const node = this.node(operands[0], false); if (node.type !== 'link') fail('readlink：不是符号链接');
        return output((o.f ? resolve(node.target, parent(this.path(operands[0]))) : node.target) + '\n');
      }
      case 'stat': requireArgs(1); return output(args.map(file => { const node = this.node(file, false); return `File: ${file}\nSize: ${node.text?.length || 0}\nAccess: (${node.mode})\nOwner: ${node.owner}\n`; }).join(''));
      case 'file': requireArgs(1); return output(outLines(args.map(file => file + ': ' + ({ dir: 'directory', link: 'symbolic link', file: 'UTF-8 text' })[this.node(file, false).type])));
      case 'basename': requireArgs(1); return output(basename(args[0]).replace(args[1] ? new RegExp(args[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$') : /$^/, '') + '\n');
      case 'dirname': requireArgs(1); return output((args[0].includes('/') ? parent(args[0]) : '.') + '\n');
      case 'diff': {
        requireArgs(2); if (args.some(arg => arg.startsWith('-'))) fail('diff：本沙盒支持 diff 文件1 文件2');
        const a = this.read(args[0]); const b = this.read(args[1]); return { stdout: a === b ? '' : outLines(lines(a).map(line => '< ' + line).concat(lines(b).map(line => '> ' + line))), code: a === b ? 0 : 1 };
      }
      case 'du': { const { operands } = parseOptions(args, 'sh'); const files = operands.length ? operands : ['.']; return output(outLines(files.map(file => this.paths(file).reduce((sum, path) => sum + (s.fs[path].text?.length || 0), 0) + '\t' + file))); }
      case 'df': parseOptions(args, 'h'); return output('Filesystem Size Used Avail Use% Mounted on\n/dev/lab 20G 4G 16G 20% /\n');
      case 'ps': {
        if (args.length && !['aux', '-ef'].includes(args.join(' '))) fail('ps：本沙盒支持 ps、ps aux、ps -ef');
        return output('USER PID COMMAND\n' + outLines(s.processes.map(item => `learner ${item.pid} ${item.name}`)));
      }
      case 'pgrep': case 'pkill': {
        requireArgs(1); const { options: o, operands } = parseOptions(args, 'f'); void o;
        let regex; try { regex = new RegExp(operands[0]); } catch { fail('无效进程模式'); }
        const matched = s.processes.filter(item => regex.test(item.name));
        if (command === 'pkill') s.processes = s.processes.filter(item => !matched.includes(item) || item.pid === 1);
        return { stdout: command === 'pgrep' ? outLines(matched.map(item => String(item.pid))) : '', code: matched.length ? 0 : 1 };
      }
      case 'kill': {
        const signal = args[0]?.startsWith('-') ? args.shift() : '-15'; if (!['-9', '-15', '-TERM', '-KILL'].includes(signal)) fail('kill：沙盒支持 TERM/KILL');
        requireArgs(1); for (const pid of args) { if (Number(pid) === 1) fail('教学沙盒保留 PID 1'); if (!s.processes.some(item => item.pid === Number(pid))) fail('kill：进程不存在'); s.processes = s.processes.filter(item => item.pid !== Number(pid)); } return output('');
      }
      case 'top': if (args.length) fail('top：沙盒不接受参数'); return output('模拟单次进程快照（无实时刷新）\n' + this.run(['ps']).stdout);
      case 'free': parseOptions(args, 'hm'); return output('total used free available\nMem: 4096 1024 3072 3072\nSwap: 1024 0 1024\n');
      case 'uname': { const { options: o } = parseOptions(args, 'ars'); return output(o.a ? 'Linux lab 6.8.0 x86_64 GNU/Linux\n' : o.r ? '6.8.0\n' : 'Linux\n'); }
      case 'whoami': if (args.length) fail('whoami：参数过多'); return output('learner\n');
      case 'id': if (args.length) fail('id：沙盒支持无参数查询'); return output('uid=1000(learner) gid=1000(learner) groups=1000(learner),27(sudo)\n');
      case 'hostname': if (args.length) fail('hostname：沙盒只支持查询'); return output(s.network.host + '\n');
      case 'date': if (args.length && args[0] !== '+%F') fail('date：沙盒支持无参数或 +%F'); return output(args.length ? s.date + '\n' : s.date + ' 09:00:00 UTC\n');
      case 'uptime': if (args.length) fail('uptime：参数过多'); return output('up 2 days, load average: 0.10, 0.08, 0.05\n');
      case 'env': case 'printenv': if (args.some(arg => arg.startsWith('-'))) fail('沙盒不支持此参数'); return output(args.length ? outLines(args.map(key => s.env[key] || '')) : outLines(Object.entries(s.env).map(([key, value]) => key + '=' + value)));
      case 'export': requireArgs(1); for (const arg of args) { const match = arg.match(/^([A-Za-z_]\w*)=(.*)$/s); if (!match) fail('export：用法 export 名称=值'); s.env[match[1]] = match[2]; } return output('');
      case 'unset': requireArgs(1); for (const key of args) delete s.env[key]; return output('');
      case 'history': if (args.length) fail('history：沙盒只支持无参数'); return output(outLines(s.history.map((line, index) => `${index + 1}  ${line}`)));
      case 'clear': return { ...output(''), clear: true };
      case 'true': return output(''); case 'false': return { stdout: '', code: 1 };
      case 'ip': if (!['addr', 'a', 'address', 'route', 'r'].includes(args.join(' '))) fail('ip：沙盒支持 ip addr 或 ip route'); return output(['route', 'r'].includes(args[0]) ? 'default via 192.0.2.1 dev eth0\n' : `2: eth0: <UP>\n    inet ${s.network.ip}/24\n`);
      case 'ss': parseOptions(args, 'tulpna'); return output('Netid State Local Address Process\n' + (s.processes.some(item=>item.name==='worker') ? `tcp LISTEN 0.0.0.0:8080 worker(pid=${s.processes.find(item=>item.name==='worker').pid})\n` : '') + (s.services.nginx.active ? 'tcp LISTEN 0.0.0.0:80 nginx\n' : ''));
      case 'ping': {
        const { options: o, operands } = parseOptions(args, '', 'c'); if (!operands.length) fail('ping：缺少主机'); const ip = s.network.dns[operands[0]] || (operands[0] === s.network.ip ? operands[0] : undefined);
        if (!ip) fail('ping：模拟环境无法解析主机'); const count = Math.min(Number(o.c || 4), 10); if (!Number.isInteger(count) || count < 1) fail('ping：次数需要正整数');
        return output(outLines(Array.from({ length: count }, (_, index) => `64 bytes from ${ip}: icmp_seq=${index + 1} time=0.8 ms`)) + `${count} packets transmitted, ${count} received\n`);
      }
      case 'dig': case 'nslookup': requireArgs(1); if (!s.network.dns[args[0]]) fail('模拟 DNS 中不存在该主机'); return output(`${args[0]}\tA\t${s.network.dns[args[0]]}\n`);
      case 'curl': case 'wget': {
        const { options: o, operands } = parseOptions(args, command === 'curl' ? 'IsSfL' : 'q', command === 'curl' ? 'o' : 'O');
        if (operands.length !== 1) fail(command + '：需要一个教学 URL'); const url = operands[0]; const data = s.network.urls[url];
        if (data === undefined) fail('该 URL 不在模拟环境中；可访问 https://example.com/health 或 /config.json');
        if (o.I) return output('HTTP/1.1 200 OK\ncontent-type: text/plain\n');
        const filename = command === 'curl' ? o.o : o.O || url.split('/').pop();
        if (filename && filename !== '-') { this.write(filename, data); return output(''); } return output(data);
      }
      case 'systemctl': {
        requireArgs(1); const [action, name] = args; if (action === 'list-units') return output(outLines(Object.entries(s.services).map(([name, service]) => `${name}.service ${service.active ? 'active running' : 'inactive dead'}`)));
        const key = name?.replace(/\.service$/, ''); const service = s.services[key]; if (!service) fail('教学服务不存在：' + (name || '缺少服务名'));
        if (action === 'status') return { stdout: `${key}.service\nActive: ${service.active ? 'active (running)' : 'inactive (dead)'}\nEnabled: ${service.enabled}\n`, code: service.active ? 0 : 3 };
        if (action === 'is-active') return { stdout: service.active ? 'active\n' : 'inactive\n', code: service.active ? 0 : 3 };
        if (['start', 'restart', 'stop'].includes(action)) service.active = action !== 'stop';
        else if (['enable', 'disable'].includes(action)) service.enabled = action === 'enable';
        else fail('systemctl：支持 status/start/stop/restart/enable/disable/is-active/list-units');
        return output('');
      }
      case 'journalctl': {
        const { options: o } = parseOptions(args, 'f', 'un'); if (o.u && o.u.replace(/\.service$/, '') !== 'nginx') fail('模拟日志只有 nginx');
        const count = Number(o.n || 10); if (!Number.isInteger(count) || count < 0) fail('journalctl：行数无效');
        const values = lines(this.read('/var/log/nginx.log')); return output(outLines(count ? values.slice(-count) : []));
      }
      case 'apt': {
        const [action, ...packages] = args; if (action === 'update') return output('模拟软件包索引已更新。\n');
        if (action === 'list' && packages.join(' ') === '--installed') return output(outLines(s.packages.map(name => name + '/stable installed')));
        if (!['install', 'remove', 'search'].includes(action) || !packages.length) fail('apt：支持 update/install/remove/search/list --installed');
        const known = ['bash', 'coreutils', 'curl', 'wget', 'nginx', 'tree', 'git', 'vim'];
        if (packages.some(name => !known.includes(name))) fail('该软件包不在教学软件源中');
        if (action === 'search') return output(outLines(packages.map(name => name + ' - teaching package')));
        s.packages = action === 'install' ? [...new Set([...s.packages, ...packages])] : s.packages.filter(name => !packages.includes(name)); return output('模拟软件包状态已更新。\n');
      }
      case 'tar': {
        if (args[0] && !args[0].startsWith('-')) args[0] = '-' + args[0];
        const { options: o, operands } = parseOptions(args, 'cxtzv', 'fC'); if (!o.f || [o.c, o.x, o.t].filter(Boolean).length !== 1) fail('tar：需要 c/x/t 中一种操作和 -f 归档名');
        const path = this.path(o.f); const root = this.path(o.C || '.'); if (this.node(root).type !== 'dir') fail('tar：-C 需要目录');
        if (o.c) {
          if (!operands.length) fail('tar：缺少要归档的文件'); const entries = {};
          for (const operand of operands) for (const key of this.paths(resolve(operand, root))) if (key !== path) entries[key.slice(root.length + 1)] = clone(s.fs[key]);
          this.write(path, '[教学归档：' + Object.keys(entries).length + ' 个条目]\n'); s.archives[path] = entries; return output(o.v ? outLines(Object.keys(entries)) : '');
        }
        const entries = s.archives[path]; if (!entries) fail('tar：不是沙盒创建的教学归档');
        if (o.t) return output(outLines(Object.keys(entries)));
        for (const [name, node] of Object.entries(entries)) { const full = resolve(name, root); if (!full.startsWith(root + '/')) fail('tar：非法归档路径'); this.ensureDir(parent(full)); s.fs[full] = clone(node); } return output(o.v ? outLines(Object.keys(entries)) : '');
      }
      case 'gzip': case 'gunzip': {
        const { options: o, operands } = parseOptions(args, 'k'); if (!operands.length) fail('压缩命令缺少文件');
        for (const file of operands) {
          const path = this.path(file);
          if (command === 'gzip') { const text = this.read(path); this.write(path + '.gz', '[教学 gzip]\n'); s.archives[path + '.gz'] = { text }; if (!o.k) delete s.fs[path]; }
          else { const entry = s.archives[path]; if (!path.endsWith('.gz') || typeof entry?.text !== 'string') fail('gunzip：不是教学 gzip 文件'); this.write(path.slice(0, -3), entry.text); if (!o.k) { delete s.fs[path]; delete s.archives[path]; } }
        } return output('');
      }
      default: fail(command + '：未实现此命令。输入 help 查看支持范围，或打开参考手册。');
    }
  }
  ensureDir(path) { if (this.state.fs[path]) { if (this.state.fs[path].type !== 'dir') fail('路径不是目录'); return; } this.ensureDir(parent(path)); this.state.fs[path] = { type: 'dir', mode: '755', owner: 'learner' }; }
  modeText(mode) { return mode.split('').map(digit => [4, 2, 1].map((bit, index) => Number(digit) & bit ? 'rwx'[index] : '-').join('')).join(''); }
  complete(input) {
    const words = input.split(/\s+/); const partial = words.at(-1); const first = words.length === 1;
    if (first) return this.manuals.filter(item => item.practice && item.name.startsWith(partial)).map(item => item.name);
    const base = partial.includes('/') ? partial.slice(0, partial.lastIndexOf('/') + 1) : '';
    try { return this.children(base || '.').filter(path => basename(path).startsWith(partial.slice(base.length))).map(path => base + basename(path) + (this.state.fs[path].type === 'dir' ? '/' : '')); } catch { return []; }
  }
}

export function evaluate(goals, state, result = { stdout: '', code: null }) {
  return goals.map(goal => {
    const path = goal.path && resolve(goal.path); const node = state.fs[path]; let done = false;
    switch (goal.type) {
      case 'cwd': done = state.cwd === path; break;
      case 'file': done = node?.type === 'file' && (goal.text === undefined || node.text === goal.text) && (goal.includes === undefined || node.text.includes(goal.includes)); break;
      case 'dir': done = node?.type === 'dir'; break;
      case 'absent': done = !node; break;
      case 'mode': done = node?.mode === goal.value; break;
      case 'owner': done = node?.owner === goal.value; break;
      case 'link': done = node?.type === 'link' && resolve(node.target, parent(path)) === resolve(goal.target); break;
      case 'output': done = result.code === (goal.code ?? 0) && (goal.exact !== undefined ? result.stdout.trim() === goal.exact : result.stdout.includes(goal.includes)); break;
      case 'env': done = state.env[goal.name] === goal.value; break;
      case 'setting': done = state[goal.name] === goal.value; break;
      case 'clear': done = !!result.clear; break;
      case 'processAbsent': done = !state.processes.some(item => item.name === goal.name); break;
      case 'processPresent': done = state.processes.some(item => item.name === goal.name); break;
      case 'service': done = state.services[goal.name]?.[goal.property] === goal.value; break;
      case 'package': done = state.packages.includes(goal.name) === (goal.present ?? true); break;
      case 'archive': {
        const entries = state.archives[path];
        done = !!entries && (goal.entries || []).every(name => name in entries)
          && (!goal.exact || Object.keys(entries).length === goal.entries.length)
          && Object.entries(goal.contents || {}).every(([name,text]) => entries?.[name]?.type === 'file' && entries[name].text === text);
        break;
      }
    }
    return { ...goal, done };
  });
}
