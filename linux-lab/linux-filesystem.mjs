// Deterministic Linux layout; these files never access the host computer.
import { extraEntries } from './catalogue.mjs';
export const shellBuiltins = new Set('cd pwd echo printf export unset help history type true false test umask'.split(' '));
const corePrograms = 'pwd ls tree man mkdir touch cp mv rm rmdir file stat basename dirname cat less more head tail grep find wc sort uniq cut tr sed awk diff echo printf tee xargs env printenv clear true false chmod chown ln readlink sudo tar gzip gunzip ps pgrep kill pkill top free df du uname whoami id hostname date uptime ip ss ping dig nslookup curl wget systemctl journalctl apt bash sh'.split(' ');
const programs = [...new Set([...corePrograms, ...extraEntries.filter(row=>row[8] && !shellBuiltins.has(row[0])).map(row=>row[0])])];
const parent = path => path.slice(0,path.lastIndexOf('/')) || '/';
export function populateLinuxFilesystem(state) {
  if (state.filesystemVersion >= 1) return state;
  const fs = state.fs;
  function dir(path, mode='755') {
    if (fs[path]) return;
    if (path !== '/') dir(parent(path));
    fs[path] = {type:'dir',mode,owner:'root'};
  }
  function file(path,text,mode='644',extra={}) {
    dir(parent(path));
    fs[path] ??= {type:'file',text,mode,owner:'root',...extra};
  }
  for (const path of ['/bin','/sbin','/boot','/dev/pts','/dev/shm','/etc/apt/sources.list.d','/etc/ssh','/etc/systemd/system','/home','/lib/modules','/lib64','/media','/mnt','/opt','/proc/1','/proc/42','/proc/314','/root','/run/user/1000','/srv','/sys/class/net/eth0','/sys/block/sda','/tmp','/usr/bin','/usr/sbin','/usr/lib','/usr/local/bin','/usr/local/sbin','/usr/share/man/man1','/usr/share/doc','/var/cache/apt','/var/lib/dpkg','/var/log','/var/tmp','/var/spool/cron']) dir(path);
  // Existing application fixtures stay intact, including learner-created files.
  const files = {
    '/etc/os-release':'PRETTY_NAME="Debian GNU/Linux 12 (bookworm)"\nNAME="Debian GNU/Linux"\nID=debian\nVERSION_ID="12"\n',
    '/etc/passwd':'root:x:0:0:root:/root:/bin/bash\nlearner:x:1000:1000:Linux Learner:/home/learner:/bin/bash\n',
    '/etc/group':'root:x:0:\nsudo:x:27:learner\nlearner:x:1000:\n',
    '/etc/hostname':'lab\n', '/etc/hosts':'127.0.0.1 localhost\n192.0.2.10 lab\n',
    '/etc/resolv.conf':'nameserver 192.0.2.53\n', '/etc/fstab':'/dev/lab / ext4 defaults 0 1\n',
    '/etc/profile':'export PATH=/usr/local/bin:/usr/bin:/bin\n',
    '/etc/shells':'/bin/sh\n/bin/bash\n', '/etc/issue':'Debian GNU/Linux 12 lab\\n\\l\n',
    '/etc/apt/sources.list':'deb https://deb.debian.org/debian bookworm main\n',
    '/etc/ssh/sshd_config':'Port 22\nPermitRootLogin no\n',
    '/etc/systemd/system/nginx.service':'[Unit]\nDescription=nginx\n[Service]\nExecStart=/usr/sbin/nginx\n',
    '/proc/version':'Linux version 6.8.0 (learner@lab)\n',
    '/proc/cpuinfo':'processor\t: 0\nmodel name\t: Teaching CPU\ncpu cores\t: 4\n',
    '/proc/meminfo':'MemTotal:        4194304 kB\nMemFree:         3145728 kB\nMemAvailable:    3145728 kB\n',
    '/proc/mounts':'/dev/lab / ext4 rw,relatime 0 0\nproc /proc proc rw 0 0\nsysfs /sys sysfs rw 0 0\n',
    '/proc/uptime':'172800.00 600000.00\n',
    '/proc/1/comm':'systemd\n', '/proc/42/comm':'bash\n', '/proc/314/comm':'worker\n',
    '/sys/class/net/eth0/address':'02:00:00:00:00:10\n', '/sys/class/net/eth0/operstate':'up\n',
    '/sys/block/sda/size':'41943040\n', '/var/log/syslog':'Oct 11 09:00:00 lab systemd[1]: Started Linux learning environment.\n',
    '/var/log/auth.log':'Oct 11 09:00:00 lab login: session opened for user learner\n',
    '/usr/share/doc/README':'Linux command learning environment. System files are deterministic fixtures.\n'
  };
  for (const [path,text] of Object.entries(files)) file(path,text);
  for (const name of programs) {
    file('/usr/bin/'+name,'\x7fELF\x02\x01\x01\x00', '755',{binary:true,command:name});
    file('/bin/'+name,'\x7fELF\x02\x01\x01\x00', '755',{binary:true,command:name});
  }
  for (const name of ['nginx','systemd']) file('/usr/sbin/'+name,'\x7fELF\x02\x01\x01\x00','755',{binary:true,command:name});
  for (const name of ['null','zero','random','urandom','tty','pts/0','lab','sda','sda1']) file('/dev/'+name,'','666',{device:true});
  fs['/proc/self'] ??= {type:'link',target:'42',mode:'777',owner:'root'};
  state.filesystemVersion = 1;
  return state;
}
export function findExecutable(shell,name) {
  const paths = name.includes('/') ? [shell.path(name)] : (shell.state.env.PATH || '').split(':').map(path=>shell.path((path || '.')+'/'+name));
  return paths.find(path=> {
    try { const node=shell.node(path);return node.type==='file' && !!(parseInt(node.mode,8)&0o111); }
    catch { return false; }
  });
}
