import { findExecutable, shellBuiltins } from './linux-filesystem.mjs';
// Small, documented teaching subsets; never invoke the host system.
const fail = message => { throw new Error(message); };
const rows = text => text ? text.replace(/\n$/, '').split('\n') : [];
const output = values => ({ stdout: Array.isArray(values) ? values.join('\n') + (values.length ? '\n' : '') : values, code: 0 });
export function runExtra(shell, command, args, stdin) {
  const text = files => files.length ? files.map(file => shell.read(file)).join('') : shell.readInput(stdin);
  const plain = () => { if (args.some(arg => arg.startsWith('-'))) fail(command + '：本沙盒不支持该参数'); };
  switch (command) {
    case 'realpath': plain(); if (!args.length) fail('realpath：缺少路径'); return output(args.map(path => { let resolved = shell.path(path); const seen = new Set();
        while(shell.node(resolved, false).type === 'link'){if(seen.has(resolved)||seen.size>20)fail('realpath：符号链接循环');seen.add(resolved);const node=shell.node(resolved,false);resolved=shell.path(node.target.startsWith('/')?node.target:resolved.slice(0,resolved.lastIndexOf('/')+1)+node.target);}
        return resolved; }));
    case 'mktemp': {
      let directory = false; const values = [...args];
      if (values[0] === '-d') { directory = true; values.shift(); }
      if (values.length > 1 || values.some(arg => arg.startsWith('-'))) fail('mktemp：只支持 -d 和一个模板');
      const template = values[0] || '/tmp/tmp.XXXXXX'; if (!/X{3,}$/.test(template)) fail('mktemp：模板末尾至少需要三个 X');
      let index = 1; let path;
      do { path = shell.path(template.replace(/X{3,}$/, String(index++).padStart(6, '0'))); } while (shell.state.fs[path]);
      if (shell.node(path.slice(0,path.lastIndexOf('/')) || '/').type !== 'dir') fail('mktemp：父路径不是目录');
      if (directory) shell.ensureDir(path); else shell.write(path, ''); shell.state.fs[path].mode = directory ? '700' : '600'; return output(path + '\n');
    }
    case 'truncate': {
      if (args[0] !== '-s' || !/^\d+$/.test(args[1] || '') || args.length < 3) fail('truncate：使用 -s 非负字节数 文件');
      const size = Number(args[1]); if (size > 100000) fail('truncate：教学文件大小上限 100000 字节');
      for (const path of args.slice(2)) {
        const old = shell.state.fs[shell.path(path)] ? shell.read(path) : '';
        if (!/^[\x00-\x7f]*$/.test(old)) fail('truncate：教学子集仅支持 ASCII 文件');
        shell.write(path, old.slice(0, size).padEnd(size, '\0'));
      } return output('');
    }
    case 'tac': plain(); return output(args.length ? args.map(file => rows(shell.read(file)).reverse().join('\n') + (shell.read(file) ? '\n' : '')).join('') : rows(shell.readInput(stdin)).reverse());
    case 'rev': plain(); return output(rows(text(args)).map(line => [...line].reverse().join('')));
    case 'nl': {
      const files = [...args]; let all = false;
      if (files[0] === '-ba') { all = true; files.shift(); }
      if (files.some(arg => arg.startsWith('-'))) fail('nl：只支持 -ba');
      let index = 0; return output(rows(text(files)).map(line => all || line.length ? String(++index).padStart(6) + '\t' + line : '       '));
    }
    case 'paste': {
      const files = [...args]; let delimiter = '\t';
      if (files[0] === '-d') { files.shift(); delimiter = files.shift(); if (!delimiter || [...delimiter].length !== 1) fail('paste：分隔符需为单个字符'); }
      if (!files.length || files.some(file => file.startsWith('-'))) fail('paste：需要文件，只支持 -d');
      const columns = files.map(file => rows(shell.read(file))); return output(Array.from({ length: Math.max(...columns.map(col => col.length)) }, (_, i) => columns.map(col => col[i] || '').join(delimiter)));
    }
    case 'comm': {
      const files = [...args]; const hidden = new Set();
      if (/^-[123]+$/.test(files[0] || '')) for (const c of files.shift().slice(1)) hidden.add(Number(c));
      if (files.length !== 2) fail('comm：需要两份已排序文件');
      const [a,b] = files.map(file => rows(shell.read(file)));
      for (const list of [a,b]) if (list.some((line,i) => i && list[i-1] > line)) fail('comm：输入必须按字符顺序排序');
      let i=0,j=0; const result=[];
      while (i<a.length || j<b.length) {
        let col,line;
        if (i<a.length && j<b.length && a[i]===b[j]) { col=3; line=a[i++]; j++; }
        else if (j>=b.length || i<a.length && a[i]<b[j]) { col=1; line=a[i++]; }
        else { col=2; line=b[j++]; }
        if (!hidden.has(col)) result.push('\t'.repeat([1,2].filter(n=>n<col&&!hidden.has(n)).length)+line);
      } return output(result);
    }
    case 'cmp': {
      if (args.length !== 2 || args.some(arg=>arg.startsWith('-'))) fail('cmp：只支持两个文件参数');
      const [a,b] = args.map(file => new TextEncoder().encode(shell.read(file)));
      const different = a.length!==b.length || a.some((value,i)=>value!==b[i]);
      return { stdout: different ? `${args[0]} ${args[1]} differ\n` : '', code: different ? 1 : 0 };
    }
    case 'expand': case 'unexpand': {
      const files=[...args]; let width=8;
      if (files[0]==='-t') { files.shift(); width=Number(files.shift()); }
      if (!Number.isInteger(width)||width<1||width>32||files.some(file=>file.startsWith('-'))) fail(command+'：只支持 -t 1..32');
      return output(rows(text(files)).map(line=>{
        if (command==='unexpand') { const leading=line.match(/^ */)[0].length; return '\t'.repeat(Math.floor(leading/width))+' '.repeat(leading%width)+line.slice(leading); }
        let col=0; return [...line].map(c=>{ if(c==='\t'){const spaces=width-col%width;col+=spaces;return ' '.repeat(spaces);} col++;return c; }).join('');
      }));
    }
    case 'fold': {
      const files=[...args]; let width=80;
      if(files[0]==='-w'){files.shift();width=Number(files.shift());}
      if(!Number.isInteger(width)||width<1||width>1000||files.some(file=>file.startsWith('-'))) fail('fold：只支持 -w 1..1000');
      return output(rows(text(files)).flatMap(line=>{const chars=[...line];if(!chars.length)return [''];const parts=[];for(let i=0;i<chars.length;i+=width)parts.push(chars.slice(i,i+width).join(''));return parts;}));
    }
    case 'seq': {
      let separator='\n'; const values=[...args]; if(values[0]==='-s'){values.shift();separator=values.shift();if(separator===undefined)fail('seq：缺少分隔符');}
      if(values.length<1||values.length>3||values.some(n=>!/^[-+]?\d+$/.test(n)))fail('seq：教学子集只接受整数');
      const numbers=values.map(Number), start=numbers.length===1?1:numbers[0], end=numbers.at(-1), step=numbers.length===3?numbers[1]:1;
      if(numbers.some(n=>!Number.isSafeInteger(n)))fail('seq：需要安全范围内的整数');if(!step)fail('seq：步长不能为零');const result=[];
      for(let n=start;step>0?n<=end:n>=end;n+=step){if(result.length>=1000)fail('seq：输出上限 1000 项');result.push(n);}
      return output(result.length?result.join(separator)+'\n':'');
    }
    case 'sleep': if(args.length!==1||!/^\d+(\.\d+)?$/.test(args[0]))fail('sleep：只支持非负秒数');return output('');
    case 'which': case 'type': {
      if(!args.length)fail(command+'：缺少命令名'); plain();
      return output(args.map(name=> {
        if (command === 'type' && shellBuiltins.has(name)) return `${name} is a shell builtin`;
        const path = findExecutable(shell,name);
        if (!path) fail(name+'：未找到');
        return command === 'type' ? `${name} is ${path}` : path;
      }));
    }
    case 'nproc': if(args.length)fail('nproc：只支持无参数');return output('4\n');
    case 'groups': if(args.length)fail('groups：只支持当前用户');return output('learner sudo\n');
    case 'who': if(args.length)fail('who：只支持无参数');return output('learner pts/0 2026-10-11 09:00\n');
    case 'w': if(args.length)fail('w：只支持无参数');return output('09:00:00 up 2 days, 1 user, load average: 0.10, 0.05, 0.01\nUSER    TTY    WHAT\nlearner pts/0  bash\n');
    case 'tty': if(args.length)fail('tty：只支持无参数');return output('/dev/pts/0\n');
    case 'lscpu': if(args.length)fail('lscpu：只支持无参数');return output('Architecture: x86_64\nCPU(s): 4\nModel name: Teaching CPU\n');
    case 'lsblk': if(args.length && !(args.length===1&&args[0]==='-f'))fail('lsblk：只支持 -f');return output(args[0]==='-f'?'NAME FSTYPE LABEL MOUNTPOINTS\nsda\n└─sda1 ext4 lab /\n':'NAME MAJ:MIN SIZE TYPE MOUNTPOINTS\nsda 8:0 20G disk\n└─sda1 8:1 20G part /\n');
    case 'findmnt': if(args.length)fail('findmnt：只支持无参数');return output('TARGET SOURCE FSTYPE OPTIONS\n/ /dev/sda1 ext4 rw,relatime\n');
    case 'vmstat': if(args.length)fail('vmstat：只支持无参数');return output('procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----\nr b swpd free buff cache si so bi bo in cs us sy id wa st\n1 0 0 524288 32768 262144 0 0 0 0 20 30 2 1 97 0 0\n');
    case 'dmesg': if(args.length)fail('dmesg：只支持无参数');return output('[0.000000] Linux version 6.8.0-lab\n[1.000000] EXT4-fs (sda1): mounted filesystem\n');
    default: return undefined;
  }
}
