const takeaways = {
  'where-am-i':'找到方向了！你已经用完整路径确认了移动前后的位置。',
  'look-around':'看清工作区了！不必进入目录，也能看看里面有什么。',
  'hidden-profile':'藏起来的配置也找到了！下次少了文件，记得想想隐藏项。',
  'enter-projects':'顺利到站！切换目录后再核对一下，后面的操作就更踏实了。',
  'parent-directory':'回到主目录了！相对路径的方向感，就是这样练出来的。',
  'lookup-copy':'线索找到了！记不住参数时，手册就是你的随身工具箱。',
  'create-workspace':'新工作区准备好了，连目录说明也安置妥当了！',
  'new-readme':'项目说明就位，交付文件也准备好了！',
  'copy-note':'备份和交付都到位了，原件也好好地留着！',
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
  return { yours, reference, message };
}
