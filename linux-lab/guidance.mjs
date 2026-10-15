import { Shell, resolve, tokenize } from './shell.mjs';

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
  const goal = checks.find(goal=>!goal.done);
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
