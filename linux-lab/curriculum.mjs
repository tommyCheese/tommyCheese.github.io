import { extraEntries, levels, commandLevel } from './catalogue.mjs';
import { addExtraLessons } from './extra-lessons.mjs';
export { levels };
export const chapters = [
  ['navigation', '01', '认识工作区', '从目录和路径开始，建立终端里的方向感。'],
  ['files', '02', '整理文件', '搭建项目、备份资料、清理临时文件。'],
  ['text', '03', '读懂与处理文本', '从日志和表格里提取真正需要的信息。'],
  ['shell', '04', '让命令协作', '连接管道、保存结果，理解环境变量。'],
  ['permissions', '05', '权限与链接', '让文件拥有合适的权限和访问入口。'],
  ['archives', '06', '打包与压缩', '准备交付包，备份与恢复项目文件。'],
  ['system', '07', '观察系统', '定位进程、查看资源，认识当前机器。'],
  ['network', '08', '排查网络', '理解地址、端口、DNS 和 HTTP 请求。'],
  ['services', '09', '管理服务', '查询日志、启动服务，维护软件包。'],
  ['missions', '10', '任务挑战', '一个命令一个目标，逐步完成真实场景。']
].map(([id, number, title, description]) => ({ id, number, title, description }));

const sources = {
  core: 'https://www.gnu.org/software/coreutils/manual/html_node/index.html',
  bash: 'https://www.gnu.org/software/bash/manual/html_node/index.html',
  grep: 'https://www.gnu.org/software/grep/manual/html_node/index.html',
  find: 'https://www.gnu.org/software/findutils/manual/html_mono/find.html',
  sed: 'https://www.gnu.org/software/sed/manual/html_node/index.html',
  awk: 'https://www.gnu.org/software/gawk/manual/html_node/index.html',
  tar: 'https://www.gnu.org/software/tar/manual/html_node/index.html',
  gzip: 'https://www.gnu.org/software/gzip/manual/gzip.html',
  proc: 'https://gitlab.com/procps-ng/procps/-/tree/master/man',
  systemd: 'https://www.freedesktop.org/software/systemd/man/latest/',
  ip: 'https://www.kernel.org/pub/linux/utils/net/iproute2/',
  curl: 'https://curl.se/docs/manpage.html',
  wget: 'https://www.gnu.org/software/wget/manual/wget.html',
  apt: 'https://manpages.debian.org/bookworm/apt/apt.8.en.html',
  dns: 'https://bind9.readthedocs.io/en/latest/manpages.html',
  ping: 'https://github.com/iputils/iputils',
  tree: 'https://oldmanprogrammer.net/source.php?dir=projects/tree',
  sudo: 'https://www.sudo.ws/docs/man/sudo.man/',
  ssh: 'https://www.openssh.com/manual.html',
  vim: 'https://vimhelp.org/quickref.txt.html',
  cron: 'https://manpages.debian.org/bookworm/cron/crontab.5.en.html',
  docker: 'https://docs.docker.com/reference/cli/docker/',
  git: 'https://git-scm.com/docs'
};
// Each row documents exactly the teaching subset accepted by the shell.
const entries = [
  ['pwd','navigation','显示当前位置','pwd','','绝对路径从 / 开始；~ 表示自己的主目录。','pwd','core'],
  ['ls','navigation','列出文件和目录','ls [参数] [路径]','-a:显示隐藏文件;-l:显示权限和属性;-h:兼容显示开关（沙盒大小为教学值）;-R:递归列出;-d:只显示目录本身','以 . 开头的文件默认隐藏。参数可合并为 -la。','ls -la','core'],
  ['cd','navigation','切换工作目录','cd [目录]','..:父目录;~:主目录;-:返回上一次目录','相对路径以当前目录为起点。cd 没有输出是正常现象。','cd projects','bash'],
  ['tree','navigation','观察目录结构','tree [-a] [目录]','-a:包含隐藏文件','这里用缩进展示虚拟目录；真实系统可能需要先安装 tree。','tree projects','tree'],
  ['man','navigation','查询命令手册','man 命令','','沙盒展示中文教学手册，真实 Linux 的 man 通常有更完整的说明。','man cp','https://www.nongnu.org/man-db/'],
  ['help','navigation','查看支持范围','help [命令]','','真实 Bash 的 help 主要用于内建命令；沙盒的 help 同时列出教学命令。','help','bash'],
  ['mkdir','files','创建目录','mkdir [-p] [-m 权限] 目录…','-p:创建缺失的父目录;-m:设置三位八进制权限','目录已经存在时，mkdir -p 也能成功。','mkdir -p projects/demo/src','core'],
  ['touch','files','创建空文件','touch 文件…','','沙盒支持创建文件；真实 touch 还可以修改时间戳。','touch projects/todo.txt','core'],
  ['cp','files','复制文件或目录','cp [-rRa] 源… 目标','-r / -R:递归复制目录;-a:教学环境按递归复制处理;-f:允许覆盖普通文件','多个源文件需要目录作为目标。真实 cp -a 还保留更多元数据。','cp -r projects projects-backup','core'],
  ['mv','files','移动或重命名','mv [-f] 源… 目标','-f:覆盖普通文件','同一文件系统内，重命名通常不需要复制数据。','mv projects/notes.txt projects/meeting.txt','core'],
  ['rm','files','删除文件或目录','rm [-rfR] 路径…','-r / -R:递归删除目录;-f:忽略不存在的路径','删除前先核对路径。沙盒可重置；真实 rm 通常没有回收站。','rm downloads/old.tmp','core'],
  ['rmdir','files','删除空目录','rmdir 目录…','','只删除空目录；目录非空时返回错误。','rmdir empty','core'],
  ['file','files','判断文件类型','file 路径…','','沙盒按文件模型显示类型；真实 file 使用内容与魔数识别。','file deploy.sh','https://github.com/file/file'],
  ['stat','files','查看文件属性','stat 路径…','','查看权限、所有者和教学文件大小。真实 stat 支持时间与格式选项。','stat deploy.sh','core'],
  ['basename','files','取得路径末尾名称','basename 路径 [后缀]','','可去掉指定后缀，适合构造文件名。','basename /var/log/app.log .log','core'],
  ['dirname','files','取得父目录路径','dirname 路径','','不需要路径真实存在。','dirname /var/log/app.log','core'],
  ['cat','text','读取和连接文本','cat [-n] [文件…]','-n:为输出行编号','没有文件参数时从管道或输入重定向读取。','cat README.txt','core'],
  ['less','text','分页阅读文本','less 文件','','真实 less 用 q 退出、/ 搜索；沙盒一次性显示文本，不模拟分页按键。','less logs/app.log','core'],
  ['more','text','分页查看文本','more 文件','','沙盒一次性显示；真实 more 的分页交互需要在本地终端练习。','more README.txt','core'],
  ['head','text','读取开头几行','head [-n 行数] [文件…]','-n:指定行数（默认 10）','可接管道，用于快速预览。','head -n 2 logs/app.log','core'],
  ['tail','text','读取最后几行','tail [-n 行数] [-f] [文件…]','-n:指定末尾行数;-f:沙盒仅显示当前快照','真实 tail -f 会持续等待文件新增内容，沙盒没有后台刷新。','tail -n 1 logs/app.log','core'],
  ['grep','text','按模式筛选文本','grep [参数] 模式 [文件…]','-i:忽略大小写;-n:显示行号;-v:反向筛选;-c:统计匹配行;-r / -R:递归搜文件;-E:扩展模式;-F:固定字符串;-l:只显示匹配文件;-e:指定模式','无匹配的退出码是 1。沙盒使用 JavaScript 正则子集，不完全等同 GNU grep。','grep -n ERROR logs/app.log','grep'],
  ['find','text','按名称或类型查找路径','find [起点] [条件]','-name:文件名通配符;-type:类型 f/d/l;-maxdepth:最大层数;-print:输出路径;-delete:删除匹配路径','给通配符加引号，避免先被 Shell 展开。-delete 真实执行前应先用 -print 预览。','find . -name "*.log"','find'],
  ['wc','text','统计行数、单词和字节','wc [-lwc] [文件…]','-l:换行符数量;-w:单词数量;-c:UTF-8 字节数','wc -l 数的是换行符；最后一行未换行时不会计入。','wc -l logs/app.log','core'],
  ['sort','text','对文本行排序','sort [-nru] [文件…]','-n:按数字排序;-r:逆序;-u:去除重复行','沙盒按字符顺序排序；真实排序还受 locale 影响。','sort -n data/numbers.txt','core'],
  ['uniq','text','合并相邻重复行','uniq [-cd] [文件]','-c:显示重复次数;-d:只显示重复行','uniq 只处理相邻重复行，全局去重通常先 sort。','sort data/names.txt | uniq','core'],
  ['cut','text','提取列或字符','cut -d 分隔符 -f 字段 [文件]','-d:单字符分隔符;-f:字段编号、列表或闭合范围;-c:字符编号（教学环境按字符）','字段从 1 开始编号。默认分隔符是 Tab。','cut -d , -f 1 data/users.csv','core'],
  ['tr','text','替换或删除字符','tr [-d] 字符集 [目标集]','-d:删除指定字符','从标准输入读取；本沙盒支持简单字符范围与 \\n、\\t。','echo hello | tr a-z A-Z','core'],
  ['sed','text','替换文本或选取行','sed [-in] 表达式 [文件…]','-i:直接修改文件;-n:只输出显式选取的行','教学子集：s/旧/新/g 与 n[,m]p；复杂脚本和 GNU/BSD 差异请查官方手册。','sed -i "s/DEBUG=true/DEBUG=false/" /etc/app.conf','sed'],
  ['awk','text','提取结构化文本字段','awk [-F 分隔符] \'{print $n}\' [文件]','-F:字段分隔符','教学子集只支持打印一个字段或 $0 全行，不支持通用 awk 程序。','awk -F , \'{print $2}\' data/users.csv','awk'],
  ['diff','text','比较两个文本文件','diff 文件1 文件2','','相同返回 0，不同返回 1。沙盒显示两份内容，不模拟完整 diff 补丁格式。','diff projects/notes.txt README.txt','https://www.gnu.org/software/diffutils/manual/html_node/index.html'],
  ['echo','shell','输出一段文本','echo [-neE] 文本…','-n:不追加换行;-e:解释 \\n、\\t;-E:不解释转义','需要精确控制格式时，通常更适合 printf。','echo "hello Linux"','bash'],
  ['printf','shell','按格式输出文本','printf 格式 [值…]','%s:字符串;%d:数字;%%:百分号;\\n:换行','沙盒支持这些基础格式，不支持循环套用格式或宽度控制。','printf "%s\\n" hello','bash'],
  ['tee','shell','输出并保存管道内容','tee [-a] [文件…]','-a:追加内容','tee 同时写文件并保留标准输出，适合管道中间保存结果。','grep ERROR logs/app.log | tee errors.txt','core'],
  ['xargs','shell','把输入转换为命令参数','xargs [命令 [参数…]]','','教学子集按空白拆分。真实处理任意文件名通常用 find -print0 配合 xargs -0。','printf "a.txt b.txt" | xargs touch','find'],
  ['export','shell','设置环境变量','export 名称=值…','','使用 $名称 读取。环境变量会影响后续命令。','export PROJECT=cheese','bash'],
  ['env','shell','查看环境变量','env [变量名…]','','真实 env 还可以带临时环境运行命令；沙盒只支持查看。','env','core'],
  ['printenv','shell','输出环境变量的值','printenv [变量名…]','','查看单个变量时可不输出变量名。','printenv HOME','core'],
  ['unset','shell','移除变量','unset 名称…','','沙盒只处理环境变量。','unset PROJECT','bash'],
  ['history','shell','查看命令历史','history','','↑/↓ 可在输入框浏览历史，历史仅保存在当前浏览器。','history','bash'],
  ['clear','shell','清空终端显示','clear','','清屏保留文件和历史；重置关卡会恢复练习环境。','clear','https://invisible-island.net/ncurses/man/clear.1.html'],
  ['true','shell','返回成功状态','true','','可配合 && 验证成功后执行。','true && echo ready','core'],
  ['false','shell','返回失败状态','false','','可配合 || 验证失败后执行。','false || echo retry','core'],
  ['chmod','permissions','修改权限','chmod [-R] 权限 路径…','-R:递归修改','支持三位八进制与单组符号表达式，如 u+x、go-r。r=4、w=2、x=1。','chmod 755 deploy.sh','core'],
  ['chown','permissions','修改所有者','chown [-R] 用户[:组] 路径…','-R:递归修改','教学环境记录所有者字符串，真实系统通常需要管理员权限。','sudo chown root /etc/app.conf','core'],
  ['umask','permissions','设置新文件权限掩码','umask [三位八进制]','','普通文件基础权限为 666，目录为 777，再移除掩码指定的位。','umask 077','bash'],
  ['ln','permissions','创建符号链接','ln -s 目标 链接','-s:创建符号链接','相对链接目标以链接所在目录为起点。本沙盒不支持硬链接。','ln -s projects/notes.txt notes-link','core'],
  ['readlink','permissions','查看符号链接目标','readlink [-f] 链接','-f:输出规范化目标路径（教学子集）','沙盒 -f 只规范化一层目标，复杂链请用真实工具核验。','readlink notes-link','core'],
  ['sudo','permissions','以管理员身份执行命令','sudo 命令 [参数…]','','本沙盒允许命令模拟管理操作；不模拟密码、用户切换或真实权限拦截。','sudo systemctl start nginx','sudo'],
  ['tar','archives','打包、查看和恢复归档','tar -[cxt][zv]f 归档 [-C 目录] [路径…]','-c:创建;-x:解包;-t:列出条目;-f:归档文件;-z:教学 gzip 标记;-v:显示条目;-C:切换归档工作目录','沙盒归档存储的是文件快照，不是真正的 tar/gzip 二进制文件。','tar -czf project.tar.gz projects','tar'],
  ['gzip','archives','压缩文件','gzip [-k] 文件…','-k:保留源文件','沙盒保存可恢复的教学快照，无法导出真实 gzip。','gzip -k README.txt','gzip'],
  ['gunzip','archives','恢复压缩文件','gunzip [-k] 文件.gz…','-k:保留压缩文件','只接受教学沙盒创建的 gzip 文件。','gunzip README.txt.gz','gzip'],
  ['ps','system','查看进程列表','ps [aux | -ef]','','沙盒展示固定进程模型；真实 ps 支持大量筛选与格式选项。','ps aux','proc'],
  ['pgrep','system','按名称查进程号','pgrep [-f] 模式','-f:兼容按模拟进程名称匹配','沙盒按进程名称匹配；真实 -f 匹配完整命令行。','pgrep worker','proc'],
  ['kill','system','向进程发送信号','kill [-15 | -TERM | -9 | -KILL] PID…','-15 / -TERM:请求结束（默认）;-9 / -KILL:强制结束','先尝试 TERM。教学模型统一移除进程，不模拟信号处理函数。','kill 314','proc'],
  ['pkill','system','按名称结束进程','pkill [-f] 模式','-f:兼容名称匹配','真实系统可能匹配多个进程，执行前可先 pgrep。','pkill worker','proc'],
  ['top','system','查看系统进程快照','top','','本沙盒一次性显示；真实 top 是持续刷新的交互程序。','top','proc'],
  ['free','system','查看内存概况','free [-h | -m]','-h / -m:教学兼容选项','固定教学内存数值；没有实时采样。','free -m','proc'],
  ['df','system','查看文件系统空间','df [-h]','-h:教学兼容选项','展示教学磁盘快照；真实 df 查询挂载文件系统。','df -h','core'],
  ['du','system','估计目录占用','du [-sh] [路径…]','-s:汇总（教学默认）;-h:教学兼容选项','沙盒汇总文本字符数量，和真实块占用、字节单位不同。','du -sh projects','core'],
  ['uname','system','查看内核信息','uname [-a | -r | -s]','-a:综合信息;-r:内核版本;-s:内核名称','展示虚拟机器信息。','uname -a','core'],
  ['whoami','system','显示当前用户','whoami','','教学用户为 learner。','whoami','core'],
  ['id','system','查看用户与用户组','id','','沙盒提供固定用户和组信息。','id','core'],
  ['hostname','system','查看主机名称','hostname','','沙盒只支持读取主机名。','hostname','core'],
  ['date','system','查看日期','date [+%F]','+%F:YYYY-MM-DD 格式','使用固定教学日期，便于重现练习。','date +%F','core'],
  ['uptime','system','查看运行时间','uptime','','显示固定运行时间与平均负载。','uptime','proc'],
  ['ip','network','查询地址与路由','ip addr | ip route','addr / a / address:地址信息;route / r:路由表','教学地址使用文档保留网段，不读真实电脑配置。','ip addr','ip'],
  ['ss','network','查看套接字与监听端口','ss [-tulpna]','-t:TCP;-u:UDP;-l:监听;-p:进程;-n:数字地址;-a:全部','选项可组合；沙盒展示固定端口快照与 nginx 状态，不逐项过滤。','ss -tulpn','ip'],
  ['ping','network','检查主机连通性','ping [-c 次数] 主机','-c:发送次数，沙盒最多 10','仅模拟 example.com 与教学 IP，不发送真实网络包。','ping -c 2 example.com','ping'],
  ['dig','network','查询 DNS 记录','dig 主机','','教学子集只返回 A 记录；真实 dig 支持指定 DNS 服务器与记录类型。','dig example.com','dns'],
  ['nslookup','network','查询主机地址','nslookup 主机','','只支持教学 DNS 中的主机名。','nslookup example.com','dns'],
  ['curl','network','请求 URL 或下载内容','curl [-IsSfL] [-o 文件] URL','-I:只看响应头;-o:保存到文件;-s / -S / -f / -L:教学兼容开关','仅模拟 https://example.com/health 和 /config.json；不进行真实请求。','curl -o config.json https://example.com/config.json','curl'],
  ['wget','network','下载文件','wget [-q] [-O 文件] URL','-O:指定文件名，- 表示标准输出;-q:教学静默开关','只接受内置教学 URL。','wget -O health.txt https://example.com/health','wget'],
  ['systemctl','services','查询与管理 systemd 服务','systemctl 动作 [服务]','status / is-active:查看状态;start / stop / restart:控制服务;enable / disable:控制开机启动;list-units:列出服务','模拟 nginx 服务。enable 和 start 是不同操作；并非所有 Linux 都使用 systemd。','sudo systemctl start nginx','systemd'],
  ['journalctl','services','查看服务日志','journalctl [-u nginx] [-n 行数] [-f]','-u:按教学服务查看;-n:末尾行数;-f:教学快照','只展示教学 nginx 日志；真实 -f 会持续跟随。','journalctl -u nginx -n 1','systemd'],
  ['apt','services','管理 Debian/Ubuntu 软件包','apt update | install 包 | remove 包 | search 包 | list --installed','','教学源含 bash、coreutils、curl、wget、nginx、tree、git、vim。其他发行版使用不同包管理器。','sudo apt install curl','apt'],
  ['ssh','network','登录远程机器','ssh [-p 端口] 用户@主机','-p:SSH 服务端口','仅供复习：需要真实 SSH 客户端与远程主机，浏览器沙盒不建立连接。','ssh user@server','ssh',false],
  ['scp','network','通过 SSH 复制文件','scp [-r] 源 用户@主机:目标','-r:递归复制目录','仅供复习：需要真实远程连接。','scp report.txt user@server:/tmp/','ssh',false],
  ['rsync','files','同步目录与文件','rsync -av 源/ 目标/','-a:归档模式;-v:显示详情;--dry-run:预览更改','仅供复习。源目录末尾的 / 会影响同步层级。','rsync -av --dry-run projects/ backup/','https://download.samba.org/pub/rsync/rsync.1',false],
  ['vim','text','在终端编辑文件','vim 文件','i:进入插入模式;Esc:返回普通模式;:wq:保存退出;:q!:放弃修改退出','仅供复习：交互编辑器需在真实终端练习。','vim /etc/app.conf','vim',false],
  ['nano','text','用简单编辑器修改文件','nano 文件','Ctrl+O:保存;Ctrl+X:退出','仅供复习：浏览器沙盒支持文件预览，未模拟编辑器。','nano notes.txt','https://www.nano-editor.org/dist/latest/nano.html',false],
  ['crontab','services','安排周期任务','crontab -e | -l','-e:编辑;-l:列出','仅供复习：时间字段依次为分、时、日、月、星期，例如 0 2 * * * 每天 02:00。','crontab -l','cron',false],
  ['docker','services','管理容器','docker ps | logs 容器 | exec -it 容器 sh','ps:查看运行中容器;logs:查看日志;exec:在容器内运行命令','仅供复习：需要安装 Docker 与运行守护进程。','docker ps','docker',false],
  ['git','files','管理代码版本','git status | add 文件 | commit -m 消息','status:查看变更;diff:查看差异;log:查看历史','仅供复习：查看工作区变更、暂存文件并创建提交。','git status','git',false],
  ['zip','archives','创建 ZIP 归档','zip -r archive.zip 目录','-r:递归归档','仅供复习：沙盒的归档练习使用 tar/gzip。','zip -r project.zip projects','https://infozip.sourceforge.net/Zip.html',false],
  ['unzip','archives','解压 ZIP 归档','unzip archive.zip [-d 目录]','-d:指定目标目录;-l:先列出内容','仅供复习：先确认归档内容与目标路径。','unzip project.zip -d restored','https://infozip.sourceforge.net/UnZip.html',false]
];
entries.push(...extraEntries);
export const manuals = entries.map(([name, category, summary, syntax, options, note, example, source, practice = true]) => ({
  name, category, summary, syntax, options: options ? options.split(';').map(item => item.split(/:(.*)/s).slice(0, 2)) : [],
  note, example, source: sources[source] || source, practice, level: commandLevel(name)
}));

const goals = {
  output: (label, exact, via, code = 0) => ({ type: 'output', label, exact, via: via.split(' '), code }),
  includes: (label, includes, via, code = 0) => ({ type: 'output', label, includes, via: via.split(' '), code }),
  file: (label, path, text) => ({ type: 'file', label, path, ...(text === undefined ? {} : { text }) }),
  dir: (label, path) => ({ type: 'dir', label, path }),
  absent: (label, path) => ({ type: 'absent', label, path }),
  cwd: (label, path) => ({ type: 'cwd', label, path }),
  mode: (label, path, value) => ({ type: 'mode', label, path, value }),
  service: (label, property, value) => ({ type: 'service', label, name: 'nginx', property, value })
};
const G = goals;
const lessons = [];
function task(chapter, slug, title, context, theory, commands, targets, solution, tip, seed = {}) {
  lessons.push({ id: slug, chapter, title, context, theory, commands: commands.split(' '), goals: targets,
    solution: solution.split('\n'), hints: [tip, '可以查阅 ' + commands.split(' ').join('、') + ' 的用法；留意目标路径与输出格式。', '参考解法：\n' + solution], seed });
}
task('navigation','where-am-i','你现在在哪里？','刚登录一台开发机器。先确认所在位置，再开始整理项目。','终端总有一个当前工作目录。绝对路径描述从根目录 / 出发的位置。','pwd',[G.output('输出当前工作目录','/home/learner','pwd')],'pwd','print working directory：打印工作目录。');
task('navigation','look-around','看看工作区里有什么','新机器的主目录里放着几个目录和一份说明。请列出内容。','ls 列出目录内容；加 -a 可以查看隐藏文件。','ls',[G.includes('输出中包含 README.txt','README.txt','ls tree')],'ls','输入命令后按 Enter；ls 无参数时查看当前位置。');
task('navigation','hidden-profile','找到隐藏的配置','同事说主目录有一份 .profile。普通列表里没有它，试着把它找出来。','Unix 通常把以点号开头的文件作为隐藏文件。','ls',[G.includes('在目录列表中显示 .profile','.profile','ls tree')],'ls -a','ls 的 all 参数可以显示隐藏文件。');
task('navigation','enter-projects','走进项目目录','接下来的工作都在 projects 中。把当前目录切换过去。','cd 修改 Shell 的当前位置，之后的相对路径也会随之改变。','cd pwd',[G.cwd('当前目录为 ~/projects','projects')],'cd projects','先用 ls 看目录名称，再切换目录。');
task('navigation','parent-directory','回到主目录','你已进入 projects，现在要回到它的上一级目录。','.. 代表父目录，. 代表当前目录。','cd',[G.cwd('回到 /home/learner','~')],'cd ..','当前位于 projects，父目录就是主目录。',{ cwd: '/home/learner/projects' });
task('navigation','directory-map','画出项目地图','无需逐个进入目录，查看 projects 下面的结构。','tree 使用缩进显示目录层级，适合快速了解新项目。','tree',[G.includes('结构中包含 notes.txt','notes.txt','tree')],'tree projects','让 tree 以 projects 为起点。');
task('files','create-workspace','为新项目搭骨架','创建 projects/cheese/src 与 projects/cheese/docs 两个目录。','mkdir -p 可以一次创建尚不存在的父目录。','mkdir',[G.dir('创建 src 目录','projects/cheese/src'),G.dir('创建 docs 目录','projects/cheese/docs')],'mkdir -p projects/cheese/src projects/cheese/docs','两个目录可以作为同一条命令的多个参数。');
task('files','new-readme','留一份项目说明','在 projects 中创建一个空的 README.md，之后再写内容。','touch 可以创建不存在的空文件；文件已存在时不会清空正文。','touch',[G.file('创建空 README.md','projects/README.md','')],'touch projects/README.md','touch 后面跟文件路径。');
task('files','copy-note','先备份再修改','把 projects/notes.txt 复制为 projects/notes.bak，保留原文件。','cp 源 目标。复制会保留源文件，目标不存在时直接创建。','cp',[G.file('备份内容与原文件一致','projects/notes.bak','draft\n'),G.file('保留原 notes.txt','projects/notes.txt','draft\n')],'cp projects/notes.txt projects/notes.bak','把备份路径放在最后。');
task('files','rename-note','给笔记起个清晰名字','把 projects/notes.txt 重命名为 meeting.txt。','mv 可移动路径，也可在同一目录里重命名。','mv',[G.file('生成 projects/meeting.txt','projects/meeting.txt','draft\n'),G.absent('原文件名不再存在','projects/notes.txt')],'mv projects/notes.txt projects/meeting.txt','新旧路径只需要最后一段名称不同。');
task('files','move-download','把下载文件归档','把 downloads/old.tmp 移到 projects 中。','目标是已存在目录时，mv 会沿用文件名。','mv',[G.file('文件进入 projects','projects/old.tmp','temporary\n'),G.absent('downloads 中没有原文件','downloads/old.tmp')],'mv downloads/old.tmp projects/','目标可以直接写目录名。');
task('files','copy-project','备份整个项目目录','把 projects 目录完整复制成 projects-backup。','普通 cp 不会复制目录，需要递归参数 -r。','cp',[G.file('备份包含 notes.txt','projects-backup/notes.txt','draft\n'),G.file('保留原项目','projects/notes.txt','draft\n')],'cp -r projects projects-backup','目标目录当前还不存在。');
task('files','cleanup-temp','清理一次性下载','删除 downloads/old.tmp，保留 downloads 目录。','rm 删除指定路径。执行前可用 ls 核对目标。','rm',[G.absent('移除临时文件','downloads/old.tmp'),G.dir('保留 downloads 目录','downloads')],'rm downloads/old.tmp','这次只需要删除一个文件。');
task('files','remove-empty','移除空目录','主目录中有一个 empty 空目录，请移除它。','rmdir 仅删除空目录，能避免误删有内容的目录。','rmdir',[G.absent('empty 已移除','empty')],'rmdir empty','用适合空目录的命令。',{ dirs: ['empty'] });
task('files','path-components','从路径中提取文件名','收到路径 /var/log/app.log，只输出不带 .log 后缀的名称。','basename 取得末尾名称，可额外指定要去掉的后缀。','basename dirname',[G.output('只输出 app','app','basename')],'basename /var/log/app.log .log','第二个参数指定需要移除的后缀。');
task('text','read-welcome','读一读工作区说明','阅读主目录的 README.txt，了解这次实验的规则。','cat 适合短文本；less 适合在真实终端中分页阅读长文件。','cat less',[G.includes('输出欢迎说明','欢迎来到 Linux 命令实验室。','cat less more')],'cat README.txt','文件名区分大小写。');
task('text','preview-log','只看启动时的两行日志','app.log 很长时无需全部显示。现在只输出最前面的两行。','head -n N 读取开头 N 行。','head',[G.output('输出日志前两行','INFO server started\nERROR timeout','head sed')],'head -n 2 logs/app.log','用 -n 明确指定行数。');
task('text','latest-error','查看最后一条记录','从 logs/app.log 中只读取最后一行，了解最近的情况。','tail 与 head 相对应，关注文本末尾。','tail',[G.output('只输出最后一行','ERROR disk full','tail sed')],'tail -n 1 logs/app.log','真实日志跟踪可以用 tail -f；这里先练固定行数。');
task('text','filter-errors','筛出错误日志','从 logs/app.log 中提取全部 ERROR 行，去掉 INFO 行。','grep 按模式选择匹配的行，适合定位日志关键词。','grep',[G.output('仅输出两条 ERROR','ERROR timeout\nERROR disk full','grep sed awk')],'grep ERROR logs/app.log','关键词与日志中的大小写保持一致。');
task('text','error-line-number','给错误标上行号','仍然提取 ERROR 行，同时显示它们在文件中的行号。','grep -n 在每条匹配前加上原始行号。','grep',[G.output('输出第 2 和第 4 行错误','2:ERROR timeout\n4:ERROR disk full','grep')],'grep -n ERROR logs/app.log','使用 number 参数。');
task('text','find-logs','寻找散落的日志','从主目录开始查找所有 .log 文件，只输出路径。','find 的 -name 对文件名称使用通配符；加引号可避免提前展开。','find',[G.output('找到主目录中的 app.log','./logs/app.log','find')],'find . -name "*.log"','以 . 为起点，匹配 *.log。');
task('text','count-lines','统计日志行数','输出 app.log 的行数及文件名，确认日志有几条记录。','wc -l 统计换行符。输出通常包含数量与源文件名。','wc',[G.output('输出 4 和日志路径','4 logs/app.log','wc')],'wc -l logs/app.log','使用 lines 参数。');
task('text','numeric-sort','把数字排对顺序','data/numbers.txt 是一组数量。按数值从小到大输出，保留重复值。','默认 sort 按文本比较；-n 才按数值比较。','sort',[G.output('输出 2、2、10、30','2\n2\n10\n30','sort')],'sort -n data/numbers.txt','数字排序与字符排序会产生不同结果。');
task('text','unique-names','生成不重复的名单','将 data/names.txt 按名称排序并去重。','uniq 只消除相邻重复项，通常放在 sort 后面。sort -u 也是一种解法。','sort uniq',[G.output('输出排序后的唯一名单','alice\nbob\ncarol','sort uniq')],'sort data/names.txt | uniq','先把相同名字放在一起。');
task('text','csv-column','从 CSV 中提取姓名','只输出 data/users.csv 的第一列，保留表头。','cut -d 指定分隔符，-f 指定字段编号，字段从 1 开始。','cut awk',[G.output('输出姓名列','name\nalice\nbob\ncarol','cut awk')],'cut -d , -f 1 data/users.csv','逗号是这份文件的分隔符。');
task('text','uppercase','统一文本大小写','把 hello linux 输出为大写 HELLO LINUX。','tr 从标准输入读取字符，配合管道完成替换。','echo tr',[G.output('输出 HELLO LINUX','HELLO LINUX','tr')],'echo "hello linux" | tr a-z A-Z','把小写字符范围映射到大写范围。');
task('text','disable-debug','关闭调试模式','把 /etc/app.conf 的 DEBUG=true 改为 DEBUG=false，保留 PORT 设置。','sed 的替换表达式为 s/旧/新/。-i 会修改文件本身。','sed',[G.file('配置保留端口并关闭 DEBUG','/etc/app.conf','PORT=3000\nDEBUG=false\n')],'sed -i "s/DEBUG=true/DEBUG=false/" /etc/app.conf','不加 -i 时，只会改变输出。');
task('text','extract-roles','查看用户角色列','使用文本字段工具，只输出 users.csv 的第二列（含表头）。','awk 的 $1、$2 表示字段，-F 可把分隔符设置为逗号。表达式宜放进单引号。','awk cut',[G.output('输出角色列','role\ndeveloper\nadmin\ndeveloper','awk cut')],"awk -F , '{print $2}' data/users.csv",'单引号可以防止 Shell 提前解释 $2。');
task('shell','write-note','把一句话保存下来','创建 hello.txt，文件内容是一行 hello Linux。','> 把标准输出写入文件，已有文件会被截断。','echo printf',[G.file('hello.txt 内容正确','hello.txt','hello Linux\n')],'echo "hello Linux" > hello.txt','终端没有输出时，检查右侧文件内容。');
task('shell','append-note','继续补充笔记','notes.txt 已有 first 一行。追加 second 一行，保留原内容。','>> 在末尾追加；> 会覆盖已有内容。','echo',[G.file('两行内容均保留','notes.txt','first\nsecond\n')],'echo second >> notes.txt','注意区分一个和两个大于号。',{ files: { 'notes.txt': 'first\n' } });
task('shell','save-errors','保存筛选后的错误','把 app.log 中两条 ERROR 记录保存到 errors.txt，原日志保持不变。','管道把前一条命令的输出传给下一条；重定向把输出交给文件。','grep tee',[G.file('errors.txt 只包含错误行','errors.txt','ERROR timeout\nERROR disk full\n'),G.file('原始日志仍保留四行','logs/app.log','INFO server started\nERROR timeout\nINFO request complete\nERROR disk full\n')],'grep ERROR logs/app.log > errors.txt','可直接重定向，也可用 tee 同时显示和保存。');
task('shell','project-variable','设置项目环境变量','把 PROJECT 环境变量设为 cheese，让后续命令能读取它。','export 把变量加入环境。$PROJECT 会被 Shell 替换为变量值。','export printenv',[{ type:'env',label:'PROJECT 的值为 cheese',name:'PROJECT',value:'cheese' }],'export PROJECT=cheese','变量赋值的等号两边不要加空格。');
task('shell','batch-files','把名单转换成文件','输入里列出了 a.txt 与 b.txt。把它们转换为 touch 的参数并创建两份空文件。','xargs 可以把标准输入变成下一条命令的参数；本节只处理不含空格的名称。','printf xargs touch',[G.file('创建 a.txt','a.txt',''),G.file('创建 b.txt','b.txt','')],'printf "a.txt b.txt" | xargs touch','让 xargs 调用 touch。');
task('shell','success-chain','成功后再进入目录','创建 projects/release 目录，并在创建成功后进入它。','&& 仅在前一条命令成功时执行后一条。; 则不检查上一条是否成功。','mkdir cd',[G.dir('release 目录存在','projects/release'),G.cwd('进入 release 目录','projects/release')],'mkdir -p projects/release && cd projects/release','把目录创建和切换连接起来。');
task('permissions','inspect-mode','查清脚本权限','查看 deploy.sh 的属性，确认它当前的权限。','stat 可展示权限；ls -l 可以用 rwx 形式查看。','stat ls',[G.includes('输出当前权限数值 644','644','stat')],'stat deploy.sh','stat 的 Access 字段会显示权限数值。');
task('permissions','make-executable','让部署脚本可执行','为 deploy.sh 的所有者增加执行权限，最终权限为 744。','权限按所有者、组、其他用户分成三组。u+x 为所有者增加执行位。','chmod',[G.mode('deploy.sh 权限为 744','deploy.sh','744')],'chmod u+x deploy.sh','保留其他用户的原始权限。');
task('permissions','private-file','保护私密配置','把 secret.txt 的权限设为 600，只有所有者可读写。','每组权限数值相加：读 4、写 2、执行 1。','chmod',[G.mode('secret.txt 权限为 600','secret.txt','600')],'chmod 600 secret.txt','所有者为 4+2，其他两组为 0。',{ files: { 'secret.txt': 'TOKEN=demo\n' } });
task('permissions','change-owner','交给管理员管理','把 deploy.sh 的所有者改为 root。这里使用教学权限模型。','chown 修改所有者；真实系统通常需要 sudo 权限。','chown sudo',[{ type:'owner',label:'deploy.sh 所有者为 root',path:'deploy.sh',value:'root' }],'sudo chown root deploy.sh','把新所有者放在文件路径前面。');
task('permissions','private-default','设置更保守的默认权限','设置掩码 077，再创建 private.txt，让新文件权限为 600。','umask 从基础权限中移除对应权限位，不是直接给文件赋值。','umask touch',[G.file('创建 private.txt','private.txt',''),G.mode('新文件权限为 600','private.txt','600')],'umask 077\ntouch private.txt','普通文件基础权限为 666，掩去组与其他用户的权限。');
task('permissions','shortcut-link','给笔记建立快捷入口','创建 notes-link，指向 projects/notes.txt，不复制内容。','符号链接存储目标路径；通过链接读取时会访问目标。','ln',[{ type:'link',label:'notes-link 指向项目笔记',path:'notes-link',target:'projects/notes.txt' }],'ln -s projects/notes.txt notes-link','ln -s 后依次写目标和链接名。');
task('permissions','inspect-link','确认快捷入口的目标','已有 notes-link，输出它保存的目标路径。','readlink 查看链接本身的内容，而 cat 会读取目标文件正文。','readlink',[G.output('输出 projects/notes.txt','projects/notes.txt','readlink')],'readlink notes-link','使用读取链接目标的命令。');
// This lesson needs a link; setup is data, not hidden command execution.
lessons.at(-1).seed = { links: { 'notes-link': 'projects/notes.txt' } };
task('archives','create-archive','为项目制作交付包','把 projects 目录归档为 project.tar.gz，保留原目录。','tar 的 c 创建、f 指定文件、z 表示 gzip。沙盒保存教学文件快照。','tar',[{ type:'archive',label:'归档包含 projects/notes.txt',path:'project.tar.gz',entries:['projects/notes.txt'] },G.file('原笔记仍然存在','projects/notes.txt','draft\n')],'tar -czf project.tar.gz projects','组合参数后紧跟归档文件名。');
task('archives','inspect-archive','先检查再解包','已有 project.tar.gz。列出归档内容，确认包含项目笔记。','tar -t 查看归档条目，不会解包。','tar',[G.includes('列出 projects/notes.txt','projects/notes.txt','tar')],'tar -tf project.tar.gz','用 t 替代创建用的 c。',{ setup: ['tar -cf project.tar.gz projects'] });
task('archives','restore-archive','恢复到独立目录','把已有 project.tar.gz 解包到 restored 目录，保留归档。','tar -x 解包，-C 指定已有的目标目录。','mkdir tar',[G.file('restored 包含恢复的笔记','restored/projects/notes.txt','draft\n'),G.file('保留归档文件','project.tar.gz')],'mkdir restored\ntar -xf project.tar.gz -C restored','先创建目标目录，再解包。',{ setup: ['tar -cf project.tar.gz projects'] });
task('archives','compress-text','压缩并保留原文','压缩 README.txt 为 README.txt.gz，同时保留原始说明。','gzip 默认会移除源文件，-k 表示保留。','gzip',[G.file('生成压缩快照','README.txt.gz'),G.file('保留原始说明','README.txt')],'gzip -k README.txt','本关需要 keep 参数。');
task('archives','decompress-text','恢复压缩说明','说明已压缩。恢复 README.txt，内容应与初始说明一致。','gunzip 将 .gz 文件恢复成原文件。沙盒只接受内部创建的教学归档。','gunzip',[G.file('README.txt 恢复完整内容','README.txt','欢迎来到 Linux 命令实验室。\n先理解目标，再选择命令。\n')],'gunzip README.txt.gz','恢复后可以用 cat 检查。',{ setup: ['gzip README.txt'] });
task('system','process-list','观察正在运行的程序','查看进程列表，找到后台 worker。','ps 是进程快照。PID 是进程编号。','ps top',[G.includes('进程列表包含 worker','314 worker','ps top')],'ps aux','固定教学环境中 worker 的 PID 为 314。');
task('system','worker-pid','只取得工作进程号','不要输出整个进程表，只查出 worker 的 PID。','pgrep 按名称匹配并只输出 PID。','pgrep',[G.output('只输出 314','314','pgrep')],'pgrep worker','把进程名作为匹配模式。');
task('system','stop-worker','结束失控的工作进程','后台 worker 无需继续运行，把它结束，保留其他进程。','kill 默认发送 TERM，请先尝试正常结束，再考虑 KILL。','kill pkill',[{ type:'processAbsent',label:'worker 不再运行',name:'worker' }],'kill 314','也可以按名称选择进程，但执行前应确认匹配范围。');
task('system','disk-overview','查看磁盘余量','确认教学机器根文件系统的可用空间。','df 查询文件系统空间；du 查询指定路径占用。','df',[G.includes('输出可用空间 16G','16G','df')],'df -h','这里要看整个文件系统。');
task('system','project-size','查看项目占用','估计 projects 目录的教学占用，输出汇总及目录名。','du -s 汇总路径占用。沙盒使用文本长度作为教学值。','du',[G.includes('输出 projects 汇总','projects','du')],'du -sh projects','用 du 选择具体目录。');
task('system','memory-overview','查看内存概况','读取当前教学内存快照，区分 Mem 与 Swap。','free 用于观察内存；真实系统中 available 比单独的 free 更适合判断可用量。','free',[G.includes('输出 Mem 行','Mem:','free')],'free -m','本沙盒以固定 MiB 数值展示。');
task('system','kernel-version','记录内核版本','只输出教学机器的内核版本号。','uname -r 查询 release，-a 会输出综合信息。','uname',[G.output('只输出 6.8.0','6.8.0','uname')],'uname -r','只需要内核 release。');
task('system','current-user','确认登录身份','输出当前教学用户名，确认没有操作错账户。','whoami 输出有效用户名。id 可进一步查看 UID 和用户组。','whoami id',[G.output('输出 learner','learner','whoami')],'whoami','这一关只要用户名。');
task('network','ip-address','查出机器地址','查看教学 eth0 网卡的 IPv4 地址。','ip addr 查询网卡地址，ip route 查询路由。','ip',[G.includes('输出 192.0.2.10/24','192.0.2.10/24','ip')],'ip addr','addr 是 address 的简写。');
task('network','default-route','流量从哪里出去','查询默认路由，确认网关是 192.0.2.1。','默认路由决定非本地流量通常发往哪个网关。','ip',[G.includes('输出默认网关','default via 192.0.2.1','ip')],'ip route','改为查看 route。');
task('network','listening-port','是谁占用了端口','查看监听端口，定位 8080 上的工作进程。','ss -tulpn 常用于查看 TCP/UDP 监听端口及进程。','ss',[G.includes('输出 8080 监听信息','0.0.0.0:8080','ss')],'ss -tulpn','这些参数分别关注协议、监听、进程与数字地址。');
task('network','connectivity','发送两次连通性探测','向教学 example.com 发送两次 ping，查看接收结果。','ping -c 限制次数；真实 ICMP 不通也不一定意味着 HTTP 不可用。','ping',[G.includes('两次发送均收到响应','2 packets transmitted, 2 received','ping')],'ping -c 2 example.com','使用 count 参数。');
task('network','dns-record','域名对应哪个地址','查询 example.com 的教学 A 记录。','DNS 把域名映射到地址，dig 和 nslookup 都可用于查询。','dig nslookup',[G.includes('输出文档网段地址','192.0.2.20','dig nslookup')],'dig example.com','两种 DNS 查询命令均可完成。');
task('network','health-check','检查 HTTP 健康接口','请求 https://example.com/health，接口应该返回 ok。','curl 读取 URL 内容；沙盒用内置响应演示，不访问真实服务器。','curl',[G.output('接口返回 ok','ok','curl wget')],'curl https://example.com/health','这里需要正文，不是响应头。');
task('network','download-config','把远程配置下载到本地','从教学 /config.json 下载配置，保存成 config.json。','curl -o 与 wget -O 都能指定输出文件。注意大小写不同。','curl wget',[G.file('配置保存为 config.json','config.json','{"port":8080}\n')],'curl -o config.json https://example.com/config.json','也可以使用 wget 的大写 O。');
task('services','service-status','服务为什么没起来','查询 nginx 的状态，确认它目前处于 inactive。','systemctl status 展示状态；未运行服务可能返回非零退出码，这是正常语义。','systemctl',[G.includes('确认 nginx 未运行','inactive (dead)','systemctl',3)],'systemctl status nginx','不要把“未运行”误认为命令不可用。');
task('services','start-web','启动网站服务','让教学 nginx 进入运行状态。','start 立即启动服务；enable 只设置开机启动。','systemctl sudo',[G.service('nginx 正在运行','active',true)],'sudo systemctl start nginx','先完成即时启动。');
task('services','boot-web','让网站开机启动','设置 nginx 开机启动。本关无需立即启动服务。','enable 与 start 解决不同问题。真实系统支持更多选项。','systemctl',[G.service('nginx 已启用开机启动','enabled',true)],'sudo systemctl enable nginx','使用 enable 动作。');
task('services','service-error','找出服务最后的错误','只读取 nginx 服务日志的最后一行。','journalctl -u 选择服务，-n 选择末尾行数。','journalctl',[G.output('只输出 upstream 错误','ERROR upstream timeout','journalctl')],'journalctl -u nginx -n 1','限定服务和行数。');
task('services','install-client','补上缺失的 HTTP 工具','把 curl 安装到教学机器的软件包列表。','Debian/Ubuntu 使用 apt。真实安装前通常先 apt update。','apt sudo',[{ type:'package',label:'curl 已安装',name:'curl' }],'sudo apt install curl','软件包操作只改变教学环境状态。');
task('services','remove-package','移除不再需要的工具','教学机器装了 wget，当前无需保留它，请移除。','apt remove 移除软件包，和删除下载文件不是同一件事。','apt',[{ type:'package',label:'wget 已移除',name:'wget',present:false }],'sudo apt remove wget','选择 remove 动作。',{ packages:['bash','coreutils','wget'] });
task('missions','incident-report','留下可交接的故障记录','把 app.log 的错误行保存到 reports/errors.log，并保留原日志。','把目录准备、筛选和保存连成一条工作流。','mkdir grep tee',[G.file('故障报告只含错误','reports/errors.log','ERROR timeout\nERROR disk full\n'),G.file('原日志保留','logs/app.log')],'mkdir -p reports\ngrep ERROR logs/app.log | tee reports/errors.log','先创建 reports，再把筛选结果写入目标。');
task('missions','release-ready','准备发布目录','创建 release，复制 deploy.sh 进去，并将副本权限设为 755。原脚本保留。','交付文件需要正确内容、位置和权限。','mkdir cp chmod',[G.file('发布脚本内容正确','release/deploy.sh','#!/bin/sh\necho deploy\n'),G.mode('发布脚本权限为 755','release/deploy.sh','755'),G.file('原脚本保留','deploy.sh')],'mkdir release\ncp deploy.sh release/\nchmod 755 release/deploy.sh','按创建目录、复制、授权的顺序完成。');
task('missions','clean-workspace','清理日志旁的临时文件','logs 下新增了两份 .tmp 文件。删掉它们，保留 app.log。','通配符适合按后缀批量选择。执行前可以先 ls 查看匹配结果。','ls rm find',[G.absent('移除 cache.tmp','logs/cache.tmp'),G.absent('移除 session.tmp','logs/session.tmp'),G.file('保留 app.log','logs/app.log')],'rm logs/*.tmp','只匹配 .tmp 后缀。',{ files:{'logs/cache.tmp':'cache\n','logs/session.tmp':'session\n'} });
task('missions','developer-list','制作可复用的开发者名单','从 users.csv 中筛出 developer 记录，提取姓名并排序，保存到 developers.txt。','筛选记录、提取字段、排序、保存结果，分别交给擅长的工具。','grep cut awk sort',[G.file('名单包含 alice 与 carol','developers.txt','alice\ncarol\n')],'grep developer data/users.csv | cut -d , -f 1 | sort > developers.txt','不要把表头或 admin 放进名单。');
task('missions','deploy-service','完成一次服务交付','下载 config.json，启动 nginx 并设置开机启动，最后备份配置为 config.tar.gz。','每个目标都检查环境结果，可以用你自己的命令组合完成。','curl wget systemctl tar',[G.file('下载正确配置','config.json','{"port":8080}\n'),G.service('nginx 运行中','active',true),G.service('nginx 开机启动','enabled',true),{ type:'archive',label:'归档包含 config.json',path:'config.tar.gz',entries:['config.json'] }],'curl -o config.json https://example.com/config.json\nsudo systemctl start nginx\nsudo systemctl enable nginx\ntar -czf config.tar.gz config.json','把四项要求分开完成，逐项观察目标打勾。');

// Every level focuses on one command. Scenarios requiring several tools are
// broken into successive steps, each with its own prepared starting state.
function revise(id, changes) { Object.assign(lessons.find(item => item.id === id), changes); }
revise('unique-names', { solution: ['sort -u data/names.txt'], theory: 'sort -u 一次完成排序与去重。uniq 的相邻去重会在单独的关卡中练习。' });
revise('uppercase', { commands: ['tr'], context: 'greeting.txt 中写着 hello linux。只用 tr 把内容转换为大写输出。', solution: ['tr a-z A-Z < greeting.txt'], seed: { files: { 'greeting.txt': 'hello linux\n' } }, theory: 'tr 从标准输入读取字符。< greeting.txt 把文件送入标准输入，不需要额外命令。' });
revise('success-chain', { title: '进入发布目录', commands: ['cd'], context: '同事已经准备好 projects/release。进入这个目录，开始下一项工作。', theory: '当前目录会影响后续相对路径。只需切换位置，不必重新创建目录。', goals: [G.cwd('进入 ~/projects/release', 'projects/release')], solution: ['cd projects/release'], seed: { dirs: ['projects/release'] } });
revise('batch-files', { commands: ['xargs'], context: 'file-list.txt 中有 a.txt 和 b.txt 两个名称。用 xargs 把它们作为 touch 的参数，批量创建文件。', solution: ['xargs touch < file-list.txt'], seed: { files: { 'file-list.txt': 'a.txt b.txt\n' } }, theory: '本关只练 xargs：它把输入变成命令参数。touch 是它调用的动作，< 负责读取名单。' });
revise('save-errors', { commands: ['grep'], solution: ['grep ERROR logs/app.log > errors.txt'] });
revise('clean-workspace', { commands: ['rm'] });
revise('private-default', { commands: ['umask'], title: '先设置默认权限', context: '接下来要保存私密文件。先把新文件权限掩码设置为 077。', goals: [{ type: 'setting', name: 'umask', value: '077', label: '新文件权限掩码为 077' }], solution: ['umask 077'] });
revise('restore-archive', { commands: ['tar'], context: '同事已创建 restored 目录。把 project.tar.gz 的内容解包进去，保留归档。', solution: ['tar -xf project.tar.gz -C restored'], seed: { dirs: ['restored'], setup: ['tar -cf project.tar.gz projects'] } });
revise('incident-report', { commands: ['grep'], context: 'reports 目录已准备好。把 app.log 的错误行保存为 reports/errors.log。', solution: ['grep ERROR logs/app.log > reports/errors.log'], seed: { dirs: ['reports'] } });
revise('release-ready', { commands: ['chmod'], title: '为发布脚本授权', context: '脚本已复制到 release/deploy.sh。只修改这个副本的权限为 755。', solution: ['chmod 755 release/deploy.sh'], seed: { files: { 'release/deploy.sh': '#!/bin/sh\necho deploy\n' } } });
revise('developer-list', { commands: ['grep'], title: '名单挑战 ① 筛选记录', context: '先从 users.csv 中筛出 developer 记录，保存到 developer-rows.csv。后续关卡再提取姓名。', theory: '把复杂目标拆开，这一关只负责选择记录。', goals: [G.file('保存两条 developer 记录', 'developer-rows.csv', 'alice,developer\ncarol,developer\n')], solution: ['grep developer data/users.csv > developer-rows.csv'] });
revise('deploy-service', { commands: ['curl'], title: '交付挑战 ① 下载配置', context: '先下载教学服务的 config.json。启动、开机启动与备份将在后续关卡完成。', theory: '这一关只练 curl，把 HTTP 响应保存到指定文件。', goals: [G.file('config.json 内容正确', 'config.json', '{"port":8080}\n')], solution: ['curl -o config.json https://example.com/config.json'] });
for (const lesson of lessons) {
  lesson.command = lesson.commands[0]; lesson.commands = [lesson.command];
  lesson.solution = lesson.solution.map(line => lesson.command !== 'sudo' ? line.replace(/^sudo /, '') : line);
  lesson.hints = [lesson.hints[0], `本关练习 ${lesson.command}。输入 man ${lesson.command}，再对照任务目标选择参数。`, '参考解法：\n' + lesson.solution.join('\n')];
}
lessons.find(item => item.id === 'success-chain').hints[0] = '目录已经存在，用 cd 进入即可。';
lessons.find(item => item.id === 'release-ready').hints[0] = '只需要修改发布副本的权限。';
lessons.find(item => item.id === 'incident-report').hints[0] = 'reports 已存在，直接筛选并保存结果。';
function single(chapter, id, title, context, theory, command, targets, solution, tip, seed = {}) {
  task(chapter, id, title, context, theory, command, targets, solution, tip, seed);
  const item = lessons.at(-1); item.command = command;
}
single('text','adjacent-duplicates','合并相邻重复名字','sorted-names.txt 已经排好序。用 uniq 去掉相邻重复名字。','uniq 只处理相邻重复行，本关的输入已排序。','uniq',[G.output('输出唯一名单','alice\nbob\ncarol','uniq')],'uniq sorted-names.txt','无需再次排序。',{ files:{'sorted-names.txt':'alice\nbob\nbob\ncarol\n'} });
single('shell','tee-report','一边显示，一边保存','errors-source.txt 是已经筛好的错误。用 tee 显示它，同时保存为 errors-copy.txt。','tee 把标准输入同时送到屏幕与文件。< 可直接提供文件输入。','tee',[G.file('保存错误副本','errors-copy.txt','ERROR timeout\nERROR disk full\n'),G.output('终端仍显示错误','ERROR timeout\nERROR disk full','tee')],'tee errors-copy.txt < errors-source.txt','把保存路径作为 tee 的参数。',{files:{'errors-source.txt':'ERROR timeout\nERROR disk full\n'}});
single('permissions','sudo-directory','试用管理员命令入口','在教学 /srv 下创建 web 目录。这一关练习 sudo 的调用形式。','sudo 是命令前缀，后面跟要执行的动作。沙盒不模拟密码和真实权限拦截。','sudo',[G.dir('/srv/web 已创建','/srv/web')],'sudo mkdir /srv/web','sudo 后面使用目录创建动作。');
single('missions','developer-column','名单挑战 ② 提取姓名','上一阶段筛好的数据放在 developer-rows.csv。用 cut 提取第一列，保存为 names-unsorted.txt。','本关只负责字段提取，不再筛选记录。','cut',[G.file('保存姓名列','names-unsorted.txt','carol\nalice\n')],'cut -d , -f 1 developer-rows.csv > names-unsorted.txt','分隔符是逗号。',{files:{'developer-rows.csv':'carol,developer\nalice,developer\n'}});
single('missions','developer-sort','名单挑战 ③ 整理顺序','names-unsorted.txt 已保存姓名。用 sort 排序，写入最终的 developers.txt。','一次只完成一项动作，三个小关就组成了名单处理流程。','sort',[G.file('最终名单排序正确','developers.txt','alice\ncarol\n')],'sort names-unsorted.txt > developers.txt','使用输出重定向保存排序结果。',{files:{'names-unsorted.txt':'carol\nalice\n'}});
single('missions','delivery-start','交付挑战 ② 启动服务','配置已经准备好。用 systemctl 启动教学 nginx。','start 负责当前运行状态。','systemctl',[G.service('nginx 正在运行','active',true)],'systemctl start nginx','本关只练 start。');
single('missions','delivery-enable','交付挑战 ③ 开机启动','nginx 已经运行。用 systemctl 设置它随机器启动。','enable 管理开机启动，不代替 start。','systemctl',[G.service('nginx 开机启动','enabled',true)],'systemctl enable nginx','使用 enable 动作。',{services:{nginx:{active:true,enabled:false}}});
single('missions','delivery-archive','交付挑战 ④ 备份配置','config.json 已经下载。只用 tar 制作 config.tar.gz。','最后一个小关只负责配置归档。','tar',[{type:'archive',label:'归档包含 config.json',path:'config.tar.gz',entries:['config.json']}],'tar -czf config.tar.gz config.json','c 创建，z 压缩标记，f 后写归档名。',{files:{'config.json':'{"port":8080}\n'}});
single('navigation','lookup-copy','不知道参数？先问手册','查阅 cp 的手册，在输出里找到递归复制参数。','man 可以随时使用。这一关专门练习查询用法。','man',[G.includes('手册包含 -r / -R','-r / -R','man')],'man cp','给 man 一个要查询的命令名。');
single('navigation','available-tools','你的工具箱里有什么','用 help 查看沙盒支持的命令列表。','教学环境的 help 展示工具箱，真实 Bash 的 help 主要查询内建命令。','help',[G.includes('输出可用命令列表','可用命令：','help')],'help','直接输入 help 即可。');
single('files','identify-file','这是什么文件？','查看 deploy.sh 的文件类型。','file 可以辨别类型；教学环境按虚拟文件模型判断。','file',[G.includes('输出 UTF-8 文本类型','UTF-8 text','file')],'file deploy.sh','命令后跟需要识别的文件。');
single('files','parent-path','只取路径中的目录','从 /var/log/app.log 中取得父目录路径。','dirname 是 basename 的搭档，不需要路径真实存在。','dirname',[G.output('只输出 /var/log','/var/log','dirname')],'dirname /var/log/app.log','这一关不进入目录，只处理路径文本。');
single('text','read-with-less','用阅读器打开日志','使用 less 查看 app.log 的 ERROR 记录。','真实 less 支持分页、搜索和退出，本沙盒一次性显示内容。','less',[G.includes('阅读结果包含 timeout','ERROR timeout','less')],'less logs/app.log','只需要打开日志文件。');
single('text','read-with-more','换一个阅读器','使用 more 阅读 README.txt。','more 也是分页工具，教学沙盒仅显示当前内容快照。','more',[G.includes('输出完整说明中的欢迎行','欢迎来到 Linux 命令实验室。','more')],'more README.txt','本关只试用 more。');
single('text','compare-copy','两份笔记是否一致','notes-copy.txt 是笔记副本。用 diff 比较它与 projects/notes.txt。','相同文件无输出，退出码为 0；不同文件返回 1。','diff',[G.output('文件相同，退出码为 0','','diff')],'diff projects/notes.txt notes-copy.txt','输出为空也是有效结果。',{files:{'notes-copy.txt':'draft\n'}});
single('shell','format-greeting','精确输出一句问候','用 printf 输出 hello，并在末尾换行。','printf 通过格式串控制输出；%s 表示字符串，\\n 表示换行。','printf',[G.output('输出 hello','hello','printf')],'printf "%s\\n" hello','把格式串放在双引号中。');
single('shell','all-environment','查看工作环境','用 env 查看环境变量，找到 HOME。','环境变量保存路径、用户等运行环境信息。','env',[G.includes('输出 HOME 的路径','HOME=/home/learner','env')],'env','本关查询全部环境。');
single('shell','home-value','只读取 HOME 的值','用 printenv 只输出 HOME 的值。','printenv 指定变量名时只显示其值。','printenv',[G.output('输出 /home/learner','/home/learner','printenv')],'printenv HOME','变量名使用大写。');
single('shell','remove-variable','清掉临时项目变量','PROJECT 是临时配置，移除它。','unset 删除变量，不会删除同名文件。','unset',[{type:'env',name:'PROJECT',value:undefined,label:'环境中没有 PROJECT'}],'unset PROJECT','使用变量名，不要加 $。',{env:{HOME:'/home/learner',PROJECT:'temporary'}});
single('shell','remember-command','回看做过的操作','上一条操作是 ls。用 history 找到它。','history 列出当前会话记录；↑/↓ 可重新选择历史命令。','history',[G.includes('历史中包含 ls','ls','history')],'history','本关已准备一条历史记录。',{history:['ls']});
single('shell','clean-screen','把屏幕清爽一下','用 clear 清空终端显示。文件和历史仍然保留。','清屏与重置环境不同。','clear',[{type:'clear',label:'执行清屏动作'}],'clear','直接输入 clear。');
single('shell','successful-status','返回一个成功状态','执行 true，观察退出码为 0。','Shell 用退出码判断成功与否，0 表示成功。','true',[G.output('退出码为 0','','true')],'true','这条命令本身不输出文本。');
single('shell','failed-status','理解非零退出码','执行 false，观察退出码为 1。','非零退出码表达命令未成功，不一定代表程序崩溃。','false',[G.output('退出码为 1','','false',1)],'false','本关把失败状态作为预期结果。');
single('system','stop-by-name','按名称结束工作进程','只用 pkill 结束 worker。','执行前应确认名称匹配范围，本关的 worker 是唯一目标。','pkill',[{type:'processAbsent',name:'worker',label:'worker 已结束'}],'pkill worker','不需要查出 PID 再传入。');
single('system','live-processes','打开进程观察器','用 top 查看教学进程快照。','真实 top 会持续刷新；这里显示单次快照。','top',[G.includes('快照包含 worker','worker','top')],'top','直接输入 top。');
single('system','user-groups','除了用户名，还属于哪些组','用 id 查询 learner 的 UID 与组信息。','用户 ID、主组与附加组共同参与权限判断。','id',[G.includes('输出 uid=1000','uid=1000(learner)','id')],'id','本关查询当前用户即可。');
single('system','machine-name','给机器记个名字','用 hostname 查询教学主机名。','主机名是机器的名称，不等同于 IP 地址。','hostname',[G.output('只输出 lab','lab','hostname')],'hostname','本关只读取，不修改。');
single('system','calendar-date','记录今天的教学日期','用 date 输出 YYYY-MM-DD 格式的教学日期。','+%F 指定 ISO 风格日期格式，沙盒日期固定以便重复练习。','date',[G.output('输出 2026-10-11','2026-10-11','date')],'date +%F','使用格式参数 +%F。');
single('system','running-time','机器运行多久了','用 uptime 查看运行时间。','uptime 也会显示平均负载。','uptime',[G.includes('运行时间为 2 days','up 2 days','uptime')],'uptime','直接输入 uptime。');
single('network','lookup-host','用另一个工具查域名','用 nslookup 查询 example.com 的教学地址。','nslookup 与 dig 都能查询 DNS，本关只练前者。','nslookup',[G.includes('输出 192.0.2.20','192.0.2.20','nslookup')],'nslookup example.com','把主机名作为参数。');
single('network','wget-download','下载一份健康报告','用 wget 下载健康接口的内容，保存为 health.txt。','wget -O 指定输出文件名，这里的 O 必须大写。','wget',[G.file('health.txt 内容为 ok','health.txt','ok\n')],'wget -O health.txt https://example.com/health','使用 -O 选择保存名称。');
addExtraLessons(single, G, lessons);
for (const lesson of lessons) {
  lesson.level ||= lesson.chapter === 'missions' ? 'advanced' : commandLevel(lesson.command);
  if (['hidden-config','copy-project','move-download','archive-preview','restore-archive','preserve-original','developer-names','save-errors','remove-variable','home-value','listen-port','dns-lookup','fetch-config','enable-service'].includes(lesson.id)) lesson.level = 'advanced';
}
// Group steps by level and chapter, keeping stable IDs for saved progress.
lessons.sort((a,b) => levels.findIndex(item => item.id === a.level) - levels.findIndex(item => item.id === b.level) || chapters.findIndex(item => item.id === a.chapter) - chapters.findIndex(item => item.id === b.chapter));
export { lessons };
export function createLessonShell(Shell, seedState, lesson) {
  const { setup = [], links = {}, ...extra } = lesson?.seed || {};
  const shell = new Shell(seedState(extra), manuals);
  for (const [name, target] of Object.entries(links)) shell.run(['ln','-s',target,name]);
  for (const line of setup) { const result = shell.execute(line); if (result.code) throw new Error('关卡初始化失败：' + result.stderr); }
  shell.state.history = extra.history || [];
  shell.allowedCommand = lesson?.command;
  return shell;
}
