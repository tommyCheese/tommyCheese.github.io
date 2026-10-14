import { HOME, resolve, evaluate } from './shell.mjs';

const quote = value => '"' + value.replaceAll('\\', '\\\\').replaceAll('"', '\\"').replaceAll('$', '\\$') + '"';
const fileGoal = (path, text, label) => ({ type:'file', path, text, label });
const orientationTasks = {
  'where-am-i': { steps:['显示当前目录的完整路径。','进入 projects，再显示新位置的完整路径。'], solution:['pwd','cd projects','pwd'], goals:[{type:'cwd',path:HOME+'/projects',label:'最终位于 projects'},{type:'output',exact:HOME+'/projects',code:0,label:'显示进入 projects 后的完整路径'}], tools:['cd'] },
  'look-around': { steps:['查看主目录有哪些文件和目录。','再查看 projects 的内容，找到 notes.txt。'], solution:['ls','ls projects'], goals:[{type:'output',includes:'notes.txt',code:0,label:'显示 projects 中的 notes.txt'}], tools:[] },
  'hidden-profile': { steps:['显示主目录中的隐藏配置 .profile。','再找出 projects 中的隐藏配置 .settings，普通文件也要显示。'], solution:['ls -a','ls -a projects'], goals:[{type:'output',includes:'.settings',code:0,label:'显示 projects 中的 .settings'}], files:{'projects/.settings':'DEBUG=false\n'}, tools:[] },
  'enter-projects': { steps:['进入 projects 目录。','核对终端中的完整路径，最终留在 projects。'], solution:['cd projects','pwd'], goals:[{type:'output',exact:HOME+'/projects',code:0,label:'输出并核对 projects 的完整路径'}], tools:['pwd'] },
  'parent-directory': { steps:['从 projects 返回上一级。','核对完整路径，最终留在主目录。'], solution:['cd ..','pwd'], goals:[{type:'output',exact:HOME,code:0,label:'输出并核对主目录的完整路径'}], tools:['pwd'] },
  'directory-map': { steps:['查看 projects 的目录结构，找到 notes.txt。','再查看 data 的结构，找到 users.csv。'], solution:['tree projects','tree data'], goals:[{type:'output',includes:'users.csv',code:0,label:'显示 data 中的 users.csv'}], tools:[] },
  'lookup-copy': { steps:['查看 cp 手册，找出递归复制目录的参数。','再查看 mkdir 手册，找出创建多层目录的参数。'], solution:['man cp','man mkdir'], goals:[{type:'output',includes:'-p',code:0,label:'查看 mkdir 的多层目录参数说明'}], tools:[] },
  'available-tools': { steps:['查看沙盒支持的命令。','再打开 ls 的手册，找到显示隐藏文件的参数。'], solution:['help','man ls'], goals:[{type:'output',includes:'-a',code:0,label:'查看 ls 的隐藏文件参数说明'}], tools:['man'] },
  'locate-command': { steps:['查找 ls 的可执行文件路径。','再查找 cp 的路径，比较它们所在的目录。'], solution:['which ls','which cp'], goals:[{type:'output',includes:'/usr/bin/cp',code:0,label:'查到 cp 的可执行文件路径'}], tools:[] },
  'read-welcome': { steps:['读取 README.txt，了解工作区说明。','再读取 projects/notes.txt，确认其中写着 draft。'], solution:['cat README.txt','cat projects/notes.txt'], goals:[{type:'output',exact:'draft',code:0,label:'读取 notes.txt 中的 draft'}], tools:[] }
};
const reportTasks = {
  'latest-error':['tail -n 2 logs/app.log','另将最后两行保存到报告，保留原顺序'],
  'count-lines':['grep "^ERROR " logs/app.log | wc -l','另统计以 ERROR 开头的记录数，保存到报告'],
  'numeric-sort':['sort -nr quantities.txt | head -n 3','另将数量最大的前三条记录保存到报告，保留重复项'],
  'unique-names':['sort -u data/names.txt | head -n 2','另将排序去重后的前两个名字保存到报告'],
  'csv-column':['grep ",developer," data/users.csv | cut -d , -f 1,3','另筛出 developer 的姓名与团队，保持原顺序和逗号分隔'],
  'adjacent-duplicates':['uniq -cd sorted-names.txt | sort -nr','另将重复名单按出现次数降序保存到报告'],
  'reverse-log-lines':['tac events.txt | head -n 2','另将倒序后的前两行保存到报告'],
  'reverse-characters':['rev labels.txt | sort','另将反转后的文本按字母排序保存到报告'],
  'wrap-long-line':['fold -w 4 long.txt | wc -l','另统计折行后的行数，保存到报告'],
  'process-list':['ps aux | grep worker','另将包含 worker 的进程记录保存到报告，排除其他进程'],
  'disk-overview':['df -h | grep /dev/sda1','另将 /dev/sda1 所在行保存到报告，去掉表头与其他磁盘'],
  'live-processes':['top | grep worker','另将 worker 的资源记录保存到报告'],
  'listening-port':['ss -tulpn | grep 8080','另将监听 8080 的记录保存到报告，去掉表头'],
  'kernel-messages':['dmesg | grep EXT4','另将含 EXT4 的内核记录保存到报告'],
  'dns-record':['dig example.com | grep 192.0.2.20','另将包含目标 IP 的解析记录保存到报告'],
  'all-environment':['env | grep "^HOME="','另将 HOME 变量所在行保存到报告，排除其他变量']
};

// Keep the core skill, then require a useful delivery or an independently readable check.
export function extendLessonFlows(lessons, makeShell) {
  for (const lesson of lessons) {
    const orientation = orientationTasks[lesson.id];
    if (orientation) {
      lesson.coreSolution = [...lesson.solution]; lesson.flowBefore = []; lesson.flowAfter = [];
      lesson.steps = orientation.steps; lesson.context = orientation.steps.join('\n');
      lesson.solution = orientation.solution; lesson.goals.push(...orientation.goals);
      lesson.reviewCommands = orientation.tools;
      if (orientation.files) { lesson.seed = {...lesson.seed,files:{...lesson.seed?.files,...orientation.files}}; lesson.flowAssets = Object.keys(orientation.files).map(path=>resolve(path)); }
      lesson.hints = ['先看看眼前有什么，再换个位置核对一下。','试着把 '+[lesson.command,...orientation.tools].join('、')+' 配合起来；相对路径和绝对路径都可以。','试试这条路径，再想想有没有别的做法：\n'+lesson.solution.join('\n')];
      continue;
    }
    const initial = makeShell(lesson), final = makeShell(lesson);
    const original = [...lesson.solution]; let result;
    for (const line of original) result = final.execute(line);
    const base = (lesson.chapter === 'navigation' && lesson.level === 'common' ? '/tmp/practice/' : HOME + '/reports/') + lesson.id;
    const before = [], after = [], added = [], reuse = new Set();
    const goal = lesson.goals.find(goal => !/^(保留 |原件|原文件|原目录)/.test(goal.label) && ['file','dir','absent','mode','owner','link','archive'].includes(goal.type));
    let instruction;
    if (lesson.chapter === 'navigation' && lesson.level === 'common') {
      // Navigation is the first topic: introduce saving and reading without nesting mkdir prerequisites.
      lesson.seed = { ...lesson.seed, dirs:[...(lesson.seed?.dirs || []), base] };
      lesson.flowAssets = [base];
    } else { before.push('mkdir -p ' + quote(base)); reuse.add('mkdir'); }
    if (goal?.type === 'absent') {
      const path = resolve(goal.path); const node = initial.state.fs[path];
      if (node?.type === 'dir') {
        const obsolete = base + '/obsolete';
        lesson.seed = { ...lesson.seed, dirs:[...(lesson.seed?.dirs || []), obsolete] };
        lesson.flowAssets = [...(lesson.flowAssets || []), obsolete];
        after.push('rmdir ' + quote(obsolete)); reuse.add('rmdir');
        added.push({type:'absent',path:obsolete,label:'同时移除交付区的 obsolete 空目录'});
        instruction = '同时移除 ' + obsolete.replace(HOME,'~') + ' 空目录，保留交付区。';
      } else if (node?.type === 'file') {
        const target = base + '/before.txt';
        before.push('cp ' + quote(path) + ' ' + quote(target)); reuse.add('cp');
        added.push(fileGoal(target,node.text,'清理前保存原文件到 ' + target.replace(HOME,'~')));
        instruction = '先把 ' + goal.path + ' 的原内容备份到 ' + target.replace(HOME,'~') + '，再完成清理。';
      }
    }
    if (!instruction && goal?.type === 'archive') {
      const archive = resolve(goal.path), destination = base + '/restored';
      after.push('mkdir -p ' + quote(destination), 'tar -xf ' + quote(archive) + ' -C ' + quote(destination)); reuse.add('mkdir'); reuse.add('tar');
      for (const [name,node] of Object.entries(final.state.archives[archive] || {})) {
        if (node.type === 'file') added.push(fileGoal(destination+'/'+name,node.text,'恢复并核对 '+name));
      }
      if (!added.length) added.push({type:'dir',path:destination,label:'创建恢复目录'});
      instruction = '将归档解包到 ' + destination.replace(HOME,'~') + '，核对恢复的文件内容；保留原归档。';
    }
    if (!instruction && goal?.type === 'dir') {
      const path = resolve(goal.path), target = path + '/README.txt';
      const brief = lesson.title + '\n';
      lesson.seed = { ...lesson.seed, files:{...lesson.seed?.files, [base+'/brief.txt']:brief} };
      lesson.flowAssets = [base+'/brief.txt'];
      before.length = 0; // The supplied brief already makes its parent directory available.
      after.push('cp ' + quote(base+'/brief.txt') + ' ' + quote(target)); reuse.add('cp');
      added.push(fileGoal(target,brief,'将 brief.txt 放入新目录，命名为 README.txt'));
      instruction = '把 ' + base.replace(HOME,'~') + '/brief.txt 复制到 ' + target.replace(HOME,'~') + '，作为目录说明。';
    }
    if (!instruction && goal && ['file','link'].includes(goal.type)) {
      const path = resolve(goal.path), node = final.state.fs[path];
      if (node && !final.state.archives[path]) {
        const target = base + '/delivery.txt'; const content = final.read(path);
        after.push((goal.type === 'link' ? 'cat ' + quote(path) + ' > ' + quote(target) : 'cp ' + quote(path) + ' ' + quote(target))); reuse.add(goal.type === 'link' ? 'cat' : 'cp');
        added.push(fileGoal(target,content,'将完成后的内容交付到 ' + target.replace(HOME,'~')));
        instruction = '将完成后的 ' + goal.path + ' 复制到 ' + target.replace(HOME,'~') + '，保留原结果。';
      }
    }
    if (!instruction) {
      const report = base + '/check.txt'; let command;
      if (goal && ['mode','owner'].includes(goal.type)) command = 'stat ' + quote(resolve(goal.path));
      else if (lesson.goals.some(goal => goal.type === 'service')) command = 'systemctl status ' + lesson.goals.find(goal=>goal.type==='service').name;
      else if (lesson.goals.some(goal => ['processAbsent','processPresent'].includes(goal.type))) command = 'ps aux';
      else if (lesson.goals.some(goal=>goal.type==='package')) command = 'apt list --installed';
      else if (lesson.goals.some(goal=>goal.type==='setting' && goal.name==='umask')) command = 'umask';
      else if (lesson.goals.some(goal=>['env','setting'].includes(goal.type))) command = 'env';
      else if (lesson.goals.some(goal=>goal.type==='cwd')) command = 'pwd';
      else if (lesson.goals.some(goal=>goal.type==='clear')) command = 'history';
      else if (lesson.command === 'sleep') command = 'seq 3';
      else command = original.at(-1);
      const reportTask = reportTasks[lesson.id];
      if (reportTask) command = reportTask[0];
      const check = final.execute(command);
      // true/false demonstrate control flow, not a fabricated report of their exit status.
      if (lesson.command === 'true' || lesson.command === 'false') {
        const text = lesson.command === 'true' ? 'ready\n' : 'recovered\n';
        command = lesson.command + (lesson.command === 'true' ? ' && ' : ' || ') + 'printf ' + quote(text.replaceAll('\n','\\n')) + ' > ' + quote(report);
        after.push(command); reuse.add('printf');
        added.push(fileGoal(report,text,'用条件分支保存 ' + text.trim() + ' 到 ' + report.replace(HOME,'~')));
        instruction = '通过命令的退出状态选择分支，把 ' + text.trim() + '（含换行）保存到 ' + report.replace(HOME,'~') + '。';
      } else {
        after.push(command + ' > ' + quote(report) + (check.code ? ' || true' : ''));
        if (lesson.goals.some(goal=>goal.type==='clear')) after.push('clear');
        else if (lesson.goals.some(goal=>goal.type==='output')) { after.push('cat ' + quote(report)); reuse.add('cat'); }
        const name = command.split(' ')[0]; reuse.add(name);
        for (const part of command.split('|')) reuse.add(part.trim().split(' ')[0]);
        const reportGoal = fileGoal(report,check.stdout,'保存核对结果到 ' + report.replace(HOME,'~'));
        if (lesson.command === 'ls') { delete reportGoal.text; reportGoal.includes = lesson.goals.find(goal=>goal.type==='output')?.includes || 'projects'; }
        // History includes the learner's own commands, so require the relevant entry rather than a reference transcript.
        if (lesson.command === 'history' || lesson.command === 'clear') { delete reportGoal.text; reportGoal.includes = lesson.command === 'history' ? 'history' : 'clear'; }
        added.push(reportGoal);
        if (reportTask) added.push({type:'output',exact:check.stdout.trim(),code:0,label:'读回报告，核对筛选或统计结果'});
        instruction = (reportTask ? reportTask[1] + '。报告路径：' : '用 ' + name + ' 核对结果，将输出保存到 ') + report.replace(HOME,'~') + (lesson.goals.some(goal=>goal.type==='output' && (goal.code??0)===0) ? '；读回报告核对内容。' : '。');
      }
    }
    lesson.coreSolution = original;
    lesson.flowBefore = before;
    lesson.flowAfter = after;
    lesson.steps = instruction.startsWith('先把') ? [instruction,lesson.context] : [lesson.context,instruction];
    lesson.context = lesson.steps.join('\n');
    lesson.reviewCommands = [...reuse].filter(name=>name !== lesson.command);
    lesson.goals.push(...added);
    const captureOnly = !reportTasks[lesson.id] && lesson.command !== 'history' && lesson.command !== 'sleep' && lesson.goals.slice(0,-added.length).every(goal=>goal.type==='output' && (goal.code??0)===0) && !['true','false'].includes(lesson.command);
    lesson.solution = [...before,...(captureOnly ? [] : original),...after];
    lesson.hints = ['先把核心操作做出来，再看看结果要放在哪里、哪些文件要留下。', '试着把 ' + [...new Set([lesson.command,...lesson.reviewCommands])].join('、') + ' 配合起来；想留下输出，可以用 > 保存。', '试试这条路径，再想想有没有别的做法：\n'+lesson.solution.join('\n')];
  }
}

// Upgrade newly supplied teaching assets without replaying setup or overwriting learner files.
export function restoreFlowAssets(state, initial, lesson) {
  for (const asset of lesson.flowAssets || []) {
    const chain = []; let path = resolve(asset);
    while (path !== '/' && !state.fs[path]) { chain.unshift(path); path = resolve('..',path); }
    if (chain.length && state.fs[path]?.type !== 'dir') continue;
    for (const path of chain) if (initial.fs[path]) state.fs[path] = structuredClone(initial.fs[path]);
  }
}

export function restoreFlowSnapshot(snapshot, initial, lesson) {
  restoreFlowAssets(snapshot.state, initial, lesson);
  const previous = snapshot.goalChecks;
  snapshot.goalChecks = evaluate(lesson.goals, snapshot.state, { stdout:'', ...snapshot.lastResult });
  snapshot.goalChecks.forEach((goal, index) => {
    const old = previous[index];
    if (goal.type === 'output' && old?.done && ['type','exact','includes','code'].every(key => goal[key] === old[key])) goal.done = true;
  });
}
