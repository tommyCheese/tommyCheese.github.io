import { Shell, seedState, HOME } from './shell.mjs';
import { manuals } from './curriculum.mjs';
import { describeChanges } from './guidance.mjs';

const demos = {
  pwd:{title:'终端现在站在哪里？',prediction:'先确认位置，再移动，看看完整路径如何改变。',steps:[['pwd','pwd 显示当前工作目录的完整路径。'],['cd projects','进入 projects；位置改变了。'],['pwd','再读一次路径，现在多了 projects。']]},
  cat:{focus:HOME+'/projects',title:'打开文件，读到内容',prediction:'文件图标背后写着什么？点击后看看输出。',steps:[['cat projects/notes.txt','cat 把文件内容送到终端：draft。']]},
  man:{title:'从手册里找线索',prediction:'记不住参数时，看看手册的用途和参数区。',steps:[['man cp','找到 -r：复制整个目录时可以用它。']]},
  cd:{title:'路径从哪里开始？',prediction:'点击后，留意当前位置和文件列表。',steps:[['cd projects','进入 projects，相对路径从这里开始。'],['cd ..','.. 带你回到上一级。']]},
  ls:{title:'普通文件和隐藏文件',prediction:'同一个目录，换个参数会看到什么？',steps:[['ls','普通列表会省略以点开头的名字。'],['ls -a','加上 -a，隐藏的 .profile 也出现了。']]},
  cp:{focus:HOME+'/projects',title:'复制之后，原件还在吗？',prediction:'看看备份出现后，原文件会不会消失。',steps:[['cp projects/notes.txt projects/notes.bak','副本出现了，原件仍然保留。']]},
  mv:{focus:HOME+'/projects',title:'文件换了名字',prediction:'留意旧名字和新名字的变化。',steps:[['mv projects/notes.txt projects/meeting.txt','内容保留，旧名字换成了新名字。']]},
  mkdir:{focus:HOME+'/projects',title:'一次准备多层目录',prediction:'缺少的上级目录也能一起创建吗？',steps:[['mkdir -p projects/demo/src','-p 连同缺少的上级目录一起准备好了。']]},
  grep:{focus:HOME+'/logs',title:'把筛选结果交给下一步',prediction:'先筛出错误，再看看管道如何统计它们。',steps:[['grep ERROR logs/app.log','只留下匹配 ERROR 的记录。'],['grep ERROR logs/app.log | wc -l','grep 的输出经过管道交给 wc，得到 2 行。']]},
  chmod:{title:'执行权限亮起来了',prediction:'文件内容不变，权限会怎样变化？',steps:[['chmod u+x deploy.sh','所有者获得执行权限：644 → 744。']]},
  echo:{focus:'/tmp',title:'追加和覆盖的区别',prediction:'示范文件已有 first。看看 >> 和 > 的不同。',seed:{files:{'/tmp/demo.txt':'first\n'}},steps:[['echo second >> /tmp/demo.txt','>> 保留原文，把 second 追加到末尾。'],['echo replaced > /tmp/demo.txt','> 覆盖原文，现在只留下 replaced。']]},
  rm:{focus:HOME+'/downloads',title:'留下备份，再清理',prediction:'原文件会消失，提前留下的副本会怎样？',steps:[['cp downloads/old.tmp downloads/old.bak','先留下内容相同的副本。'],['rm downloads/old.tmp','原文件移除了，old.bak 还在。']]},
  head:{focus:HOME+'/logs',title:'只看需要的开头',prediction:'改变 -n，观察输出行数如何变化。',steps:[['head -n 2 logs/app.log','只看开头两行，文件内容保持不变。'],['head -n 1 logs/app.log','缩小范围，现在只输出第一行。']]},
  tail:{focus:HOME+'/logs',title:'从日志末尾找消息',prediction:'最后一行和最后两行，有什么不同？',steps:[['tail -n 1 logs/app.log','只留下最新的一条记录。'],['tail -n 2 logs/app.log','多看一行，可以补上这条消息的上下文。']]},
  sort:{title:'文本顺序和数字大小',prediction:'12 和 2，哪一个先出现？比较两次排序。',seed:{files:{'numbers.txt':'2\n12\n30\n'}},steps:[['sort numbers.txt','默认按文本比较，12 排在 2 前面。'],['sort -n numbers.txt','-n 按数值比较，现在从小到大排列。']]},
  cut:{focus:HOME+'/data',title:'从表格里挑出列',prediction:'把逗号作为分隔符，只留下需要的字段。',steps:[['cut -d , -f 1,3 data/users.csv','只留下第 1、3 列，原表格仍然保留。']]},
  tar:{title:'打包后，原目录还在',prediction:'看看归档文件和原目录能否同时保留。',steps:[['tar -cf projects.tar projects','归档生成了，projects 原目录仍在。'],['tar -tf projects.tar','列出归档内容，核对里面的文件。']]}
};

export function createDemo(command) {
  const definition=demos[command === 'wc' ? 'grep' : command];
  if (!definition) return null;
  // A separate shell: demonstration never mutates the learner's task or history.
  return { ...definition, command, shell:new Shell(seedState(definition.seed),manuals), index:0, result:null, events:[],caption:definition.prediction };
}
export function advanceDemo(demo) {
  if (!demo || demo.index >= demo.steps.length) return false;
  const before=structuredClone(demo.shell.state), [command,caption]=demo.steps[demo.index];
  demo.result=demo.shell.execute(command); demo.events=describeChanges(before,demo.shell.state,demo.result.commands);
  demo.caption=caption; demo.index++;
  return true;
}
export function demoFiles(demo) {
  const state=demo.shell.state;
  const directory=demo.events.find(event=>event.path && !['directory','removed'].includes(event.kind));
  const parent=directory?.path.slice(0,directory.path.lastIndexOf('/'));
  const browse=demo.focus || (demo.shell.state.cwd !== HOME ? demo.shell.state.cwd : parent || HOME);
  const showHidden = demo.command !== 'ls' || demo.index >= 2;
  const files = demo.shell.children(browse).filter(path => showHidden || !path.split('/').pop().startsWith('.')).map(path=>({path,...state.fs[path],revealed:demo.command === 'ls' && demo.index >= 2 && path.split('/').pop().startsWith('.')}));
  const preview = demo.command === 'echo' ? {name:'/tmp/demo.txt', text:demo.shell.read('/tmp/demo.txt')} : null;
  return {browse,files,preview};
}
