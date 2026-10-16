// Variants keep the same objective skill ID; filenames, data and deliverables change.
// Supporting commands are not credited as separate skills without their own assessment.
const output = (label, exact, requiresPath) => ({type:'output',label,exact,code:0,...(requiresPath ? {requiresPath} : {})});
const file = (path,text,label) => ({type:'file',path,text,label});
const skillLabels = {
  'where-am-i':'确认当前位置', 'look-around':'查看指定目录', 'hidden-profile':'查找隐藏文件',
  'enter-projects':'切换并核对目录', 'parent-directory':'使用上级路径', 'directory-map':'查看目录结构',
  'lookup-copy':'查阅命令参数', 'read-welcome':'读取文本内容', 'copy-note':'复制并核对文件',
  'rename-note':'识别并重命名文件', 'preview-log':'读取文件开头', 'latest-error':'读取文件末尾',
  'filter-errors':'按条件筛选文本', 'count-lines':'统计文本行数', 'numeric-sort':'按数值排序',
  'unique-names':'排序并去重', 'csv-column':'提取指定字段', 'make-executable':'设置执行权限'
};
export const skillLabel = lesson => skillLabels[lesson.id] || lesson.title;
export function createReviewLesson(source, variant) {
  const n = variant % 7 + 2, token = 'batch-' + (variant % 97 + 1), folder = 'handoff';
  const rows = Array.from({length:n},(_,i)=>`${i%2 ? 'ERROR' : 'INFO'} job-${i+1}`).join('\n')+'\n';
  const errors = rows.trim().split('\n').filter(line=>line.startsWith('ERROR'));
  const first = variant % 2 ? 3 : 2;
  const values = [n*11,2,n,10,n*11];
  const templates = {
    'where-am-i': {context:'确认出发位置，再进入交接目录，输出新的完整路径并留在那里。',
      seed:{dirs:[folder]},solution:['pwd','cd '+folder,'pwd'],
      goals:[output('输出出发位置','/home/learner'),{type:'cwd',path:'/home/learner/'+folder,label:'留在交接目录'},output('输出交接目录的完整路径','/home/learner/'+folder)]},
    'look-around': {context:'先查看交接目录，找出本批清单；再查看归档目录，确认上一批清单仍在。无需进入目录。',
      seed:{files:{[folder+'/'+token+'.txt']:'ready\n','archive/previous.txt':'done\n'}},
      solution:['ls '+folder,'ls archive'],goals:[{type:'output',includes:token+'.txt',code:0,label:'目录列表包含本批清单'},{type:'output',includes:'previous.txt',code:0,label:'目录列表包含上一批清单'}]},
    'hidden-profile': {context:'交接目录和归档目录各有一份隐藏配置。分别列出全部条目，找到两份配置，同时保留普通文件的显示。',
      seed:{files:{[folder+'/.secret-'+token]:'active\n',[folder+'/visible.txt']:'ready\n','archive/.previous':'old\n','archive/visible.txt':'saved\n'}},
      solution:['ls -a '+folder,'ls -a archive'],goals:[{type:'output',includes:'.secret-'+token,code:0,label:'显示本批隐藏配置'},{type:'output',includes:'.previous',code:0,label:'显示归档隐藏配置'},{type:'output',includes:'visible.txt',code:0,label:'同时显示普通文件'}]},
    'enter-projects': {context:'进入交接目录中的本批子目录，输出完整路径，最终留在该目录。',
      seed:{dirs:[folder+'/'+token]},solution:['cd '+folder+'/'+token,'pwd'],goals:[{type:'cwd',path:'/home/learner/'+folder+'/'+token,label:'留在本批子目录'},output('核对完整路径','/home/learner/'+folder+'/'+token)]},
    'parent-directory': {context:'你已在交接目录的本批子目录中。先返回交接目录，再返回主目录，每次都输出完整路径核对。',
      seed:{cwd:'/home/learner/'+folder+'/'+token,dirs:[folder+'/'+token]},solution:['cd ..','pwd','cd ..','pwd'],goals:[output('核对交接目录路径','/home/learner/'+folder),output('核对主目录路径','/home/learner'),{type:'cwd',path:'/home/learner',label:'最终留在主目录'}]},
    'read-welcome': {context:'交接清单和归档确认单分别写了什么？先读清单，再读取确认单，核对批次一致。',
      seed:{files:{'manifest.txt':token+' ready\n','receipt.txt':token+' accepted\n'}},solution:['cat manifest.txt','cat receipt.txt'],goals:[output('读取交接清单',token+' ready'),output('读取归档确认单',token+' accepted')]},
    'copy-note': {context:'将交接清单备份到副本，读回核对批次；原清单内容必须保留。',
      seed:{files:{'manifest.txt':token+' approved\n'}},solution:['cp manifest.txt manifest.bak','cat manifest.bak'],
      goals:[file('manifest.bak',token+' approved\n','副本内容正确'),file('manifest.txt',token+' approved\n','原清单仍保留'),output('读回副本核对批次',token+' approved','manifest.bak')]},
    'rename-note': {context:'两份清单的内容不同。找出写着 approved 的那份，将它改名为 final.txt；另一份保留。最后读取 final.txt 核对。',
      seed:{files:{'manifest-a.txt':token+' '+(variant%2?'approved':'draft')+'\n','manifest-b.txt':token+' '+(variant%2?'draft':'approved')+'\n'}},
      solution:['cat manifest-a.txt manifest-b.txt','mv manifest-'+(variant%2?'a':'b')+'.txt final.txt','cat final.txt'],
      goals:[file('final.txt',token+' approved\n','最终清单内容正确'),file('manifest-'+(variant%2?'b':'a')+'.txt',token+' draft\n','草稿仍保留'),{type:'absent',path:'manifest-'+(variant%2?'a':'b')+'.txt',label:'旧名称已移除'},output('读回最终清单',token+' approved','final.txt')]},
    'preview-log': {context:`查看本批日志的前 ${first} 行，再将第一行保存到 opening.txt，读回核对。`,seed:{files:{'batch.log':rows}},
      solution:[`head -n ${first} batch.log`,'head -n 1 batch.log > opening.txt','cat opening.txt'],
      goals:[output('输出指定的开头记录',rows.trim().split('\n').slice(0,first).join('\n')),file('opening.txt','INFO job-1\n','只保存首行'),output('读回首行','INFO job-1','opening.txt')]},
    'latest-error': {context:`只输出本批日志的最后 ${first} 行，将同样内容保存到 closing.txt，再读回核对。`,seed:{files:{'batch.log':rows}},
      solution:[`tail -n ${first} batch.log`,`tail -n ${first} batch.log > closing.txt`,'cat closing.txt'],
      goals:[file('closing.txt',rows.trim().split('\n').slice(-first).join('\n')+'\n','保存末尾指定条数'),output('输出并核对最后的记录',rows.trim().split('\n').slice(-first).join('\n'))]},
    'filter-errors': {context:'日志中有大小写不同的错误级别，也有正文提到 ERROR 的普通记录。只提取以 ERROR 开头的错误行，不区分大小写，保存到 failures.txt；再输出匹配行数。',
      seed:{files:{'batch.log':rows+'INFO mentions ERROR\nerror late-job\n'}},solution:['grep -i "^ERROR " batch.log > failures.txt','grep -ic "^ERROR " batch.log'],
      goals:[file('failures.txt',[...errors,'error late-job'].join('\n')+'\n','只保存错误级别记录'),output('核对错误记录数',String(errors.length+1))]},
    'count-lines': {context:'本批日志最后一行没有换行。分别输出换行符数量与错误记录数量，留意两者的区别。',
      seed:{files:{'batch.log':rows+'ERROR final-job'}},solution:['wc -l batch.log','grep "^ERROR " batch.log | wc -l'],
      goals:[{type:'output',includes:String(n)+' batch.log',code:0,label:'核对原日志换行符数量'},output('核对筛选后的错误记录数',String(errors.length+1))]},
    'numeric-sort': {context:'将本批数量从大到小排列，保留重复值，保存到 ranked.txt；另外只输出最大的三个数量。',seed:{files:{'quantities.txt':values.join('\n')+'\n'}},
      solution:['sort -nr quantities.txt > ranked.txt','head -n 3 ranked.txt'],goals:[file('ranked.txt',[...values].sort((a,b)=>b-a).join('\n')+'\n','按数值降序保留重复项'),output('输出前三个数量',[...values].sort((a,b)=>b-a).slice(0,3).join('\n'))]},
    'unique-names': {context:'名单里同一个名字分散出现。将全部名字排序去重，保存到 roster.txt，再输出去重后的名字数量。',seed:{files:{'attendees.txt':'Mina\nAri\nMina\n'+token+'\nAri\n'}},
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
    'tee-report': {context:'本批日志中只需要错误级别的行。将它们同时显示并保存到 failures.txt，最后输出保存文件的行数。',
      seed:{files:{'batch.log':rows}},solution:['grep "^ERROR " batch.log | tee failures.txt','wc -l < failures.txt'],
      goals:[file('failures.txt',errors.join('\n')+'\n','错误行已保存'),output('同时显示错误行',errors.join('\n'),'failures.txt'),output('核对保存的行数',String(errors.length))]},
    'csv-column': {context:'交接表使用冒号分隔。提取第一列和第三列，保持原顺序与分隔符，保存到 contacts.txt，再读回核对。',
      seed:{files:{'contacts.csv':'Mina:ops:'+n+'\nAri:dev:'+(n+1)+'\n'}},solution:['cut -d : -f 1,3 contacts.csv > contacts.txt','cat contacts.txt'],
      goals:[file('contacts.txt','Mina:'+n+'\nAri:'+(n+1)+'\n','提取姓名与编号'),output('读回并核对两列','Mina:'+n+'\nAri:'+(n+1),'contacts.txt')]}
  };
  const template = templates[source.id];
  if (!template) return source;
  return {...source,...template,steps:[template.context],coreSolution:[...template.solution],flowBefore:[],flowAfter:[],flowAssets:[],
    reviewCommands:[],hints:['先读清目标，确认输入文件、筛选范围和需要保留的内容。','可以先观察，再处理，最后读回核对结果。','一种可行的路径：\n'+template.solution.join('\n')]};
}
