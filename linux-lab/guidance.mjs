import { goalEntries } from './task-copy.mjs';
import { Shell, resolve, tokenize } from './shell.mjs';

const introductions = {
  pwd:'刚进终端，先问一句：“我在哪儿？”pwd 就是你的定位器。',
  ls:'打开抽屉前，先看看里面有什么。ls 帮你扫一眼目录，不用挨个打开文件。',
  cd:'看过地图，该走两步了！cd 负责换位置，后面的相对路径也会跟着换起点。',
  tree:'目录一多，光看名字容易迷路。tree 能把层级关系展开给你看。',
  man:'参数忘了？太正常了！man 是随手能翻的说明书，不必把每个选项都背下来。',
  mkdir:'给文件找个家吧！mkdir 负责建目录，遇到多层路径时，留意它的选项。',
  touch:'先留一张空白便签。touch 能创建空文件，已有的内容也不会被它擦掉。',
  cp:'动手改文件前，先留个副本，心里更有底。cp 复制文件，原件还在原处。',
  mv:'搬个家，或者换个名字？这两件事都可以交给 mv，关键在目标路径。',
  rm:'轮到清理了！先看清要删的路径，再交给 rm；多核对一眼总是划算的。',
  cat:'文件里写了什么？cat 可以直接把正文送到终端，短文件读起来很方便。',
  head:'长日志不用从头读到尾。head 先给你看开头，查看几行由你决定。',
  tail:'新消息常常在文件末尾。tail 从后面看起，帮你找到最近的记录。',
  grep:'一大堆文字里找线索？grep 会把符合条件的行挑出来，匹配条件就是你的筛子。',
  sort:'数字和文字，排队的规则可不一样！用 sort 前，先想想你要按什么顺序排列。',
  uniq:'重复名字又出现了？uniq 会合并相邻的重复行，隔着别人的重复项可躲得过去。',
  wc:'不用自己一行行数。wc 可以统计行数、单词和字节，选对单位就好。',
  cut:'表格里只想要几列？cut 就像一把剪刀，先告诉它分隔符，再选字段。',
  chmod:'能读、能写、能执行，是三件不同的事。chmod 帮你调整这些权限。',
  tar:'文件太散，不方便交接？tar 可以把它们装进一个归档，也能再拆出来。',
  ps:'后台都在忙什么？ps 会拍一张进程快照，PID 就是每个进程的编号。',
  df:'磁盘还有多少空位？df 看的是文件系统的总量与剩余空间，先别和单个目录的大小混淆。'
};
// Introductions follow lesson knowledge, rather than a shared command or topic slogan.
const lessonIntroductions = {
  "clean-screen": "屏幕清爽一点，练习进度还在。clear 清除终端显示，不会删除文件、命令历史或已经完成的操作。",
  "enter-projects": "去项目里看看吧！相对路径从脚下出发，进入子目录后，后续操作的起点也就变了。",
  "parent-directory": "往回走一层！.. 指向当前目录的父目录；这里从 projects 返回，正好就到自己的主目录。",
  "locate-command": "命令也有住址！which 沿着 PATH 查找程序，返回它的可执行文件路径。",
  "number-sequence": "一串数字不用逐个敲。seq 默认每次加 1，并把每个数放在单独一行。",
  "current-groups": "权限也看你属于哪个组。groups 列出当前用户的主组和附加组，组名之间用空格分开。",
  "available-cpus": "程序能用几颗 CPU？nproc 给出可用处理单元的数量，适合决定并行任务数。",
  "login-users": "谁正登录着这台机器？who 按会话列出用户和终端，同一个用户也可能出现多次。",
  "terminal-device": "这个终端也对应一个文件路径。tty 显示当前终端设备；pts 通常表示伪终端。",
  "list-installed": "安装前，先看看工具是否已经在了。apt list --installed 列出已安装的软件包，和目录里的文件清单不同。",
  "check-service-state": "只想知道服务在不在运行？is-active 给出简短状态，active 表示正在运行；它不代表已经设置开机启动。",
  "starter-delivery": "先准备一张空白交接单。touch 遇到不存在的文件会创建它，遇到已有文件则不会清空正文。",
  "resolve-path": "路径里绕了几个弯？realpath 把 .、.. 等部分解析成完整绝对路径，方便核对真正的位置。",
  "identify-builtin": "有些命令就住在 Shell 里面。type 能区分内建命令和外部程序，cd 属于前者。",
  "temporary-workdir": "临时工作也要有独立空间。mktemp -d 创建一个名称不冲突的目录，模板末尾的 X 会被替换。",
  "empty-log": "清空内容，文件还要留着。truncate 调整文件长度；长度设为 0，就会丢弃原来的正文。",
  "recursive-backup": "副本里也不能漏掉子目录。cp 的递归选项会沿着目录往下复制，嵌套配置也一起带走。",
  "number-blank-lines": "空行也算一行！nl 默认跳过空行编号；想连续编号，要明确让所有行都参与。",
  "reverse-log-lines": "先看最后发生的事。tac 会颠倒行的顺序，每一行内部的文字保持原样。",
  "reverse-characters": "这次翻转的是文字，不是行序。rev 反转每一行的字符，各行仍待在原来的位置。",
  "byte-comparison": "看起来一样，还得逐字节核对。cmp 用退出码告诉你是否相同；相同的时候，终端通常什么也不打印。",
  "expand-tabs": "Tab 不是固定几个空格。expand 按制表位补空格，补多少取决于当前已经走到了哪一列。",
  "compact-indent": "把长长的缩进收紧一点。unexpand 可以把行首空格换成 Tab，换算时要用同样的制表位宽度。",
  "wrap-long-line": "一行太长，就分几行读。fold 按指定宽度折行；这里按字符计数，不会替你改写文字。",
  "recursive-owner": "目录归属改好了，里面的文件呢？chown 的递归选项会把所有者变更应用到整个目录层级。",
  "session-load": "知道谁在线之后，再看看他们在忙什么。w 把登录会话、正在运行的命令和系统负载放到一起看。",
  "cpu-topology": "不只问有几颗 CPU，也看看它是什么架构。lscpu 展示处理器架构和拓扑信息，这里使用固定教学快照。",
  "block-filesystems": "磁盘、分区、文件系统，先分清这几层。lsblk 用层级展示块设备，-f 会补上文件系统和挂载点信息。",
  "mounted-root": "目录里的内容从哪里来？findmnt 把挂载点、来源设备和文件系统类型对应起来，根目录 / 也是一个挂载点。",
  "kernel-messages": "系统启动时发生的事，内核会留下记录。dmesg 查看这些消息，硬件识别和文件系统挂载都可能留下线索。",
  "inspect-http-headers": "先看信封，不急着读正文。curl -I 请求 HTTP 响应头，状态码和内容类型都在这里。",
  "precise-temp-cleanup": "同样是 .tmp，也不一定都该删。find 的路径深度、文件类型和名称条件会共同决定清理范围，先预览再动手。"
};
export function lessonIntroduction(lesson, { review = false, boss = false } = {}) {
  const genericTheory = lesson.theory === '对照目标选择参数，观察文件或输出的变化。';
  const lead = lessonIntroductions[lesson.id] || lesson.theory || introductions[lesson.command] || '';
  const knowledge = lessonIntroductions[lesson.id]
    ? (genericTheory ? '' : lesson.theory || '')
    : introductions[lesson.command] || '';
  return {
    lead: boss ? 'Boss 登场！这次没有指定工具，先拆解问题，再把学过的本领组合起来。'
      : review ? '回来热热手！先试着回忆这把工具怎么用，想不起来时再查介绍或手册。' : lead,
    knowledge: boss || review ? (genericTheory ? lead : lesson.theory || '') : knowledge,
    showTool: !boss
  };
}

const takeaways = {
  'where-am-i':'找到方向了！你已经用完整路径确认了移动前后的位置。',
  'look-around':'看清工作区了！不必进入目录，也能看看里面有什么。',
  'hidden-profile':'藏起来的配置也找到了！下次少了文件，记得想想隐藏项。',
  'enter-projects':'顺利到站！切换目录后再核对一下，后面的操作就更踏实了。',
  'parent-directory':'回到主目录了！相对路径的方向感，就是这样练出来的。',
  'lookup-copy':'线索找到了！记不住参数时，手册就是你的随身工具箱。',
  'create-workspace':'新工作区准备好了，连目录说明也安置妥当了！',
  'new-readme':'两份项目说明都就位了！带空格的路径也处理好了。',
  'copy-note':'备份核对过了，原件也好好地留着！',
  'cleanup-temp':'清理完成，备份也在。动手前留一份，心里更有底。',
  'process-list':'找到目标进程了！一长串信息，现在变成了一份清晰的报告。',
  'create-archive':'打包、恢复、核对，都完成了！这份归档经得起检查。'
};

export function completionMessage(lesson, { boss=false, review=false } = {}) {
  return {
    title: boss ? '漂亮，Boss 拿下！' : review ? '又找回这份手感了！' : '漂亮，做到了！',
    detail: boss ? '你把几个工具配合起来，完成了整场挑战。' : takeaways[lesson.id] || `「${lesson.title}」的目标都达成了，这套操作已经跑通！`
  };
}

// Match lines in order, so repeated inputs and reordered steps remain visible.
function lineDifferences(yours, reference) {
  const lengths = Array.from({length:yours.length+1},()=>Array(reference.length+1).fill(0));
  for (let i=yours.length-1;i>=0;i--) for (let j=reference.length-1;j>=0;j--)
    lengths[i][j] = yours[i] === reference[j] ? 1+lengths[i+1][j+1] : Math.max(lengths[i+1][j],lengths[i][j+1]);
  const yoursDifferent=yours.map(()=>true), referenceDifferent=reference.map(()=>true);
  let i=0,j=0;
  while (i<yours.length && j<reference.length) {
    if (yours[i] === reference[j]) { yoursDifferent[i++]=false; referenceDifferent[j++]=false; }
    else if (lengths[i+1][j] >= lengths[i][j+1]) i++;
    else j++;
  }
  return {yoursDifferent, referenceDifferent};
}

// Compare recorded input lines, not shell commands: a pipeline may contain several commands.
export function compareSolutions(history, candidates) {
  const lines = text => text.split('\n').map(line=>line.trim()).filter(Boolean);
  const choices = candidates.map(candidate=>({...candidate,lines:lines(candidate.command)}))
    .sort((a,b)=>a.lines.length-b.lines.length || a.command.length-b.command.length);
  const reference = choices[0];
  const yours = history.flatMap(lines);
  if (!reference) return { yours, reference:null, message:'这次的操作已达成目标。暂时没有可验证的参考路径。' };
  const delta = yours.length-reference.lines.length;
  const same = yours.length === reference.lines.length && yours.every((line,index)=>line === reference.lines[index]);
  const message = same ? '你的操作与这份参考路径一致，目标都完成了！'
    : history.length >= 200 ? '这里只显示最近 200 次输入，可对照路径、参数和命令组合。'
    : delta > 0 ? `你多用了 ${delta} 行输入。看看哪些是在观察、查阅，哪些可以合并。`
    : delta < 0 ? `你少用了 ${-delta} 行输入，也达成了全部目标。看看命令是怎样组合起来的！`
    : '行数相同，写法不同。对照一下路径、参数和命令组合吧。';
  return { yours, reference, message, ...lineDifferences(yours, reference.lines) };
}

export function nextTransition(lesson, next) {
  return next ? `下一关：${next.title}` : '';
}

export function stateHint(lesson, state, checks, tier=1, result={}) {
  if (tier >= 3) return lesson.hints[2];
  const goal = goalEntries(checks).map(([,goal])=>goal).find(goal=>!goal.done);
  if (!goal) return '目标都完成了！可以看看自己的解法，再去挑战下一关。';
  const path = goal.path && resolve(goal.path), node = state.fs[path];
  const display = value => value?.replace('/home/learner','~');
  if (['file','dir','link','mode','owner'].includes(goal.type)) {
    if (!node) {
      const name = path.split('/').pop();
      const elsewhere = Object.keys(state.fs).find(candidate=>candidate !== path && candidate.split('/').pop() === name);
      if (elsewhere) return `找到同名${state.fs[elsewhere].type === 'dir' ? '目录' : '文件'}了，它现在在 ${display(elsewhere)}。再看看目标要放在哪里${tier === 2 ? '；可以用 mv 调整位置，或用 cp 保留原件' : ''}。`;
      const parent = resolve('..',path);
      if (!state.fs[parent]) return `目标的上级目录 ${display(parent)} 还没准备好。${tier === 2 ? 'mkdir 的 -p 可以连同缺少的上级目录一起创建。' : '先看看路径分成了哪几层。'}`;
      return `${display(parent)} 已经在了，${name} 还没就位。${tier === 2 ? '可以先用 ls 看看，再选择创建、复制或移动的工具。' : '先看看这里有哪些文件，确认要操作的名字。'}`;
    }
    if (goal.type === 'file' && node.type === 'file' && !goal.done) {
      if (goal.text?.startsWith(node.text) && node.text) return `原来的内容还在，接下来补上缺少的部分。${tier === 2 ? '>> 会追加到末尾，> 会覆盖；用 cat 核对顺序和换行。' : '想想哪种写入方式能保留它。'}`;
      return `文件已经有了！现在核对 ${display(path)} 的内容${tier === 2 ? '，用 cat 读回；注意大小写、空格、换行以及需要保留的原文' : '，看看哪一部分与目标不同'}。`;
    }
    if (goal.type === 'mode') return `文件找对了，当前权限是 ${node.mode}，目标是 ${goal.value}。${tier === 2 ? 'chmod 可以用数字设置权限，也能用 u、g、o 配合 +、- 调整。' : '先想想需要改变谁的哪种权限。'}`;
    if (goal.type === 'owner') return `文件找对了，当前所有者是 ${node.owner}。${tier === 2 ? '用 chown 调整所有者，再用 stat 核对。' : '再看看目标要求交给谁。'}`;
    if (goal.type === 'link') return `链接已经有了，再核对它指向哪里。${tier === 2 ? 'readlink 能查看指向；相对目标要从链接所在目录解析。' : '留意链接所在的位置和目标路径。'}`;
    return `名字已经存在，看看它是文件还是目录。${tier === 2 ? '用 ls -l 或 stat 查看类型，再选合适的操作。' : ''}`;
  }
  if (goal.type === 'cwd') return `你现在在 ${display(state.cwd)}。目标是 ${display(path)}。${tier === 2 ? 'cd 切换目录，.. 是上一级；随后用 pwd 核对。' : '从这两个位置想一想该往哪里走。'}`;
  if (goal.type === 'absent') return `${display(path)} 还在。${tier === 2 ? '先确认其他目标中的备份和保留项；rm 删除文件，rmdir 删除空目录。' : '清理前，先确认哪些内容需要留下。'}`;
  if (goal.type === 'output') {
    if (goal.exact && result.stdout?.trim()) {
      const expected=goal.exact.trim().split('\n').length, actual=result.stdout.trim().split('\n').length;
      if (actual !== expected) return `已经有输出了！当前 ${actual} 行，目标 ${expected} 行。${tier === 2 ? '核对筛选条件、查看范围与排序，再看是否需要处理大小写。' : '想想哪些记录该留下、哪些该排除。'}`;
    }
    const otherDone = checks.some(check=>check.type !== 'output' && check.done);
    return tier === 1 ? otherDone ? '结果已准备好，再读回或查询一次，核对目标。' : '对照目标要求，留意查看范围、大小写和参数。' : `目标：${goal.label}。可用 ${[lesson.command,...(lesson.reviewCommands || [])].join('、')}；留意路径、范围、大小写和参数。`;
  }
  if (goal.type === 'service') return `看看 ${goal.name} 的${goal.property === 'active' ? '运行' : '开机启动'}状态。${tier === 2 ? 'systemctl 的 start 与 enable 分别控制这两件事；status 用来核对。' : '它们是两个独立的开关。'}`;
  return `${checks.some(check=>check.done) ? '已经完成一部分了！' : '先从眼前的状态找线索。'} 接下来：${goal.label}。${tier === 2 ? lesson.hints[1] : ''}`;
}

export function methodInsights(history, reference, env={}) {
  const analyze = lines => {
    const names = new Set(), flags = new Set(); let pipe=false, redirect=false, absolute=false;
    for (const line of lines) {
      let tokens; try { tokens=tokenize(line,env); } catch { continue; }
      let start=true;
      for (const token of tokens) {
        if (token.operator) { pipe ||= token.value === '|'; redirect ||= ['>','>>'].includes(token.value); if (!['>','>>','<'].includes(token.value)) start=true; }
        else if (start) { names.add(token.value); start=token.value === 'sudo'; }
        else { if (token.value.startsWith('-')) flags.add(token.value); absolute ||= token.value.startsWith('/'); }
      }
    }
    return {names,flags,pipe,redirect,absolute};
  };
  const yours=analyze(history), other=analyze(reference || []), notes=[];
  if (yours.names.has('cd') && !other.names.has('cd')) notes.push('你切换目录后使用了相对路径；参考路径直接指定文件位置。两种方式都可以，留意路径从哪里开始。');
  if (yours.absolute !== other.absolute) notes.push('一边使用了绝对路径，另一边依靠当前位置。绝对路径更明确，相对路径通常更简短。');
  if (yours.pipe !== other.pipe) notes.push('管道把前一步的输出直接交给下一步；分开执行则更方便逐步观察中间结果。');
  if (yours.names.has('tee') !== other.names.has('tee')) notes.push('tee 可以一边显示一边保存；重定向保存后，也能再读回文件核对。');
  if ([...yours.names].some(name=>['man','help','ls','pwd'].includes(name) && !other.names.has(name))) notes.push('你的操作包含额外观察或查阅。它们帮助确认环境，不影响通关。');
  return notes.slice(0,3);
}

export function describeChanges(before, after, commands=[]) {
  const events=[], removed=Object.keys(before.fs).filter(path=>!after.fs[path]);
  for (const [path,node] of Object.entries(after.fs)) {
    const old=before.fs[path];
    if (!old) {
      const from=commands.includes('mv') && removed.find(candidate=>JSON.stringify(before.fs[candidate]) === JSON.stringify(node));
      if (from) { removed.splice(removed.indexOf(from),1); events.push({kind:'moved',path,from}); }
      else events.push({kind:'created',path});
    } else if (old.mode !== node.mode) events.push({kind:'permission',path,from:old.mode,to:node.mode});
    else if (old.owner !== node.owner) events.push({kind:'owner',path,from:old.owner,to:node.owner});
    else if (JSON.stringify(old) !== JSON.stringify(node)) events.push({kind:'updated',path});
  }
  for (const path of removed) events.push({kind:'removed',path});
  if (before.cwd !== after.cwd) events.push({kind:'directory',path:after.cwd,from:before.cwd});
  for (const [name,service] of Object.entries(after.services)) if (JSON.stringify(before.services[name]) !== JSON.stringify(service)) events.push({kind:'service',name});
  for (const name of new Set([...before.packages,...after.packages])) if (before.packages.includes(name) !== after.packages.includes(name)) events.push({kind:'package',name});
  for (const name of new Set([...Object.keys(before.env),...Object.keys(after.env)])) if (before.env[name] !== after.env[name]) events.push({kind:'env',name});
  for (const item of before.processes) if (!after.processes.some(process=>process.pid === item.pid)) events.push({kind:'process',name:item.name});
  return events;
}

export function pipelineStages(input, initial, manuals) {
  let tokens; try { tokens=tokenize(input,initial.env); } catch { return []; }
  if (!tokens.some(token=>token.operator && token.value === '|') || tokens.some(token=>token.operator && !['|','>','>>'].includes(token.value))) return [];
  const groups=[[]];
  for (const token of tokens) {
    if (token.operator && ['>','>>'].includes(token.value)) break;
    if (token.operator) groups.push([]); else groups.at(-1).push(token);
  }
  const readers=new Set(['cat','grep','sort','uniq','wc','head','tail','cut','tr','rev','tac','fold','nl','sed','awk','ps','df','ss','env']);
  if (groups.some(group=>!readers.has(group[0]?.value) || group.some(token=>/^-[^-]*i/.test(token.value) && group[0].value === 'sed'))) return [];
  return groups.map((group,index)=>{
    const command=groups.slice(0,index+1).map(group=>group.map(token=>token.raw ?? token.value).join(' ')).join(' | ');
    const result=new Shell(initial,manuals).execute(command);
    return {name:group[0].value,command:group.map(token=>token.raw ?? token.value).join(' '),stdout:result.stdout,code:result.code};
  });
}
