import { prepareJudging } from './judging.mjs?v=20261020-judging-1';
import { createReviewLesson } from './review-exercises.mjs?v=20261020-judging-1';
import { Shell, seedState } from './shell.mjs?v=20261020-judging-1';
import { createLessonShell } from './curriculum.mjs?v=20261020-judging-1';
import { clarifyGoalLabels } from './task-copy.mjs';

const HOME = '/home/learner';
const quote = value => '"' + value.replaceAll('"', '\\"') + '"';
const output = (exact, requiresPath) => ({type:'output',exact,code:0,label:'在终端输出以下内容，行序和文本须一致',...(requiresPath ? {requiresPath} : {})});
const file = (path,text,label) => ({type:'file',path,text,label:label || '使文件 '+path+' 的内容与目标内容完全一致'});
const keep = (path,text) => ({...file(path,text,'保留文件 '+path+'，内容不变'),preserve:true});
const read = (path,text) => ({...output(text.trim(),path),label:'读回 '+path+'，在终端输出指定内容'});
const cwd = path => ({type:'cwd',path,label:'完成后停留在目录 '+path});
const absent = path => ({type:'absent',path,label:'删除 '+path+'，使该路径不再存在'});
const rows = values => values.join('\n')+'\n';

// The round is frozen in the saved review, independent of later memory updates.
// Rotate conditions, not lesson names or skill IDs; supporting tools earn no separate credit.
export function reviewRound(record) {
  return Math.max(0,(record?.attempts || 1)-1);
}
export function reviewRounds(queue, records) {
  return Object.fromEntries(queue.map(id=>[id,reviewRound(records[id])]));
}
export function createReviewVariant(source, variant, round = 0, translate = value => value) {
  const say = (key, values={}) => translate(key).replace(/\{(\w+)\}/g,(_,name)=>String(values[name]));
  const mode = round % 3, n = variant % 5 + 3, batch = 'batch-'+variant;
  const dir = ['handoff','delivery','archive'][mode], target = ['api','web','ops'][mode];
  let task, principle, instruction;
  const deliver = (files,solution,goals,extra={}) => ({seed:{files,...extra},solution,goals});
  const report = (files,command,text,extraGoals=[],extra={}) => deliver(files,[command+' > result.txt','cat result.txt'],[
    file('result.txt',text),read('result.txt',text),...extraGoals],extra);
  const numbers = [n*10,2,n,10,2,-n], log = rows(Array.from({length:n+3},(_,i)=>i%3===0 ? 'ERROR job-'+i : 'INFO job-'+i));
  switch(source.id) {
    case 'where-am-i': case 'enter-projects': case 'success-chain': {
      const start = mode===0 ? HOME : HOME+'/staging';
      const end = HOME+'/'+(source.id==='enter-projects'?'projects/'+target:dir+'/'+(source.id==='success-chain'?'release':target));
      const relative=end.slice(HOME.length+1);
      task=deliver({},['pwd','cd '+quote(mode===0 ? relative : mode===1 ? '../'+relative : end),'pwd'],[
        {...output(start),label:translate('输出出发位置的完整路径')},cwd(end),{...output(end),label:translate('切换目录后，输出新位置的完整路径')}],{cwd:start,dirs:['staging',relative,dir+'/other']});
      principle='相对路径从当前位置出发；绝对路径从 / 出发。'; break;
    }
    case 'parent-directory': {
      const depth=mode+1, relative=[dir,target,'nested'].slice(0,depth).join('/'), start=HOME+'/'+relative, end=HOME;
      task=deliver({},['pwd','cd '+Array(depth).fill('..').join('/'),'pwd'],[{...output(start),label:translate('输出出发位置的完整路径')},cwd(end),{...output(end),label:translate('切换目录后，输出新位置的完整路径')}],{cwd:start,dirs:[relative]});
      principle='先确认起点，再数清需要返回几层。'; break;
    }
    case 'look-around': case 'hidden-profile': case 'directory-map': {
      const hidden=source.id==='hidden-profile', command=source.command;
      const input=dir+'/'+target, name=hidden?'.settings-'+batch:batch+'.txt';
      task=deliver({[input+'/'+name]:'ready\n',[input+'/visible.txt']:'keep\n',[dir+'/other/'+name]:'other\n'},[
        command+(hidden?' -a':'')+' '+input,command+(hidden?' -a':'')+' '+dir+'/other'],[
        {type:'output',includes:name,code:0,label:'在终端输出结果，须包含「'+name+'」'},
        {type:'output',includes:mode===2?'other':hidden?'.':'visible.txt',code:0,label:'在终端输出结果，须包含「'+(mode===2?'other':hidden?'.':'visible.txt')+'」'}]);
      if(mode===2) task.solution[1]=command+(hidden?' -a':'')+' '+dir;
      principle='核对目标目录，别把同名文件的不同位置混在一起。'; break;
    }
    case 'create-workspace': case 'new-readme': case 'starter-delivery': case 'batch-arguments': {
      const paths=[dir+'/'+target+'/README.txt',dir+'/team notes/README.txt'];
      const dirs=paths.map(path=>path.slice(0,path.lastIndexOf('/')));
      const create=source.command==='mkdir' ? ['mkdir -p '+dirs.map(quote).join(' '),...paths.map(path=>'touch '+quote(path))]
        : source.command==='xargs' ? ['xargs touch < files.txt'] : ['touch '+paths.map(quote).join(' ')];
      task=deliver({'files.txt':paths.map(quote).join(' ')+'\n',[dir+'/keep.txt']:batch+'\n'},[...create,'ls '+quote(dirs[0])],
        [...paths.map(path=>file(path,'')),keep(dir+'/keep.txt',batch+'\n'),{type:'output',includes:'README.txt',code:0,label:'在目录列表中确认 README.txt'}],source.command==='mkdir'?{}:{dirs});
      principle='带空格的路径需要作为一个完整参数传入。'; break;
    }
    case 'copy-note': case 'rename-note': case 'move-download': case 'recursive-backup': case 'copy-project': {
      const moving=source.command==='mv', recursive=['recursive-backup','copy-project'].includes(source.id);
      const input=dir+'/candidate '+(mode===1?'b':'a')+'.txt', other=dir+'/candidate '+(mode===1?'a':'b')+'.txt', dest='release/final.txt';
      const text=batch+' approved\n', draft=batch+' draft\n';
      if(recursive) {
        const files={[dir+'/docs/brief.txt']:text,[dir+'/.settings']:'active\n',[dir+'-other/keep.txt']:draft};
        task=deliver(files,['cp -r '+dir+' release','cat release/docs/brief.txt'],[
          file('release/docs/brief.txt',text),file('release/.settings','active\n'),...Object.entries(files).map(([p,t])=>keep(p,t)),read('release/docs/brief.txt',text)]);
      } else task=deliver({[input]:text,[other]:draft},['cat '+quote(input),'cat '+quote(other),'mkdir -p release',(moving?'mv ':'cp ')+quote(input)+' '+dest,'cat '+dest],[
        {...output(text.trim()),label:say('先读取 {path}，确认内容为 {text}',{path:input,text:text.trim()}),displayOrder:-1},
        file(dest,text,(moving?'将 ':'将 ')+input+(moving?' 重命名为 ':' 复制为 ')+dest+'，内容不变'),moving?absent(input):keep(input,text),keep(other,draft),read(dest,text)]);
      principle='先辨认原件与草稿，再处理；复制需要保留原件，移动需要核对旧路径。'; break;
    }
    case 'cleanup-temp': case 'clean-workspace': case 'precise-temp-cleanup': case 'batch-files': {
      const input=dir+'/'+target+'.tmp', other=dir+'/other.tmp', deep=dir+'/sub/deep/keep.tmp', backup='before.txt';
      const files={[input]:batch+'\n',[other]:'other\n',[input+'.bak']:'backup\n',[deep]:'retain\n'};
      let action='rm '+input;
      if(source.command==='find') action='find '+dir+' -maxdepth 1 -type f -name "'+target+'.tmp" -delete';
      if(source.command==='xargs') { files['cleanup-list.txt']=input+'\n';action='xargs rm < cleanup-list.txt'; }
      task=deliver(files,['cp '+input+' '+backup,action],[
        {...file(backup,batch+'\n','删除前，将 '+input+' 备份到 '+backup),displayOrder:-1,sourcePath:input},absent(input),
        ...Object.entries(files).filter(([path])=>path!==input).map(([p,t])=>keep(p,t))]);
      principle='先备份，再缩小匹配范围；相似后缀和更深层的文件也要保留。'; break;
    }
    case 'remove-empty': {
      const empty=dir+'/empty', kept=dir+'/keep';
      task=deliver({[kept+'/note.txt']:batch+'\n'},['rmdir '+empty],[absent(empty),keep(kept+'/note.txt',batch+'\n')],{dirs:[empty]});
      principle='只移除空目录，非空目录里的资料必须保留。'; break;
    }
    case 'write-note': case 'append-note': case 'format-greeting': {
      const before=batch+' started\n', after=batch+' ready\n', text=source.id==='append-note'?before+after:after;
      const command=source.command==='printf' ? 'printf "%s\\n" "'+batch+' ready" > result.txt' : 'echo "'+batch+' ready" '+(source.id==='append-note'?'>>':'>')+' result.txt';
      task=deliver(source.id==='append-note'?{'result.txt':before}:{},[...(source.id==='append-note'?['cat result.txt']:[]),command,'cat result.txt'],[
        ...(source.id==='append-note'?[{...read('result.txt',before),displayOrder:-1}]:[]),file('result.txt',text),read('result.txt',text)]);
      principle='覆盖与追加会产生不同结果，注意保留原来的行。'; break;
    }
    case 'read-welcome': case 'read-with-less': case 'read-with-more': {
      const input=dir+'/brief.txt', text=batch+' '+target+' ready\n';
      task=report({[input]:text,[dir+'/brief.txt.bak']:'outdated\n'},source.command+' '+input,text,[keep(input,text),keep(dir+'/brief.txt.bak','outdated\n')]);
      instruction=say('读取 {input} 的完整内容，保存到 {output}，保留原件。',{input,output:'result.txt'});
      principle='核对目标目录，别把同名文件的不同位置混在一起。'; break;
    }
    case 'preview-log': case 'latest-error': {
      const count=[2,3,4][mode], coreCount=source.command==='head'?2:1, lines=log.trim().split('\n'), text=rows(source.command==='head'?lines.slice(0,count):lines.slice(-count));
      task=report({'batch.log':log},source.command+' -n '+count+' batch.log',text,[keep('batch.log',log)]);
      instruction=say('将 {input} 的{edge} {count} 行保存到 {output}，保持原顺序。',{input:'batch.log',edge:translate(source.command==='head'?'开头':'末尾'),count,output:'result.txt'});
      task.solution.unshift(source.command+' -n '+coreCount+' batch.log');
      task.goals.unshift({...output(rows(source.command==='head'?lines.slice(0,coreCount):lines.slice(-coreCount)).trim()),label:say('在终端输出 {input} 的{edge} {count} 行。',{input:'batch.log',edge:translate(source.command==='head'?'开头':'末尾'),count:coreCount})});
      principle='先确定从开头还是末尾读取，再核对需要的行数。'; break;
    }
    case 'filter-errors': case 'save-errors': case 'incident-report': case 'error-line-number': case 'tee-report': {
      const input=log+'INFO mentions ERROR\nerror late-job\nERRORISH decoy\n';
      const pattern=mode===2?'^error ':'^ERROR ', insensitive=mode===0;
      const flags=(insensitive?'i':'')+(source.id==='error-line-number'?'n':'');
      const selected=input.trim().split('\n').map((line,i)=>({line,i})).filter(({line})=>new RegExp(pattern,insensitive?'i':'').test(line));
      const text=rows(selected.map(({line,i})=>source.id==='error-line-number'?(i+1)+':'+line:line));
      const filter='grep '+(flags?'-'+flags+' ':'')+'"'+pattern+'" batch.log';
      task=source.command==='tee'?deliver({'batch.log':input},[filter+' | tee result.txt','wc -l < result.txt'],[
        file('result.txt',text),read('result.txt',text),output(String(selected.length)),keep('batch.log',input)])
        :report({'batch.log':input},filter,text,[keep('batch.log',input)]);
      instruction=say('从 {input} 筛选以「{prefix}」开头的记录{caseRule}，保存到 {output}。',{input:'batch.log',prefix:pattern.slice(1),caseRule:translate(insensitive?'（忽略大小写）':'（区分大小写）'),output:'result.txt'})+(source.id==='error-line-number'?translate('每行前标注原始行号。'):'');
      principle='区分级别字段与正文提及，留意大小写和完整前缀。'; break;
    }
    case 'count-lines': {
      const text=log+(mode===1?'ERROR final-job':'');
      const value=mode===2 ? String(text.trim().split('\n').filter(line=>line.startsWith('ERROR ')).length) : String((text.match(/\n/g)||[]).length);
      task=report({'batch.log':text},mode===2?'grep "^ERROR " batch.log | wc -l':'wc -l < batch.log',value+'\n',[keep('batch.log',text)]);
      instruction=say('统计 {input} 的{unit}，只将数量保存到 {output}。',{input:'batch.log',unit:translate(mode===2?'ERROR 记录数量':'换行符数量'),output:'result.txt'});
      principle='换行符数量、记录数量和字节数是不同的统计口径。'; break;
    }
    case 'numeric-sort': case 'unique-names': case 'developer-sort': {
      const numeric=source.id==='numeric-sort', values=numeric?numbers:['Mina','Ari','Mina',batch,'Ari'];
      let ordered=numeric?[...values].sort((a,b)=>b-a):[...new Set(values)].sort();
      if(numeric&&mode===1) ordered=[...new Set(ordered)];
      if(numeric&&mode===2) ordered=ordered.slice(0,3);
      if(!numeric&&mode===1) ordered.reverse();
      const options=numeric?(mode===1?'-unr':'-nr'):(mode===1?'-ur':'-u');
      task=report({'items.txt':rows(values)},'sort '+options+' items.txt'+(numeric&&mode===2?' | head -n 3':''),rows(ordered),[keep('items.txt',rows(values))]);
      instruction=say('将 {input} 按{order}排列，{duplicates}，保存到 {output}。',{input:'items.txt',order:translate(numeric?'数值降序':(mode===1?'字母降序':'字母升序')),duplicates:translate(numeric?(mode===1?'全局去重':mode===2?'只保留前三项':'保留重复项'):'全局去重'),output:'result.txt'});
      principle='数字排序与字典排序不同；是否去重、升序或降序都由目标决定。'; break;
    }
    case 'csv-column': case 'developer-column': {
      const sep=[',',':',';'][mode], values=[['Mina','ops',String(n)],['Ari','dev',String(n+1)],['Kai','ops',String(n+2)]];
      const input=rows(values.map(row=>row.join(sep))), text=rows(values.map(row=>[row[0],row[mode===1?1:2]].join(sep)));
      task=report({'contacts.txt':input},'cut -d "'+sep+'" -f 1,'+(mode===1?'2':'3')+' contacts.txt',text,[keep('contacts.txt',input)]);
      instruction=say('从 {input} 提取第 {fields} 列，以「{separator}」分隔，保存到 {output}，保持原顺序。',{input:'contacts.txt',fields:mode===1?'1,2':'1,3',separator:sep,output:'result.txt'});
      principle='先确认分隔符和字段编号，再保持原始行序。'; break;
    }
    case 'developer-list': {
      const input='name,role,team\nMina,developer,api\ndeveloper,admin,ops\nAri,developer-intern,web\nKai,developer,ops\n';
      const role=['developer','admin','developer-intern'][mode], text=rows(input.trim().split('\n').filter(line=>line.split(',')[1]===role));
      task=report({'contacts.csv':input},'grep ",'+role+'," contacts.csv',text,[keep('contacts.csv',input)]);
      instruction=say('从 {input} 筛选角色恰好为 {role} 的完整记录，保存到 {output}，保持原顺序。',{input:'contacts.csv',role,output:'result.txt'});
      principle='匹配指定字段的完整值，别把姓名或较长角色名一起选中。'; break;
    }
    case 'uppercase': {
      const input=batch+' Ready\n', text=mode===1?input.toLowerCase():input.toUpperCase();
      task=report({'message.txt':input},'tr '+(mode===1?'A-Z a-z':'a-z A-Z')+' < message.txt',text,[keep('message.txt',input)]);
      instruction=say('将 {input} 转为{letterCase}，保存到 {output}。',{input:'message.txt',letterCase:translate(mode===1?'小写':'大写'),output:'result.txt'});
      principle='确认转换方向，并通过标准输入读取原文。'; break;
    }
    case 'number-sequence': case 'step-sequence': {
      const simple=source.id==='number-sequence',start=simple?1:n*3,step=simple?1:-[1,2,3][mode],count=simple?5:n+1;
      const end=start+step*(count-1), values=Array.from({length:count},(_,i)=>start+i*step), sep=simple?(mode===1?',':'\n'):',';
      task=report({},'seq '+(sep===','?'-s , ':'')+start+' '+step+' '+end,values.join(sep)+'\n');
      instruction=say('生成从 {start} 到 {end}、步长为 {step} 的整数序列，以{separator}分隔，保存到 {output}。',{start,end,step,separator:translate(sep===','?'逗号':'换行'),output:'result.txt'});
      principle='先确定起点、步长、终点；下降序列需要负步长。'; break;
    }
    case 'reverse-log-lines': case 'reverse-characters': case 'number-blank-lines': case 'wrap-long-line': {
      const input=source.command==='fold'?batch+'-ready\n':batch+' alpha\n\n'+batch+' beta\n';
      let command=source.command+' input.txt', text;
      if(source.command==='tac') text=rows(input.slice(0,-1).split('\n').reverse());
      if(source.command==='rev') text=rows(input.slice(0,-1).split('\n').map(line=>[...line].reverse().join('')));
      if(source.command==='nl') { command='nl -ba input.txt';text=rows(input.slice(0,-1).split('\n').map((line,i)=>String(i+1).padStart(6)+'\t'+line)); }
      if(source.command==='fold') { const width=n;command='fold -w '+width+' input.txt';text=rows(input.trim().match(new RegExp('.{1,'+width+'}','g'))); }
      task=report({'input.txt':input},command,text,[keep('input.txt',input)]);
      instruction=say('处理 {input}：{operation}，保存到 {output}。',{input:'input.txt',operation:source.command==='fold'?say('按每行最多 {width} 个字符折行',{width:n}):translate({tac:'按行倒序',rev:'逐行反转字符',nl:'逐行编号（空行也编号）'}[source.command]),output:'result.txt'});
      principle='区分行的顺序、行内字符和空行；核对输出格式。'; break;
    }
    case 'common-names': case 'name-intersection-report': {
      const a=rows(['Ari',...Array(mode+1).fill('Kai'),'Mina',batch].sort());
      const b=rows(['Bo',...Array(mode+2).fill('Kai'),batch].sort());
      const shared=rows([...Array(mode+1).fill('Kai'),batch].sort());
      task=report({'team-a.txt':a,'team-b.txt':b},'comm -12 team-a.txt team-b.txt',shared,[keep('team-a.txt',a),keep('team-b.txt',b)]);
      if(source.id==='name-intersection-report') {
        task.solution.push('comm -23 team-a.txt team-b.txt > only-a.txt');
        task.goals.push(file('only-a.txt','Ari\nMina\n'));
      }
      instruction=say('将 {first} 与 {second} 的共同名字保存到 {output}，重复次数取较少的一份。',{first:'team-a.txt',second:'team-b.txt',output:'result.txt'});
      principle='两份输入必须先有序；共有行和单侧独有行使用不同的列。'; break;
    }
    case 'extract-roles': {
      const input='name,role,team\n'+rows(Array.from({length:n},(_,i)=>'person-'+i+',developer,api'))+'developer,admin,ops\nAri,developer-intern,web\n';
      task=report({'contacts.csv':input},`grep -v "^name," contacts.csv | awk -F , '{print $2}' | sort | uniq -c`,'1 admin\n'+n+' developer\n1 developer-intern\n',[keep('contacts.csv',input)]);
      instruction=say('统计 {input} 的角色列，排除表头，按角色排序，将“人数 角色”保存到 {output}。',{input:'contacts.csv',output:'result.txt'});
      principle='先选对列，再排序与计数；姓名中的相同词不是角色。'; break;
    }
    case 'disable-debug': {
      const before='PORT='+n+'\nDEBUG=true\n# DEBUG=true\nDEBUG_HINT=DEBUG=true\n', after=before.replace('\nDEBUG=true\n','\nDEBUG=false\n');
      task=deliver({'app.conf':before,'app.conf.bak':before},['sed -i "s/^DEBUG=true$/DEBUG=false/" app.conf','cat app.conf'],[
        file('app.conf',after,'将 app.conf 的 DEBUG 改为 false，保留其他行'),keep('app.conf.bak',before),read('app.conf',after)]);
      principle='只修改完整配置项，保留注释、相似键和备份文件。'; break;
    }
    case 'adjacent-duplicates': {
      const input=rows([...Array(n).fill('Ari'),'Bo',...Array(mode+2).fill('Kai')]);
      task=report({'sorted.txt':input},'uniq -cd sorted.txt',n+' Ari\n'+(mode+2)+' Kai\n',[keep('sorted.txt',input)]);
      instruction=say('只统计 {input} 中重复的名字，将“次数 名字”保存到 {output}。',{input:'sorted.txt',output:'result.txt'});
      principle='uniq 只合并相邻重复项，单次出现的名字不算重复。'; break;
    }
    case 'merge-columns': {
      const sep=[',',':',';'][mode], names='Mina\nAri\nKai\n',roles='ops\ndev\n',teams='api\nweb\nops\n';
      task=report({'names.txt':names,'roles.txt':roles,'teams.txt':teams},'paste -d "'+sep+'" names.txt roles.txt teams.txt',
        rows([['Mina','ops','api'],['Ari','dev','web'],['Kai','','ops']].map(row=>row.join(sep))),[keep('names.txt',names),keep('roles.txt',roles),keep('teams.txt',teams)]);
      instruction=say('按行合并 {inputs}，以「{separator}」分隔，缺少的字段留空，保存到 {output}。',{inputs:'names.txt, roles.txt, teams.txt',separator:sep,output:'result.txt'});
      principle='按行合并时保留空字段，不能让后面的列向前挤。'; break;
    }
    case 'expand-tabs': case 'compact-indent': {
      const width=[2,4,8][mode], input=source.command==='expand'?'\t'+batch+'\n':' '.repeat(width*2)+batch+'\n';
      const text=source.command==='expand'?' '.repeat(width)+batch+'\n':'\t\t'+batch+'\n';
      task=report({'indent.txt':input},source.command+' -t '+width+' indent.txt',text,[keep('indent.txt',input)]);
      instruction=say('将 {input} 的前导缩进转换为{indent}，制表位宽 {width} 列，保存到 {output}。',{input:'indent.txt',indent:translate(source.command==='expand'?'空格':'制表符'),width,output:'result.txt'});
      principle='制表位宽决定缩进，目标中的空格与制表符不能互换。'; break;
    }
    case 'path-components': case 'parent-path': {
      const path='/srv/'+dir+'/'+batch+'.log', command=source.command+' '+path+(source.command==='basename'&&mode===1?' .log':'');
      task=report({},command,(source.command==='dirname'?'/srv/'+dir:batch+(mode===1?'':'.log'))+'\n');
      instruction=say('从路径 {path} 提取{component}，保存到 {output}。',{path,component:translate(source.command==='dirname'?'父目录':mode===1?'不含 .log 后缀的文件名':'文件名'),output:'result.txt'});
      principle='区分文件名、后缀和父目录，无需创建或切换到这个路径。'; break;
    }
    case 'make-executable': case 'private-file': case 'release-ready': {
      const path=source.command==='chmod'?'publish.sh':'credentials.txt', text='echo '+batch+'\n', value=source.id==='private-file'?['600','640','400'][mode]:['750','700','755'][mode];
      task=deliver({[path]:text},['chmod '+value+' '+path,'cat '+path],[{type:'mode',path,value},keep(path,text),read(path,text)]);
      principle='分别考虑所有者、同组用户和其他用户需要哪些权限。'; break;
    }
    case 'private-default': {
      const value=['077','027','002'][mode];task=deliver({},['umask '+value,'touch new.txt','stat new.txt'],[
        {type:'setting',name:'umask',value},file('new.txt',''),{type:'mode',path:'new.txt',value:['600','640','664'][mode]}]);
      principle='umask 是去掉的权限位，不是新文件的最终权限。'; break;
    }
    case 'find-logs': {
      const suffix='log',depth=mode+1,input={[dir+'/current.'+suffix]:batch+'\n',[dir+'/sub/previous.'+suffix]:'old\n',[dir+'/current.'+suffix+'.bak']:'backup\n',[dir+'/sub/deep/keep.'+suffix]:'deep\n'};
      const text=rows([dir+'/current.'+suffix,...(depth>=2?[dir+'/sub/previous.'+suffix]:[]),...(depth===3?[dir+'/sub/deep/keep.'+suffix]:[])].sort());
      task=report(input,'find '+dir+' -maxdepth '+depth+' -type f -name "*.'+suffix+'" | sort',text,Object.entries(input).map(([p,t])=>keep(p,t)),{dirs:[dir+'/archive.'+suffix]});
      instruction=say('查找 {directory} 的 {depth} 层以内、后缀为 {suffix} 的文件，将相对路径按字母排序后保存到 {output}，一行一个。',{directory:dir,depth,suffix:'.'+suffix,output:'result.txt'});
      principle='同时限定类型、深度和后缀，别把同名目录或备份算进去。'; break;
    }
    case 'create-archive': case 'restore-archive': case 'archive-from-directory': case 'delivery-archive': case 'selective-archive': {
      const files={[dir+'/docs/brief.txt']:batch+'\n',[dir+'/config/app.conf']:'PORT='+n+'\n',[dir+'/.secret']:'private\n'};
      const selective=source.id==='selective-archive'||mode===2, entries=selective?['docs/brief.txt','config/app.conf']:[dir+'/docs/brief.txt',dir+'/config/app.conf',dir+'/.secret'];
      const pack='tar -cf bundle.tar '+(selective?'-C '+dir+' docs/brief.txt config/app.conf':dir);
      const solution=source.id==='restore-archive'?['tar -xf bundle.tar -C restored']: [pack,'tar -xf bundle.tar -C restored'];
      task=deliver(files,solution,[{type:'archive',path:'bundle.tar',entries,exact:selective,contents:Object.fromEntries(entries.map(entry=>[entry,files[selective?dir+'/'+entry:entry]]))},
        ...entries.map(entry=>file('restored/'+entry,files[selective?dir+'/'+entry:entry])),...Object.entries(files).map(([p,t])=>keep(p,t))],{dirs:['restored'],...(source.id==='restore-archive'?{setup:[pack]}:{})});
      principle='归档起点决定包内路径；恢复后核对内容，并保留源文件。'; break;
    }
    case 'stop-worker': case 'stop-by-name': case 'worker-pid': case 'process-list': case 'live-processes': {
      const name=['worker','renderer','importer'][mode], pid=700+variant%200, processes=[{pid:1,name:'systemd'},{pid:42,name:'bash'},{pid,name},{pid:pid+1,name:name+'-backup'}];
      if(['stop-worker','stop-by-name'].includes(source.id)) task=deliver({},[source.command==='kill'?'kill '+pid:'pkill "^'+name+'$"','ps aux'],[
        {type:'processAbsent',name},{type:'processPresent',name:name+'-backup'},{type:'processPresent',name:'bash'}],{processes});
      else {
        const command=source.command==='pgrep'?'pgrep "^'+name+'$"':source.command==='top'?'top | grep " '+name+'$"':'ps aux | grep " '+name+'$"';
        // Output goals for system fixtures are measured from the teaching shell below.
        task={seed:{processes},query:command};
      }
      principle='先确认目标进程，别误伤名字相似的备份进程。'; break;
    }
    case 'check-service-state': case 'service-status': case 'start-web': case 'boot-web': case 'delivery-start': case 'delivery-enable': case 'restart-enabled-service': {
      const name=['nginx','api','worker'][mode], starting=['start-web','delivery-start','restart-enabled-service'].includes(source.id), enabling=['boot-web','delivery-enable'].includes(source.id);
      const services={[name]:{active:!starting,enabled:!enabling},preview:{active:true,enabled:true}};
      task=deliver({},[...(starting?['systemctl start '+name]:enabling?['systemctl enable '+name]:[]),'systemctl '+(source.id==='check-service-state'?'is-active':'status')+' '+name],[
        {type:'service',name,property:'active',value:true},{type:'service',name,property:'enabled',value:true},
        {type:'service',name:'preview',property:'active',value:true},{type:'service',name:'preview',property:'enabled',value:true},
        output(source.id==='check-service-state'?'active':name+'.service\nActive: active (running)\nEnabled: true')],{services});
      principle='运行状态和开机启动是两回事，操作后分别核对。'; break;
    }
    case 'health-check': case 'download-config': case 'wget-download': case 'deploy-service': case 'robust-config-download': {
      const host='release-'+variant+'.test',url='https://'+host+(source.id==='health-check'||source.id==='wget-download'?'/health':'/config.json');
      const text=url.endsWith('/health')?batch+' ok\n':'{"port":'+(8000+n)+',"batch":"'+batch+'"}\n';
      const path='release/result.txt',before=batch+' previous\n';
      const command=source.command==='wget'?'wget -O '+path+' '+url:'curl -sSfL -o '+path+' '+url;
      task=deliver({'release/before.txt':before},[command,'cat '+path],[file(path,text),read(path,text),keep('release/before.txt',before)],{
        network:{host:'lab',ip:'192.0.2.10',dns:{[host]:'192.0.2.20'},urls:{[url]:text,[url+'.bak']:'outdated\n'}}});
      if(source.id==='robust-config-download') {
        const healthURL='https://'+host+'/health',healthText=batch+' ok\n';
        task.seed.network.urls[healthURL]=healthText;
        task.solution.splice(1,0,'curl -sSfL -o release/health.txt '+healthURL);
        task.goals.push(file('release/health.txt',healthText,say('从 {url} 下载到 {output}，保留已有备份。',{url:healthURL,output:'release/health.txt'})));
      }
      instruction=say('从 {url} 下载到 {output}，保留已有备份。',{url,output:path});
      principle='核对目标目录，别把同名文件的不同位置混在一起。'; break;
    }
    case 'install-client': case 'remove-package': {
      const name=['curl','wget','tree'][mode],remove=source.id==='remove-package';
      task=deliver({},['apt '+(remove?'remove':'install')+' '+name,'apt list --installed'],[
        {type:'package',name,present:!remove},{type:'package',name:'bash',present:true},{type:'package',name:'coreutils',present:true},
        {type:'output',includes:'coreutils/stable installed',code:0,label:'在终端输出结果，须包含「coreutils/stable installed」'}],{packages:['bash','coreutils',...(remove?[name]:[])]});
      principle='先观察输入与当前状态，再处理并核对结果。'; break;
    }
    case 'empty-log': {
      const path=dir+'/current.log',text=log;
      task=deliver({[path]:text,[path+'.bak']:text},['truncate -s 0 '+path,'cat '+path],[file(path,''),keep(path+'.bak',text),read(path,'')]);
      principle='先观察输入与当前状态，再处理并核对结果。'; break;
    }
    case 'locate-command': case 'lookup-copy': case 'available-tools': case 'identify-builtin': {
      const name=source.id==='identify-builtin'?['cd','export','unset'][mode]:['cp','mkdir','ls'][mode];
      const command=source.command==='help'?'help':source.command+' '+name;
      task={query:command,seed:{}};
      principle='先查询实际支持范围或用法，再选择参数。'; break;
    }
    case 'project-variable': case 'remove-variable': {
      const name=['PROJECT','RELEASE','BATCH'][mode], value=batch;
      task=deliver({},source.command==='unset'?['unset '+name,'env']:['export '+name+'='+value,'printenv '+name],[
        {type:'env',name,...(source.command==='unset'?{}:{value})},...(source.command==='unset'?[]:[output(value)])],
        source.command==='unset'?{env:{HOME,PWD:HOME,USER:'learner',SHELL:'/bin/bash',PATH:'/usr/bin:/bin',[name]:value}}:{});
      principle='区分变量的名称与值，删除变量后再检查环境。'; break;
    }
  }
  if (!task) {
    const queries={
      'disk-overview':['df -h',`df -h | tail -n 1 | awk '{print $4}'`,`df -h | tail -n 1 | awk '{print $5}'`],
      'memory-overview':['free -m | grep "^Mem:"',`free -m | grep "^Mem:" | awk '{print $4}'`,`free -m | grep "^Swap:" | awk '{print $2}'`],
      'kernel-version':['uname -r','uname -a','uname -s'],
      'machine-name':['hostname','hostname','hostname'],
      'calendar-date':['date +%F','date','date +%F'],
      'ip-address':['ip addr','ip addr | grep inet',`ip addr | grep inet | awk '{print $2}'`],
      'default-route':['ip route',`ip route | awk '{print $3}'`,`ip route | awk '{print $5}'`],
      'available-cpus':['nproc','nproc','nproc'],
      'cpu-topology':['lscpu','lscpu | grep -F "CPU(s):"','lscpu | grep "^Architecture:"'],
      'block-filesystems':['lsblk -f','lsblk','lsblk -f | grep ext4'],
      'mounted-root':['findmnt',`findmnt | tail -n 1 | awk '{print $2}'`,`findmnt | tail -n 1 | awk '{print $3}'`],
      'kernel-messages':['dmesg','dmesg | grep EXT4','dmesg | grep "Linux version"'],
      'listening-port':['ss -tulpn','ss -tulpn | grep 8080','ss -tulpn | grep nginx'],
      'memory-pressure':[`vmstat | tail -n 1 | awk '{print $15}'`,`vmstat | tail -n 1 | awk '{print $16}'`,`vmstat | tail -n 1 | awk '{print $14}'`],
      'all-environment':['env','env | grep "^SHELL="','env | grep "^PATH="'],
      'home-value':['printenv HOME','printenv SHELL','printenv PATH'],
      'dns-record':['dig review.test','dig review.test','dig review.test'],
      'lookup-host':['nslookup review.test','nslookup review.test','nslookup review.test'],
      'connectivity':['ping -c 2 review.test','ping -c 3 review.test','ping -c 4 review.test'],
      'service-error':['journalctl -u nginx -n 1','journalctl -u nginx -n 2','journalctl -u nginx -n 3']
    };
    if(queries[source.id]) {
      const query=queries[source.id][mode];
      const network={host:'lab-'+variant,ip:'192.0.2.'+(variant%100+10),dns:{'review.test':'192.0.2.'+(variant%100+120)},urls:{}};
      task={query,seed:{network,date:'2026-10-'+String(variant%28+1).padStart(2,'0'),services:{nginx:{active:true,enabled:mode===1}},
        files:{'/var/log/nginx.log':log}}};
      instruction=({
        'disk-overview':['显示磁盘空间表','只提取根文件系统的可用空间','只提取根文件系统的已用百分比'],
        'memory-overview':['显示内存统计行','只提取空闲内存数值','只提取交换空间总量'],
        'kernel-version':['只显示内核版本','显示完整系统信息','只显示内核名称'],
        'ip-address':['显示网卡地址信息','只显示 IPv4 地址所在行','只提取 IPv4 地址与掩码'],
        'default-route':['显示默认路由','只提取默认网关地址','只提取默认出口网卡'],
        'available-cpus':['查询可用 CPU 数量','查询可用 CPU 数量','查询可用 CPU 数量'],
        'cpu-topology':['显示 CPU 信息','只显示 CPU 数量所在行','只显示架构所在行'],
        'block-filesystems':['显示磁盘文件系统信息','显示磁盘设备结构','只显示 ext4 所在行'],
        'mounted-root':['显示根目录挂载信息','只提取挂载来源','只提取文件系统类型'],
        'kernel-messages':['显示内核日志','只显示 EXT4 记录','只显示内核版本记录'],
        'listening-port':['显示监听端口','只显示 8080 端口记录','只显示 nginx 端口记录'],
        'memory-pressure':['只提取 CPU 空闲百分比','只提取 I/O 等待百分比','只提取系统态 CPU 百分比'],
        'all-environment':['显示全部环境变量','只显示 SHELL 变量所在行','只显示 PATH 变量所在行'],
        'home-value':['只显示 HOME 的值','只显示 SHELL 的值','只显示 PATH 的值'],
        'service-error':['读取 nginx 最后一条日志','读取 nginx 最后两条日志','读取 nginx 最后三条日志'],
        'machine-name':['查询主机名','查询主机名','查询主机名'],
        'calendar-date':['只显示 ISO 格式日期','显示完整日期时间','只显示 ISO 格式日期']
      }[source.id]?.[mode] || (source.id==='connectivity'?say('向 {host} 发送 {count} 次探测',{host:'review.test',count:mode+2}):translate('查询 review.test 的 IPv4 地址')));
      instruction=say('{operation}，保存到 {output}。',{operation:translate(instruction),output:'result.txt'});
      principle='区分整张状态表与目标字段；先观察，再缩小范围。';
    }
  }
  if (!task) {
    // Keep specialist constraints (links, ownership, HTTP, byte formatting) intact.
    // Safe fixture substitutions retain byte lengths and ordering, including stat expectations.
    task=structuredClone(createReviewLesson(source,variant));
    const samples=Object.values(task.seed?.files || {}).join('\n');
    const pairs=[['alice','amy'+String(variant%100).padStart(2,'0')],['bob','b'+String(variant%100).padStart(2,'0')],['carol','cai'+String(variant%100).padStart(2,'0')]]
      .filter(([from])=>samples.includes(from));
    const transform=value=>typeof value==='string'?pairs.reduce((text,[from,to])=>text.replaceAll(from,to),value):Array.isArray(value)?value.map(transform):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([key,item])=>[key,transform(item)])):value;
    task=transform(task);
    principle='先观察输入与当前状态，再处理并核对结果。';
  }
  if(task.query) {
    const shell=createLessonShell(Shell,seedState,task), result=shell.execute(task.query);
    if(result.code) throw new Error('Review fixture failed: '+source.id+': '+result.stderr);
    task=report(task.seed.files || {},task.query,result.stdout,[],task.seed);
  }
  const lesson={...source,...task,id:source.id,title:source.title,command:source.command,commands:source.commands,
    reviewVariant:true,variantRound:round,variantPrinciple:principle};
  if(instruction) {
    const goal=lesson.goals.find(goal=>goal.type==='file' && !goal.preserve);
    if(goal) goal.label=instruction;
  }
  return finishReviewVariant(lesson,principle,translate);
}
export function finishReviewVariant(lesson, principle=lesson.variantPrinciple,translate=value=>value) {
  clarifyGoalLabels(lesson);
  lesson.theory=translate(principle);
  lesson.steps=lesson.goals.map(goal=>goal.label);
  lesson.context=lesson.steps.join('\n');
  lesson.coreSolution=[...lesson.solution];lesson.flowBefore=[];lesson.flowAfter=[];lesson.flowAssets=[];
  lesson.reviewCommands=[];
  lesson.hints=[translate(principle),translate('可以先观察，再处理，最后读回核对结果。'),'一种可行的路径：\n'+lesson.solution.join('\n')];
  prepareJudging(lesson,createLessonShell(Shell,seedState,lesson));
  return lesson;
}
