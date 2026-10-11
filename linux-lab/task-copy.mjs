// Task instructions stay separate from hints: state the outcome without prescribing a solution.
const contexts = {
  'where-am-i':'在终端输出当前工作目录的完整路径。',
  'look-around':'列出当前主目录中的文件和目录，输出中应包含 README.txt。',
  'hidden-profile':'列出主目录内容，让隐藏文件 .profile 出现在终端输出中。',
  'directory-map':'在终端显示 projects 的目录结构，包含其中的 notes.txt。',
  'locate-command':'查询 ls 可执行程序所在的完整路径，并输出到终端。',
  'create-workspace':'在 projects/cheese 下创建 src/api、src/web、docs/guide 三个嵌套目录。',
  'read-welcome':'在终端阅读主目录中的 README.txt，输出应包含欢迎说明。',
  'preview-log':'在终端只输出 logs/app.log 的前两行，保持原顺序。',
  'latest-error':'在终端只输出 logs/app.log 的最后一行，不显示前面的记录。',
  'filter-errors':'从 logs/app.log 中只输出以 ERROR 开头的记录，不区分大小写，保持原顺序。',
  'error-line-number':'从 logs/app.log 中输出以 ERROR 开头的记录，并在每行前标注原始行号。',
  'count-lines':'统计 logs/app.log 的行数，在终端输出“行数 文件路径”。',
  'read-with-less':'在终端阅读 logs/app.log，输出中应包含 ERROR timeout。',
  'read-with-more':'在终端阅读 README.txt，输出中应包含欢迎说明。',
  'number-sequence':'在终端依次输出整数 1 到 5，每个数占一行。',
  'brief-pause':'执行等待 1 秒的命令，正常结束即可；教学环境会立即返回。',
  'current-groups':'在终端显示当前用户所属的组，包含 learner 和 sudo。',
  'decompress-text':'将 README.txt.gz 解压为 README.txt，恢复原始欢迎说明。',
  'process-list':'在终端显示进程列表，包含 worker 的进程号和名称。',
  'disk-overview':'在终端显示根文件系统 / 的磁盘空间，包含可用空间 16G。',
  'project-size':'在终端显示 projects 目录的空间占用汇总，并保留目录名。',
  'memory-overview':'在终端显示内存使用情况，输出中应包含 Mem: 行。',
  'running-time':'在终端显示系统已运行的时间，输出中应包含 up 2 days。',
  'available-cpus':'查询可用 CPU 数量，在终端只输出数量。',
  'login-users':'在终端显示登录会话，包含 learner 的会话。',
  'terminal-device':'查询当前终端设备，在终端只输出设备路径。',
  'download-config':'从 https://example.com/config.json 下载配置，保存为主目录下的 config.json。',
  'wget-download':'从 https://example.com/health 下载健康响应，保存为主目录下的 health.txt，内容为一行 ok。',
  'list-installed':'在终端列出已安装的软件包，输出中应包含 coreutils。',
  'check-service-state':'查询 nginx 是否运行，在终端只输出 active。',
  'starter-delivery':'在主目录创建空文件 handoff.txt。',
  'identify-builtin':'查询 cd 的命令类型，在终端显示它是 Shell 内建命令。',
  'empty-log':'清空 logs/app.log 的全部内容，保留该文件。',
  'recursive-backup':'将 bundle 整个目录复制到 bundle-backup，包含 config/app.conf；保留源目录。',
  'number-blank-lines':'将 audit.txt 的每一行编号，空行也计数；结果保存到 numbered.txt，保留原文件。',
  'reverse-log-lines':'将 events.txt 按行倒序输出到终端，最后一行排在最前面。',
  'reverse-characters':'将 labels.txt 的每行字符反转后输出到终端，行的顺序不变。',
  'merge-columns':'按行合并 names.txt、roles.txt、teams.txt，使用逗号分隔并保存为 team.csv；缺少的行保留空字段。',
  'byte-comparison':'比较 projects/notes.txt 与 copy.txt；两份内容相同，终端无输出且退出码为 0 时通关。',
  'expand-tabs':'将 tabbed.txt 的制表符按每 4 列一个制表位展开为空格，结果输出到终端。',
  'compact-indent':'将 spaced.txt 的前导 8 个空格变为两个制表符（Tab），每个制表位宽 4 列；结果输出到终端。',
  'wrap-long-line':'将 long.txt 按每行最多 4 个字符折行，结果输出到终端。',
  'session-load':'在终端显示登录用户与会话状态，输出中应包含 learner 的 bash 会话。',
  'cpu-topology':'在终端显示 CPU 信息，输出中应包含架构 x86_64。',
  'block-filesystems':'在终端显示磁盘文件系统信息，包含根目录 / 使用的 ext4 文件系统。',
  'mounted-root':'在终端显示挂载信息，确认根目录 / 的来源是 /dev/sda1。',
  'kernel-messages':'在终端显示内核日志，输出中应包含 EXT4 文件系统的挂载记录。',
  'listening-port':'在终端显示监听端口，找到使用 8080 端口的 worker 进程。',
  'dns-record':'查询 example.com 的 IPv4（A）记录，在终端显示地址 192.0.2.20。',
  'inspect-http-headers':'查询 https://example.com/health 的 HTTP 响应头，输出中应包含状态码 200。',
  'service-status':'在终端显示 nginx 的服务状态：当前未运行，包含 inactive (dead)。此时退出码 3 是预期结果。',
  'incident-report':'从 logs/app.log 中提取 ERROR 行，保存到 reports/errors.log；reports 已存在，原日志保持不变。',
  'clean-workspace':'删除 logs/cache.tmp 和 logs/session.tmp，保留 logs/app.log。',
  'developer-list':'从 data/users.csv 中选择角色恰好为 developer 的记录，保存到 developer-rows.csv；保留全部三列和原顺序。',
  'deploy-service':'从 https://example.com/config.json 下载配置，保存为主目录下的 config.json。',
  'developer-column':'从 developer-rows.csv 提取第 1 列姓名和第 3 列团队，保留逗号与原顺序，保存到 names-unsorted.txt。',
  'developer-sort':'将 names-unsorted.txt 中的姓名按字母排序并去重，保存到 developers.txt；保留原名单。',
  'common-names':'找出 a.txt 与 b.txt 的共同名字，保存到 shared.txt。两份输入已排序；重复项保留较少的一份所含的次数。',
  'selective-archive':'将 bundle 下的 config/app.conf、docs/guide.txt、README.txt 打包为 delivery.tar。包内仅含这三份文件，路径不带 bundle/ 前缀。',
  'robust-config-download':'分别下载 https://example.com/config.json 和 https://example.com/health，保存为 release/config.json、release/health.txt；保留 release/config.before。',
  'name-intersection-report':'将 dev.txt 与 ops.txt 的共同名字保存到 shared-members.txt，将仅在 dev.txt 中出现的名字保存到 dev-only.txt；保留源文件。'
};
const labels = {
  'release-ready':['保留 release/deploy.sh 的原内容'],
  'latest-error':['在终端只输出 logs/app.log 的最后一行：ERROR disk full'],
  'preview-log':['在终端只输出 logs/app.log 的前两行'],
  'filter-errors':['输出以 ERROR 开头的记录（忽略大小写，保持原顺序）'],
  'error-line-number':['输出 ERROR 记录及原始行号，格式为“行号:记录”'],
  'numeric-sort':['在终端按数值降序输出 quantities.txt，保留重复项'],
  'csv-column':['输出 data/users.csv 的第 1、3 列，保留表头与逗号'],
  'adjacent-duplicates':['只输出重复名字，格式为“次数 名字”'],
  'resolve-path':['输出指定相对路径对应的完整绝对路径'],
  'resolve-link-chain':['输出 ./first-link 最终指向的绝对路径'],
  'number-blank-lines':['将带行号的全部内容保存到 numbered.txt（空行也编号）'],
  'developer-list':['将完整 developer 记录保存到 developer-rows.csv'],
  'developer-column':['将姓名、团队两列保存到 names-unsorted.txt'],
  'developer-sort':['将按字母排序、去重后的姓名保存到 developers.txt'],
  'merge-columns':['将三份名单按行合并为 team.csv（逗号分隔）'],
  'save-errors':['将 ERROR 记录保存到 reports/errors.log（忽略大小写）'],
  'find-logs':['将找到的 .log 文件相对路径保存到 log-paths.txt，一行一个'],
  'extract-roles':['将角色人数保存到 role-counts.txt，格式为“人数 角色”'],
  'memory-pressure':['将 CPU 空闲百分比保存到 cpu-idle.txt（只写数值）','将 I/O 等待百分比保存到 io-wait.txt（只写数值）'],
  'disable-debug':['将 /etc/app.conf 的 DEBUG 改为 false，保留其他行','将 /etc/worker.conf 的 DEBUG 改为 false，保留其他行'],
  'selective-archive':['创建 delivery.tar，仅含三份指定文件，包内路径不带 bundle/']
};
export function clarifyTask(task) {
  if(contexts[task.id]) task.context=contexts[task.id];
  if(task.id==='latest-error') task.title='读取日志的最后一行';
  for(const [index,goal] of task.goals.entries()) {
    if(labels[task.id]?.[index]) goal.label=labels[task.id][index];
    if(goal.type==='file' && /内容正确$/.test(goal.label)) goal.label=goal.text==='' ? '创建空文件 '+goal.path : '将结果保存到 '+goal.path;
    if(goal.type==='output' && goal.exact==='' && !goal.label.includes('退出码')) goal.label+='（无输出，退出码 '+(goal.code??0)+'）';
  }
  return task;
}
// Render only values that users may need to check; preservation goals need no second copy of the source.
export function goalReference(goal) {
  if(/保留|原件|原.*仍/.test(goal.label)) return null;
  if(goal.type==='output' && goal.exact && !goal.label.includes(goal.exact)) return {title:'目标输出',text:goal.exact};
  if(goal.type==='file' && typeof goal.text==='string' && goal.text && !goal.label.includes(goal.text.trimEnd().replace(/\n/g, ' ↵ '))) return {title:'目标内容',text:goal.text};
  if(goal.type==='archive' && goal.entries?.length) return {title:goal.exact?'仅限以下包内路径':'必须包含的包内路径',text:goal.entries.join('\n')};
  return null;
}
