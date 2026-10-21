import { prepareJudging } from './judging.mjs?v=20261020-judging-1';
import { createLessonShell } from './curriculum.mjs?v=20261021-prune-lessons-1';
import { Shell, seedState } from './shell.mjs?v=20261020-judging-1';
import { clarifyGoalLabels } from './task-copy.mjs?v=20261021-prune-lessons-1';
// Variants keep the same objective skill ID; filenames, data and deliverables change.
// Supporting commands are not credited as separate skills without their own assessment.
const output = (label, exact, requiresPath) => ({type:'output',label,exact,code:0,...(requiresPath ? {requiresPath} : {})});
const file = (path,text,label) => ({type:'file',path,text,label});
export const skillLabel = lesson => lesson.title;
export function createReviewLesson(source, variant) {
  const n = variant % 7 + 2, token = 'batch-' + (variant % 97 + 1), folder = 'handoff';
  const rows = Array.from({length:n},(_,i)=>`${i%2 ? 'ERROR' : 'INFO'} job-${i+1}`).join('\n')+'\n';
  const errors = rows.trim().split('\n').filter(line=>line.startsWith('ERROR'));
  const first = variant % 2 ? 3 : 2;
  const values = [n*11,2,n,10,n*11];
  const templates = {
    'where-am-i': {context:'先输出出发目录的完整路径，再进入 handoff 目录，输出新位置的完整路径并留在那里。',
      seed:{dirs:[folder]},solution:['pwd','cd '+folder,'pwd'],
      goals:[output('输出出发位置','/home/learner'),{type:'cwd',path:'/home/learner/'+folder,label:'留在交接目录'},output('输出交接目录的完整路径','/home/learner/'+folder)]},
    'look-around': {context:'列出 handoff 目录中的文件，找到本批清单；再列出 archive 目录中的文件，确认 previous.txt 仍在。无需切换目录。',
      seed:{files:{[folder+'/'+token+'.txt']:'ready\n','archive/previous.txt':'done\n'}},
      solution:['ls '+folder,'ls archive'],goals:[{type:'output',includes:token+'.txt',code:0,label:'目录列表包含本批清单'},{type:'output',includes:'previous.txt',code:0,label:'目录列表包含上一批清单'}]},
    'hidden-profile': {context:'handoff 和 archive 目录各有一份隐藏配置。分别列出这两个目录的全部条目，输出中同时显示隐藏配置和普通文件 visible.txt。',
      seed:{files:{[folder+'/.secret-'+token]:'active\n',[folder+'/visible.txt']:'ready\n','archive/.previous':'old\n','archive/visible.txt':'saved\n'}},
      solution:['ls -a '+folder,'ls -a archive'],goals:[{type:'output',includes:'.secret-'+token,code:0,label:'显示本批隐藏配置'},{type:'output',includes:'.previous',code:0,label:'显示归档隐藏配置'},{type:'output',includes:'visible.txt',code:0,label:'同时显示普通文件'}]},
    'enter-projects': {context:'进入 handoff 中的本批子目录，输出并核对目标清单中指定的完整路径，最终留在该目录。',
      seed:{dirs:[folder+'/'+token]},solution:['cd '+folder+'/'+token,'pwd'],goals:[{type:'cwd',path:'/home/learner/'+folder+'/'+token,label:'留在本批子目录'},output('核对完整路径','/home/learner/'+folder+'/'+token)]},
    'parent-directory': {context:'你已在 handoff 的本批子目录中。先返回 handoff，再返回主目录 /home/learner；每次返回后都输出完整路径。',
      seed:{cwd:'/home/learner/'+folder+'/'+token,dirs:[folder+'/'+token]},solution:['cd ..','pwd','cd ..','pwd'],goals:[output('核对交接目录路径','/home/learner/'+folder),output('核对主目录路径','/home/learner'),{type:'cwd',path:'/home/learner',label:'最终留在主目录'}]},
    'read-welcome': {context:'先读取 manifest.txt，再读取 receipt.txt；在终端显示两份文件的内容，核对批次一致。',
      seed:{files:{'manifest.txt':token+' ready\n','receipt.txt':token+' accepted\n'}},solution:['cat manifest.txt','cat receipt.txt'],goals:[output('读取交接清单',token+' ready'),output('读取归档确认单',token+' accepted')]},
    'copy-note': {context:'将 manifest.txt 复制为 manifest.bak，在终端读回副本内容，核对批次；保留 manifest.txt 及其原内容。',
      seed:{files:{'manifest.txt':token+' approved\n'}},solution:['cp manifest.txt manifest.bak','cat manifest.bak'],
      goals:[file('manifest.bak',token+' approved\n','将 manifest.txt 复制为 manifest.bak，内容不变'),file('manifest.txt',token+' approved\n','原清单仍保留'),output('读回副本核对批次',token+' approved','manifest.bak')]},
    'rename-note': {context:'读取 manifest-a.txt 和 manifest-b.txt，找到含 approved 的那份，将它改名为 final.txt；保留含 draft 的另一份。最后在终端读取 final.txt 核对。',
      seed:{files:{'manifest-a.txt':token+' '+(variant%2?'approved':'draft')+'\n','manifest-b.txt':token+' '+(variant%2?'draft':'approved')+'\n'}},
      solution:['cat manifest-a.txt manifest-b.txt','mv manifest-'+(variant%2?'a':'b')+'.txt final.txt','cat final.txt'],
      goals:[file('final.txt',token+' approved\n','将含 approved 的清单重命名为 final.txt，内容不变'),file('manifest-'+(variant%2?'b':'a')+'.txt',token+' draft\n','草稿仍保留'),{type:'absent',path:'manifest-'+(variant%2?'a':'b')+'.txt',label:'重命名后，旧路径 manifest-'+(variant%2?'a':'b')+'.txt 不再存在'},output('读回最终清单',token+' approved','final.txt')]},
    'preview-log': {context:`查看 batch.log 的前 ${first} 行，再将第一行保存到 opening.txt，读回核对。`,seed:{files:{'batch.log':rows}},
      solution:[`head -n ${first} batch.log`,'head -n 1 batch.log > opening.txt','cat opening.txt'],
      goals:[output('输出指定的开头记录',rows.trim().split('\n').slice(0,first).join('\n')),file('opening.txt','INFO job-1\n','只保存首行'),output('读回首行','INFO job-1','opening.txt')]},
    'latest-error': {context:`只输出 batch.log 的最后 ${first} 行，将同样内容保存到 closing.txt，再读回核对。`,seed:{files:{'batch.log':rows}},
      solution:[`tail -n ${first} batch.log`,`tail -n ${first} batch.log > closing.txt`,'cat closing.txt'],
      goals:[file('closing.txt',rows.trim().split('\n').slice(-first).join('\n')+'\n','保存末尾指定条数'),output('输出并核对最后的记录',rows.trim().split('\n').slice(-first).join('\n'))]},
    'filter-errors': {context:'batch.log 中有大小写不同的错误级别，也有正文提到 ERROR 的普通记录。只提取以 ERROR 开头的错误行，不区分大小写，保存到 failures.txt；再输出匹配行数。',
      seed:{files:{'batch.log':rows+'INFO mentions ERROR\nerror late-job\n'}},solution:['grep -i "^ERROR " batch.log > failures.txt','grep -ic "^ERROR " batch.log'],
      goals:[file('failures.txt',[...errors,'error late-job'].join('\n')+'\n','只保存错误级别记录'),output('核对错误记录数',String(errors.length+1))]},
    'count-lines': {context:'batch.log 的最后一行没有换行。分别输出换行符数量与错误记录数量，留意两者的区别。',
      seed:{files:{'batch.log':rows+'ERROR final-job'}},solution:['wc -l batch.log','grep "^ERROR " batch.log | wc -l'],
      goals:[{type:'output',includes:String(n)+' batch.log',code:0,label:'核对原日志换行符数量'},output('核对筛选后的错误记录数',String(errors.length+1))]},
    'numeric-sort': {context:'将 quantities.txt 中的数量从大到小排列，保留重复值，保存到 ranked.txt；另外只输出最大的三个数量。',seed:{files:{'quantities.txt':values.join('\n')+'\n'}},
      solution:['sort -nr quantities.txt > ranked.txt','head -n 3 ranked.txt'],goals:[file('ranked.txt',[...values].sort((a,b)=>b-a).join('\n')+'\n','按数值降序保留重复项'),output('输出前三个数量',[...values].sort((a,b)=>b-a).slice(0,3).join('\n'))]},
    'unique-names': {context:'attendees.txt 中同一个名字分散出现。将全部名字按字母排序、去重，保存到 roster.txt，再在终端输出去重后的名字数量。',seed:{files:{'attendees.txt':'Mina\nAri\nMina\n'+token+'\nAri\n'}},
      solution:['sort -u attendees.txt > roster.txt','cat roster.txt | wc -l'],goals:[file('roster.txt',['Mina','Ari',token].sort().join('\n')+'\n','全局去重后排序'),output('核对去重后的数量','3')]},
    'make-executable': {context:'交接脚本需要由所有者运行，其他用户不能修改。将权限设为 750，并确认脚本内容未改变。',
      seed:{files:{'publish.sh':'echo '+token+'\n'}},solution:['chmod 750 publish.sh','cat publish.sh'],
      goals:[{type:'mode',path:'publish.sh',value:'750',label:'脚本权限为 750'},file('publish.sh','echo '+token+'\n','脚本内容保留'),output('核对脚本内容','echo '+token)]},
    'private-file': {context:'交接凭据只能由所有者读写。调整权限后读取凭据，确认批次仍然正确。',
      seed:{files:{'credentials.txt':token+'\n'}},solution:['chmod 600 credentials.txt','cat credentials.txt'],
      goals:[{type:'mode',path:'credentials.txt',value:'600',label:'凭据权限为 600'},file('credentials.txt',token+'\n','凭据内容保留'),output('核对凭据批次',token)]},
    'create-archive': {context:'把交接目录打包为 handoff.tar，再解包到 check 目录。归档和源文件都保留，读回恢复后的清单核对内容。',
      seed:{files:{'handoff/manifest.txt':token+'\n'},dirs:['check']},solution:['tar -cf handoff.tar handoff','tar -xf handoff.tar -C check','cat check/handoff/manifest.txt'],
      goals:[{type:'archive',path:'handoff.tar',entries:['handoff/manifest.txt'],label:'归档包含交接清单'},file('handoff/manifest.txt',token+'\n','源清单保留'),file('check/handoff/manifest.txt',token+'\n','清单恢复成功'),output('读回恢复后的清单',token,'check/handoff/manifest.txt')]},
    'find-logs': {context:'交接目录里混有日志、文本和备份。只查找后缀为 .log 的文件，把完整查找结果保存到 found.txt；保留所有原件。',
      seed:{files:{'handoff/current.log':token+'\n','handoff/old/previous.log':'old\n','handoff/current.log.bak':'backup\n','handoff/readme.txt':'note\n'}},
      solution:['find handoff -name "*.log" > found.txt'],goals:[file('found.txt','handoff/current.log\nhandoff/old/previous.log\n','只保存两份日志路径'),file('handoff/current.log',token+'\n','当前日志保留'),file('handoff/old/previous.log','old\n','旧日志保留')]},
    'tee-report': {context:'从 batch.log 中只提取以 ERROR 开头的行，同时在终端显示并保存到 failures.txt，最后输出 failures.txt 的行数。',
      seed:{files:{'batch.log':rows}},solution:['grep "^ERROR " batch.log | tee failures.txt','wc -l < failures.txt'],
      goals:[file('failures.txt',errors.join('\n')+'\n','错误行已保存'),output('同时显示错误行',errors.join('\n'),'failures.txt'),output('核对保存的行数',String(errors.length))]},
    'csv-column': {context:'contacts.csv 使用冒号分隔。提取第 1、3 列，保持原顺序和冒号分隔符，保存到 contacts.txt，再在终端读回核对。',
      seed:{files:{'contacts.csv':'Mina:ops:'+n+'\nAri:dev:'+(n+1)+'\n'}},solution:['cut -d : -f 1,3 contacts.csv > contacts.txt','cat contacts.txt'],
      goals:[file('contacts.txt','Mina:'+n+'\nAri:'+(n+1)+'\n','提取姓名与编号'),output('读回并核对两列','Mina:'+n+'\nAri:'+(n+1),'contacts.txt')]}
  };
  const template = templates[source.id];
  if (!template) return source;
  const lesson = clarifyGoalLabels({...source,...template,steps:[template.context],coreSolution:[...template.solution],flowBefore:[],flowAfter:[],flowAssets:[],
    reviewCommands:[],hints:['先读清目标，确认输入文件、筛选范围和需要保留的内容。','可以先观察，再处理，最后读回核对结果。','一种可行的路径：\n'+template.solution.join('\n')]});
  prepareJudging(lesson,createLessonShell(Shell,seedState,lesson));
  return lesson;
}
