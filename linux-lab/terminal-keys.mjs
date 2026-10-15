// Readline-style editing in a single-line input; positions use DOM UTF-16 offsets.
export function editTerminalLine(value, start, end, key, yank = '') {
  const previous = () => start - (Array.from(value.slice(0, start)).at(-1)?.length || 0);
  const next = () => Math.min(value.length, end + (value.codePointAt(end) > 0xffff ? 2 : 1));
  const move = position => ({value, start:position, end:position});
  if (key === 'a') return move(0);
  if (key === 'e') return move(value.length);
  if (key === 'b') return move(start === end ? previous() : start);
  if (key === 'f') return move(start === end ? next() : end);
  if (key === 'y') return {value:value.slice(0,start) + yank + value.slice(end),start:start + yank.length,end:start + yank.length};
  if (!['u','k','w','h','d'].includes(key)) return null;
  let from = start, to = end;
  if (start === end) {
    if (key === 'u') from = 0;
    if (key === 'k') to = value.length;
    if (key === 'w') from = start - (value.slice(0,start).match(/\S+\s*$|\s+$/u)?.[0].length || 0);
    if (key === 'h') from = previous();
    if (key === 'd') to = next();
  }
  return {
    value:value.slice(0,from) + value.slice(to), start:from, end:from,
    ...(['u','k','w'].includes(key) && from !== to ? {killed:value.slice(from,to),backward:key !== 'k'} : {})
  };
}
