import test from 'node:test';
import assert from 'node:assert/strict';
import {Shell,seedState,HOME} from '../linux-lab/shell.mjs';
import {manuals} from '../linux-lab/curriculum.mjs';
import {shellBuiltins} from '../linux-lab/linux-filesystem.mjs';
const shell=()=>new Shell(seedState(),manuals);
test('every advertised external command resolves to an executable in a browsable directory',()=>{
  const s=shell();
  for (const {name} of manuals.filter(m=>m.practice&&!shellBuiltins.has(m.name))) {
    const result=s.execute('which '+name);
    assert.equal(result.code,0,name);
    const path=result.stdout.trim();
    assert.equal(s.node(path).type,'file',name);
    assert.equal(s.execute('ls '+path).code,0,name);
    assert.equal(s.execute('cd '+path.slice(0,path.lastIndexOf('/'))).code,0,name);
    assert.ok(parseInt(s.node(path).mode,8)&0o111,name);
  }
});
test('which honors PATH order, executable permissions and missing binaries',()=>{
  const s=shell();s.execute('cp /usr/bin/ls /usr/local/bin/ls');
  assert.equal(s.execute('which ls').stdout,'/usr/local/bin/ls\n');
  s.execute('chmod 644 /usr/local/bin/ls');
  assert.equal(s.execute('which ls').stdout,'/usr/bin/ls\n');
  s.execute('export PATH=/usr/local/bin');
  assert.equal(s.execute('which ls').code,1);
  assert.equal(s.execute('which unknown').code,1);
  assert.equal(s.execute('type cd').stdout,'cd is a shell builtin\n');
  assert.equal(s.execute('which cd').code,1);
});
test('absolute program paths execute the same teaching operation and file identifies binaries',()=>{
  const s=shell();
  assert.equal(s.execute('/usr/bin/ls projects').stdout,s.execute('ls projects').stdout);
  assert.equal(s.execute('/bin/pwd').stdout,HOME+'\n');
  assert.match(s.execute('file /usr/bin/ls').stdout,/ELF 64-bit/);
  s.execute('chmod 644 /usr/bin/ls');
  assert.equal(s.execute('/usr/bin/ls').code,1);
});
test('common Linux directories and readable configuration are available',()=>{
  const s=shell();
  for(const dir of ['/bin','/boot','/dev','/etc','/home','/lib','/lib64','/media','/mnt','/opt','/proc','/root','/run','/sbin','/srv','/sys','/tmp','/usr','/var','/usr/local/bin','/usr/share/man','/var/log']) assert.equal(s.node(dir).type,'dir',dir);
  assert.match(s.execute('cat /etc/os-release').stdout,/Debian/);
  assert.match(s.execute('cat /etc/passwd').stdout,/learner:x:1000:1000/);
  assert.equal(s.execute('cat /proc/self/comm').stdout,'bash\n');
  assert.equal(s.execute('cd /proc/self').code,0);
  assert.equal(s.execute('pwd').stdout,'/proc/42\n');
  s.execute('echo ignored > /dev/null');
  assert.equal(s.execute('cat /dev/null').stdout,'');
});
test('old sessions acquire system directories without replacing learner data or resurrecting later deletions',()=>{
  const state=seedState();delete state.filesystemVersion;
  for(const path of Object.keys(state.fs))if(path.startsWith('/usr'))delete state.fs[path];
  state.fs['/etc/hosts'].text='custom hosts\n';
  const s=new Shell(state,manuals);
  assert.equal(s.execute('which ls').stdout,'/usr/bin/ls\n');
  assert.equal(s.read('/etc/hosts'),'custom hosts\n');
  s.execute('rm /usr/bin/ls');
  const restored=new Shell(s.state,manuals);
  assert.equal(restored.state.fs['/usr/bin/ls'],undefined);
  assert.equal(restored.read('projects/notes.txt'),'draft\n');
});
