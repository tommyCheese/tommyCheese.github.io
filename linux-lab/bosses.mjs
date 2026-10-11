// A Boss is one persistent workspace with simultaneous outcome constraints.
// The tier adds recovery and safety requirements, rather than a command whitelist.
export function createBossLesson(boss, id) {
  const advanced = boss.level !== 'common', master = boss.level === 'master';
  const goals = [], solution = [], files = {}, dirs = [], setup = [];
  const file = (path, text, label = path + (text === '' ? ' 为空文件' : '：' + text.trimEnd().replace(/\n/g, ' ↵ '))) => goals.push({type:'file',path,text,label});
  const keep = (path, text) => file(path,text,'保留原件：' + path);
  const mode = (path,value) => goals.push({type:'mode',path,value,label:path + ' 权限为 ' + value});
  const absent = path => goals.push({type:'absent',path,label:'移除 ' + path});
  const archive = (path,contents) => goals.push({type:'archive',path,entries:Object.keys(contents),contents,exact:true,label:path + ' 仅含 ' + Object.keys(contents).join('、')});
  const report = (path,includes) => goals.push({type:'file',path,includes,label:path + ' 包含 ' + includes});
  const service = (property,value) => goals.push({type:'service',name:'nginx',property,value,label:'nginx ' + (property === 'active' ? '运行中' : '开机启动')});
  let title, context;
  switch (boss.chapter) {
    case 'navigation':
      title='迷路的交接包'; context='先查看目录和交接说明。所有操作以路径为准，完成后停留在交付目录。';
      files['projects/交接 包/.route']='目标：/home/learner/projects/交接 包/release\n';
      files['projects/交接 包/draft/notes.txt']='approved\n'; dirs.push('projects/交接 包/release');
      file('projects/交接 包/release/notes.txt','approved\n'); keep('projects/交接 包/draft/notes.txt','approved\n');
      goals.push({type:'cwd',path:'projects/交接 包/release',label:'最终位置：~/projects/交接 包/release'});
      solution.push('cp "projects/交接 包/draft/notes.txt" "projects/交接 包/release/"');
      if(advanced) { file('projects/交接 包/release/route.txt','/home/learner/projects/交接 包/release\n'); solution.push('realpath "projects/交接 包/draft/../release" > "projects/交接 包/release/route.txt"'); }
      if(master) { goals.push({type:'link',path:'current-release',target:'projects/交接 包/release',label:'current-release 是指向交付目录的链接'}); solution.push('ln -s "projects/交接 包/release" current-release'); file('projects/交接 包/release/manifest.txt','approved\n');solution.push('cat "projects/交接 包/draft/notes.txt" > "projects/交接 包/release/manifest.txt"'); }
      solution.push('cd "projects/交接 包/release"');break;
    case 'files':
      title='清理而不误删';context='归档两份正式材料，清理暂存区。深层备份和名字相似的正式文件必须保留。';
      Object.assign(files,{'staging/spec.txt':'spec v2\n','staging/meeting notes.txt':'approved\n','staging/a.tmp':'discard\n','staging/sub/b.tmp':'discard\n','staging/sub/deep/c.tmp':'keep\n','staging/main.tmp.txt':'keep\n'});
      file('release/docs/spec.txt','spec v2\n');file('release/docs/meeting notes.txt','approved\n');
      absent('staging/a.tmp');absent('staging/sub/b.tmp');keep('staging/sub/deep/c.tmp','keep\n');keep('staging/main.tmp.txt','keep\n');keep('staging/spec.txt','spec v2\n');
      solution.push('mkdir -p release/docs','cp staging/spec.txt "staging/meeting notes.txt" release/docs/','find staging -maxdepth 2 -type f -name "*.tmp" -delete');
      if(advanced) { files['staging/obsolete.txt']='old\n';absent('staging/obsolete.txt'); file('release/previous/spec.txt','spec v2\n');solution.push('mkdir -p release/previous','cp staging/spec.txt release/previous/','rm staging/obsolete.txt'); }
      if(master) { file('release/docs/spec.txt','spec v3\n');goals.splice(0,1);solution.push('sed -i "s/v2/v3/" release/docs/spec.txt');mode('release/previous/spec.txt','444');solution.push('chmod 444 release/previous/spec.txt'); }
      break;
    case 'text':
      title='噪声中的错误报告';context='日志混有大小写不同的状态和重复记录。只提交 ERROR 记录中的组件名，按字母排序、去重；原日志不得改动。';
      files['logs/incident.csv']='INFO,web,ready\nERROR,db,timeout\nerror,api,timeout\nWARN,db,slow\nERROR,db,timeout\nERROR,web,unavailable\n';
      file('reports/components.txt','api\ndb\nweb\n');keep('logs/incident.csv',files['logs/incident.csv']);
      solution.push('mkdir -p reports','grep -i "^ERROR," logs/incident.csv | cut -d , -f 2 | sort -u > reports/components.txt');
      if(advanced) { file('reports/error-count.txt','4\n');solution.push('grep -i "^ERROR," logs/incident.csv | wc -l > reports/error-count.txt'); }
      if(master) { files['data/oncall.txt']='api\ncache\nweb\n';file('reports/oncall-errors.txt','api\nweb\n');keep('data/oncall.txt',files['data/oncall.txt']);solution.push('comm -12 reports/components.txt data/oncall.txt > reports/oncall-errors.txt'); }
      break;
    case 'shell':
      title='可重复的报告流程';context='生成降序的唯一数量报告；同时保留处理输入。交接文件已有标题，追加结果，不能覆盖标题。';
      files['data/quantities.txt']='12\n2\n30\n12\n7\n';files['handoff.txt']='release quantities\n';
      file('reports/quantities.txt','30\n12\n7\n2\n');file('handoff.txt','release quantities\n30\n12\n7\n2\n');keep('data/quantities.txt',files['data/quantities.txt']);
      solution.push('mkdir -p reports','sort -nru data/quantities.txt | tee reports/quantities.txt >> handoff.txt');
      if(advanced) { goals.push({type:'env',name:'RELEASE',value:'cheese-2026',label:'RELEASE 环境变量为 cheese-2026'});file('reports/release.txt','cheese-2026\n');solution.push('export RELEASE=cheese-2026','printf "%s\\n" "$RELEASE" > reports/release.txt'); }
      if(master) { files['data/targets.txt']='reports/audit.txt reports/checks.txt\n';file('reports/audit.txt','');file('reports/checks.txt','');solution.push('xargs touch < data/targets.txt');file('reports/status.txt','ready\n');solution.push('grep 30 reports/quantities.txt > /tmp/quantity-check && printf "ready\\n" > reports/status.txt'); }
      break;
    case 'permissions':
      title='发布权限审计';context='脚本需可执行，密钥只允许所有者读取和写入。不能修改正式脚本内容。';
      files['release/bin/deploy.sh']='#!/bin/sh\necho release\n';files['release/.secret']='TOKEN=private\n';
      mode('release/bin/deploy.sh','755');mode('release/.secret','600');keep('release/bin/deploy.sh',files['release/bin/deploy.sh']);keep('release/.secret',files['release/.secret']);
      solution.push('chmod 755 release/bin/deploy.sh','chmod 600 release/.secret');
      if(advanced) { goals.push({type:'owner',path:'release/.secret',value:'root',label:'密钥所有者为 root'});goals.push({type:'setting',name:'umask',value:'077',label:'后续新文件掩码为 077'});file('release/audit.txt','');mode('release/audit.txt','600');solution.push('chown root release/.secret','umask 077','touch release/audit.txt'); }
      if(master) { files['shared/docs/note.txt']='public\n';setup.push('chmod 777 shared shared/docs','chmod 666 shared/docs/note.txt');mode('shared','775');mode('shared/docs','775');mode('shared/docs/note.txt','664');keep('shared/docs/note.txt','public\n');solution.push('chmod -R o-w shared'); }
      break;
    case 'archives':
      title='安全交付与恢复';context='交付包只包含配置和说明，包内路径不得带 bundle 前缀。密钥和临时文件不能进入归档；将交付包恢复到独立目录并验证内容。';
      files['bundle/config/app.conf']='PORT=8080\nDEBUG=false\n';files['bundle/README.txt']='release v2\n';files['bundle/.secret']='private\n';files['bundle/cache.tmp']='discard\n';
      archive('delivery.tar.gz',{'config/app.conf':files['bundle/config/app.conf'],'README.txt':files['bundle/README.txt']});
      file('restored/config/app.conf',files['bundle/config/app.conf']);file('restored/README.txt',files['bundle/README.txt']);keep('bundle/.secret','private\n');
      solution.push('tar -czf delivery.tar.gz -C bundle config/app.conf README.txt','mkdir restored','tar -xf delivery.tar.gz -C restored');
      if(advanced) { file('restored/config/app.conf','PORT=9090\nDEBUG=false\n');goals.splice(1,1);solution.push('sed -i "s/8080/9090/" restored/config/app.conf');keep('bundle/config/app.conf',files['bundle/config/app.conf']); }
      if(master) { archive('patched.tar.gz',{'config/app.conf':'PORT=9090\nDEBUG=false\n','README.txt':'release v2\n'});file('verified/config/app.conf','PORT=9090\nDEBUG=false\n');solution.push('tar -czf patched.tar.gz -C restored config/app.conf README.txt','mkdir verified','tar -xf patched.tar.gz -C verified'); }
      break;
    case 'system':
      title='故障现场留证';context='先保存系统与进程快照，再结束 worker；systemd 和 bash 必须继续运行。报告保存在 reports 中。';
      report('reports/processes.txt','314 worker');report('reports/disk.txt','16G');goals.push({type:'processAbsent',name:'worker',label:'worker 已结束'}, {type:'processPresent',name:'systemd',label:'systemd 仍运行'}, {type:'processPresent',name:'bash',label:'bash 仍运行'});
      solution.push('mkdir reports','ps aux > reports/processes.txt','df -h > reports/disk.txt','pkill worker');
      if(advanced) { report('reports/memory.txt','Mem:');file('reports/kernel.txt','6.8.0\n');solution.push('free -m > reports/memory.txt','uname -r > reports/kernel.txt'); }
      if(master) { report('reports/mounts.txt','/dev/sda1');report('reports/pressure.txt','si so bi bo');solution.push('findmnt > reports/mounts.txt','vmstat > reports/pressure.txt');mode('reports','700');solution.push('chmod 700 reports'); }
      break;
    case 'network':
      title='网络排查证据链';context='保存网卡、默认路由和域名查询的证据，下载健康响应。各项结果必须保存在独立报告中。';
      report('reports/address.txt','192.0.2.10/24');report('reports/route.txt','default via 192.0.2.1');report('reports/dns.txt','192.0.2.20');file('reports/health.txt','ok\n');
      solution.push('mkdir reports','ip addr > reports/address.txt','ip route > reports/route.txt','dig example.com > reports/dns.txt','curl -o reports/health.txt https://example.com/health');
      if(advanced) { report('reports/headers.txt','200 OK');file('reports/config.json','{"port":8080}\n');solution.push('curl -I https://example.com/health > reports/headers.txt','curl -sSfL -o reports/config.json https://example.com/config.json'); }
      if(master) { file('reports/ports.txt','8080\n');solution.push('ss -tlnp | grep worker | awk \'{print $3}\' | cut -d : -f 2 > reports/ports.txt');archive('network-evidence.tar',{'health.txt':'ok\n','config.json':'{"port":8080}\n','ports.txt':'8080\n'});solution.push('tar -cf network-evidence.tar -C reports health.txt config.json ports.txt'); }
      break;
    case 'services':
      title='从停机到可交付';context='nginx 停机且未启用开机启动。恢复服务，设置开机启动，并将服务日志中的错误记录保存为排查报告。';
      service('active',true);service('enabled',true);file('reports/errors.txt','ERROR upstream timeout\n');
      solution.push('systemctl start nginx','systemctl enable nginx','mkdir reports','journalctl -u nginx | grep ERROR > reports/errors.txt');
      if(advanced) { goals.push({type:'package',name:'nginx',label:'nginx 软件包已安装'});report('reports/listener.txt','0.0.0.0:80 nginx');solution.push('apt install nginx','ss -tlnp | grep nginx > reports/listener.txt'); }
      if(master) { file('/etc/app.conf','PORT=8080\nDEBUG=false\n');file('reports/config.before','PORT=3000\nDEBUG=true\n');solution.push('cp /etc/app.conf reports/config.before','sed -i "s/3000/8080/" /etc/app.conf','sed -i "s/DEBUG=true/DEBUG=false/" /etc/app.conf','systemctl restart nginx');archive('service-evidence.tar',{'config.before':'PORT=3000\nDEBUG=true\n','errors.txt':'ERROR upstream timeout\n'});solution.push('tar -cf service-evidence.tar -C reports config.before errors.txt'); }
      break;
    case 'missions':
      title='发布前最后一公里';context='从原始名单生成去重排序后的 developer 姓名清单，准备交付目录、脚本和配置。源数据与私密文件不能被改动。';
      files['data/team.csv']='name,role\ncarol,developer\nbob,admin\nalice,developer\ncarol,developer\n';files['release-secret.txt']='TOKEN=private\n';
      file('release/developers.txt','alice\ncarol\n');file('release/deploy.sh','#!/bin/sh\necho deploy\n');mode('release/deploy.sh','755');keep('data/team.csv',files['data/team.csv']);keep('release-secret.txt',files['release-secret.txt']);
      solution.push('mkdir release','grep ",developer$" data/team.csv | cut -d , -f 1 | sort -u > release/developers.txt','cp deploy.sh release/','chmod 755 release/deploy.sh');
      if(advanced) { file('release/config.json','{"port":8080}\n');service('active',true);service('enabled',true);solution.push('curl -o release/config.json https://example.com/config.json','systemctl start nginx','systemctl enable nginx'); }
      if(master) { archive('release.tar.gz',{'developers.txt':'alice\ncarol\n','deploy.sh':'#!/bin/sh\necho deploy\n','config.json':'{"port":8080}\n'});file('verified/developers.txt','alice\ncarol\n');mode('verified/deploy.sh','755');solution.push('tar -czf release.tar.gz -C release developers.txt deploy.sh config.json','mkdir verified','tar -xf release.tar.gz -C verified'); }
      break;
    default: throw new Error('未知 Boss 专题：' + boss.chapter);
  }
  return {id,level:boss.level,chapter:boss.chapter,title,context,theory:'自由选择工具；全部目标同时达成才能通关。',command:'',commands:[],goals,solution,seed:{files,dirs,setup},
    hints:['先检查输入和现状，再按目标拆分步骤。','注意输出格式、保留项和目录层级；可查阅命令手册。','参考解法：\n'+solution.join('\n')]};
}
