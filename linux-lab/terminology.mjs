import { tokenize } from './shell.mjs?v=20261020-judging-1';

// Explain concepts, never prescribe the task's command or disclose its answer.
export const terminology = {
  overwrite:['> · 输出重定向（Redirection）','> 把标准输出（命令的正常结果）写入文件；不存在则创建，已存在则先清空。这是 Shell 的功能，不限于 echo；printf、cat、ls 等命令的标准输出也能用 > 保存。'],
  append:['>> · 追加重定向','>> 把标准输出接在文件末尾，保留原内容；符号本身不会补换行。它不限于 echo；printf、cat、ls 等命令的标准输出也能用 >> 追加。'],
  input:['< · 输入重定向','< 把文件内容交给命令的标准输入，也就是命令读取数据的入口。'],
  pipe:['| · 管道（Pipe）','| 把前一条命令的标准输出交给后一条的标准输入；不会自动保存成文件。'],
  and:['&& · 条件执行','&& 只在前一条命令成功时执行后一条；Shell 用退出码 0 表示成功。'],
  or:['|| · 失败后执行','|| 只在前一条命令失败时执行后一条；非零退出码通常表示失败或特殊状态。'],
  sequence:['; · 顺序执行','; 分隔多条命令，依次执行，不根据前一条的成功与否决定是否继续。'],
  options:['选项与参数','- 开头的选项调整命令行为；文件名、路径、数量等参数告诉命令处理什么。负数不一定是选项。'],
  quotes:['引号','引号可把带空格的文本或路径作为一个参数；单引号保留字面内容，双引号中仍可展开变量。'],
  glob:['通配符（Wildcard）','* 匹配任意长度的名称片段，? 匹配一个字符；Shell 通常先展开未加引号的文件名通配符，再运行命令。'],
  variable:['$ · 变量展开','$NAME 或 ${NAME} 会替换为变量的值；单引号中的 $ 保持原样。'],
  shell:['Shell 与内建命令','Shell 是解释命令的程序；内建命令由 Shell 自己执行，外部命令则由独立程序执行。'],
  cwd:['当前工作目录（Working Directory）','终端此刻所在的目录，是相对路径的起点；浏览文件面板不会改变终端的工作目录。'],
  paths:['绝对路径与相对路径','绝对路径（Absolute Path）从根目录 / 开始；相对路径（Relative Path）从当前工作目录开始。. 表示当前目录，.. 表示父目录。'],
  home:['主目录与 ~','主目录是当前用户存放个人文件的目录；~ 是它的简写，当前用户的主目录是 /home/learner。'],
  hidden:['隐藏文件','名称以 . 开头的文件或目录默认不在普通目录列表中显示；隐藏不等于加密或禁止访问。'],
  path:['PATH 与可执行文件','PATH 是查找外部命令时依次搜索的目录列表；可执行文件是能作为程序运行的文件。'],
  recursive:['递归','递归处理会沿目录层级进入子目录，把里面的文件与更深层目录也纳入处理。'],
  stream:['标准流：stdin / stdout / stderr','标准输入（stdin）接收数据，标准输出（stdout）返回正常结果，标准错误（stderr）报告错误；普通管道默认只连接 stdout。'],
  newline:['行、换行符与字节','换行符标记一行的结束；最后一行没有换行符时，wc -l 不会计入它。字节是数据大小单位，不等于字符数。'],
  regex:['正则表达式（Regular Expression / Regex）','正则表达式描述文本匹配规则；^ 表示行首，$ 表示行尾。它与文件名通配符的规则不同。'],
  fields:['字段与分隔符','一行数据中的各列叫字段；逗号、冒号、Tab 等分隔符决定各字段的边界。'],
  sorting:['数值排序与字典排序','数值排序比较数字大小；字典排序比较字符顺序，所以 10 可能排在 2 前。'],
  adjacent:['相邻去重','相邻去重只合并连续出现的重复行；分散的重复项通常需要先排序再处理。'],
  tab:['Tab 与制表位','Tab 是制表符，会移动到下一个制表位；它占用的显示宽度取决于当前位置，不是固定几个空格。'],
  exit:['退出码（Exit Code）','退出码是命令返回给 Shell 的状态：0 通常表示成功，非零可能表示失败或特殊结果，如比较发现差异。'],
  permissions:['rwx 与权限数字（Permissions）','r（read，读）、w（write，写）、x（execute，执行）；三位权限数字依次对应所有者、所属组、其他用户，每位由 4、2、1 相加。'],
  directoryPermissions:['目录权限','目录的读权限允许列出名称，执行权限允许进入目录或通过它访问文件；增删条目通常需要同时有写和执行权限。'],
  owner:['所有者与用户组','所有者是文件归属的用户；用户组把多个用户归为一组，权限可分别授予所有者、组成员和其他人。'],
  umask:['umask · 权限掩码','umask 从新建文件或目录的默认权限中去掉指定权限位，不会修改已有文件，也不是简单的十进制相减。'],
  sudo:['sudo · 提权执行','sudo 按系统授权以其他用户身份执行命令，通常是管理员 root；它不是命令本身的一部分。'],
  links:['硬链接与符号链接','硬链接（Hard Link）为同一份文件数据增加名称；符号链接（Symbolic Link）保存目标路径，原目标被移动或删除后可能失效。'],
  archive:['归档与解包','归档把多个文件及目录结构装进一个包；解包把它们恢复到目录。归档不一定压缩，也不自动删除原件。'],
  compression:['压缩与解压','压缩把数据编码为通常更小的形式，解压恢复原内容；压缩与把多个文件打成一个归档是两件事。'],
  process:['进程（Process）与 PID','进程是正在运行的程序实例；PID（Process ID）是进程编号，同一个程序可以有多个进程。'],
  signal:['信号','信号用于通知进程采取动作；TERM 请求正常退出，KILL 强制终止，可能来不及保存数据。'],
  filesystem:['文件系统与磁盘用量','文件系统组织设备上的文件与目录；df 查看文件系统空间，du 汇总文件或目录的占用，两者统计范围不同。'],
  block:['块设备与分区','块设备按数据块读写，硬盘属于块设备；分区把磁盘划分成多个区域，文件系统通常建立在分区等块设备上。'],
  mount:['挂载与挂载点','挂载把文件系统连接到目录树；作为访问入口的目录叫挂载点。根目录 / 是整棵目录树的起点。'],
  memory:['内存与 Swap','内存供运行中的程序使用；Swap 是可用于换出内存页的交换空间，不等于额外的物理内存。'],
  kernel:['内核','内核是管理硬件、内存、进程等资源的系统核心；Linux 发行版还包含 Shell、工具和软件包。'],
  cpu:['CPU 与负载','CPU 执行程序指令；系统负载描述运行或等待运行的任务压力，不等同于 CPU 使用百分比。'],
  session:['登录会话与终端','会话记录一次登录及其活动；终端是输入命令和查看结果的界面，伪终端常用于图形终端窗口或远程连接。'],
  environment:['环境变量（Environment Variable）','环境变量保存 Shell 及其子进程使用的配置；export 把变量放入后续子进程的环境，unset 移除变量。'],
  network:['IP 地址与网卡','IP 地址标识网络接口在网络中的地址；网卡接口负责收发数据，一台主机可以有多个接口和地址。'],
  route:['路由与默认网关','路由决定数据包从哪里发出；没有更具体路由时，通常经默认网关转发到其他网络。'],
  port:['端口与监听','端口区分同一主机上的网络服务；监听表示程序正在等待接收发往该端口的连接或数据。'],
  dns:['DNS 与域名','域名是便于记忆的网络名称；DNS 把域名解析成 IP 等记录，A 记录对应 IPv4 地址。'],
  http:['HTTP 请求与响应','客户端发送 HTTP 请求，服务器返回状态码、响应头和正文；200 通常表示请求成功。'],
  headers:['响应头与正文','响应头描述响应状态、内容类型等元信息；正文才是传回的数据。只看响应头不会下载完整正文。'],
  service:['服务与开机启动','服务通常在后台提供功能；现在运行与开机自动启动是两个独立状态，需要分别设置和检查。'],
  package:['软件包与软件源','软件包包含程序及相关文件；软件源提供可安装的软件包和索引，包管理器负责安装、卸载与依赖管理。'],
  metadata:['文件元数据','元数据描述文件的路径、大小、权限、所有者等属性，与文件正文内容不同。'],
  fileType:['文件类型与扩展名','扩展名是文件名末尾的约定；真实文件类型还要检查文件内容，不能只看 .txt、.sh 等后缀。'],
  hostname:['主机名','主机名是机器在系统中的名称，不一定是完整域名，也不保证能通过 DNS 解析。'],
  dateFormat:['ISO 日期格式','ISO 日期用 YYYY-MM-DD 表示年、月、日；date 的 %F 表示这种日期格式。'],
  csv:['CSV · 逗号分隔值','CSV 用逗号分隔字段；简单表格可按逗号切列，字段自身含逗号或引号时需要专门的 CSV 解析。'],
  temporary:['临时文件与唯一名称','临时文件用于短期工作；唯一名称避免覆盖已有文件，模板中的 X 会由创建工具替换。'],
  history:['命令历史','命令历史记录执行过的命令文本；清屏不会清除历史，也不会撤销已经完成的操作。'],
  format:['格式占位符','格式占位符描述输出数据的形式：%s 表示字符串，%d 表示整数，\\n 表示换行。'],
  find:['查找深度与文件类型','查找深度从起点算起，起点深度为 0；文件类型用于区分普通文件、目录和符号链接，后缀不决定类型。']
};
const concepts = {
  pwd:['cwd','paths','home'],cd:['cwd','paths','home'],realpath:['paths','links'],ls:['hidden','paths'],tree:['paths','recursive'],
  man:['options'],help:['shell'],which:['path'],type:['shell','path'],mkdir:['paths','directoryPermissions'],touch:['metadata'],
  cp:['recursive'],mv:['paths'],rm:['recursive'],rmdir:['directoryPermissions'],cat:['stream'],head:['newline'],tail:['newline'],
  grep:['regex'],find:['find','glob'],wc:['newline'],sort:['sorting'],uniq:['adjacent'],cut:['fields'],awk:['fields'],sed:['regex'],
  tr:['stream'],tee:['stream'],xargs:['stream','quotes'],printf:['format'],echo:['stream'],true:['exit'],false:['exit'],diff:['exit'],cmp:['exit'],
  nl:['newline'],tac:['newline'],rev:['newline'],paste:['fields'],comm:['sorting'],expand:['tab'],unexpand:['tab'],fold:['newline'],
  chmod:['permissions','directoryPermissions'],chown:['owner'],groups:['owner'],id:['owner'],umask:['umask','permissions'],sudo:['sudo'],
  ln:['links'],readlink:['links'],tar:['archive','compression'],gzip:['compression'],gunzip:['compression'],
  ps:['process'],pgrep:['process','regex'],pkill:['process','signal'],kill:['process','signal'],top:['process','cpu'],
  df:['filesystem'],du:['filesystem'],lsblk:['block','filesystem'],findmnt:['mount','filesystem'],free:['memory'],vmstat:['memory','cpu'],
  uname:['kernel'],dmesg:['kernel'],lscpu:['cpu'],nproc:['cpu'],uptime:['cpu'],who:['session'],w:['session','cpu'],tty:['session'],
  export:['environment'],env:['environment'],printenv:['environment'],unset:['environment'],
  ip:['network','route'],ping:['network','dns'],ss:['port','process'],dig:['dns'],nslookup:['dns'],hostname:['hostname'],
  curl:['http','headers'],wget:['http'],systemctl:['service'],journalctl:['service'],apt:['package'],
  stat:['metadata'],file:['fileType'],truncate:['newline'],mktemp:['temporary'],history:['history'],clear:['history'],
  basename:['paths'],dirname:['paths'],date:['dateFormat'],seq:['options'],sleep:['process'],less:['stream'],more:['stream']
};
const operators = {'>':'overwrite','>>':'append','<':'input','|':'pipe','&&':'and','||':'or',';':'sequence'};
function expandsVariable(raw) {
  let quote='';
  for(let i=0;i<raw.length;i++) {
    const char=raw[i];
    if(char==='\\' && quote!=="'") { i++;continue; }
    if(char==="'" || char==='"') {
      if(!quote) quote=char;
      else if(quote===char) quote='';
      continue;
    }
    if(char==='$' && quote!=="'" && /^(?:[A-Za-z_]\w*|\{[A-Za-z_]\w*\})/.test(raw.slice(i+1))) return true;
  }
  return false;
}
export function lessonTerms(lesson, {boss=false}={}) {
  const keys=new Set();
  if (boss) {
    const types={file:'metadata',dir:'paths',cwd:'cwd',mode:'permissions',owner:'owner',archive:'archive',link:'links',env:'environment',service:'service',package:'package',processAbsent:'process',processPresent:'process'};
    for(const goal of lesson.goals || []) if(types[goal.type]) keys.add(types[goal.type]);
  } else {
    // Tokenize authored commands, so quoted text such as echo 'a > b' is not misidentified.
    for(const line of lesson.solution || []) {
      let tokens;try {tokens=tokenize(line);} catch {continue;}
      for(const token of tokens) {
        if(token.operator && operators[token.value]) keys.add(operators[token.value]);
        if(!token.operator && /^--?[A-Za-z]/.test(token.value)) keys.add('options');
        if(!token.operator && token.quoted && /[\s*?$<>|;&]/.test(token.value+token.raw)) keys.add('quotes');
        if(!token.operator && /\.csv(?:$|[\s"'])/.test(token.value)) keys.add('csv');
        if(!token.operator && !token.quoted && /[*?]/.test(token.raw)) keys.add('glob');
        if(!token.operator && expandsVariable(token.raw)) keys.add('variable');
      }
    }
    for(const key of concepts[lesson.command] || []) keys.add(key);
  }
  return [...keys].map(id=>({id,label:terminology[id][0],description:terminology[id][1]}));
}

// Ownership follows curriculum order, not the order in which a learner opens dialogs.
export function introductoryTerms(lesson, course, {review=false,boss=false}={}) {
  if(review || boss) return [];
  const introduced=new Set();
  // Introduce standard streams with redirection, even when the starter route reads a file earlier.
  const streamLesson=course.some(item=>item.id==='write-note') ? 'write-note' : null;
  for(const previous of course) {
    const current=previous.id===lesson.id;
    const terms=lessonTerms(current ? lesson : previous).filter(term=>term.id!=='stream'||!streamLesson||previous.id===streamLesson);
    if(current) return terms.filter(term=>!introduced.has(term.id));
    for(const term of terms) introduced.add(term.id);
  }
  return [];
}
