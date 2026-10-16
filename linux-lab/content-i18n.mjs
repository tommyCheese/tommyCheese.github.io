import { createTranslator } from './i18n-core.mjs';
import { resolve } from './shell.mjs';

// Translate complete course-supplied lines, preserving paths and learner input.
export function createContentLocalizer(catalog, sourceTexts, previousCatalog = {}) {
  const translate=createTranslator(catalog), previous=createTranslator(previousCatalog);
  const lines=new Set(sourceTexts.flatMap(text=>text.split('\n')).filter(line=>/[\u3400-\u9fff]/.test(line)));
  lines.add('[教学 gzip]');
  const replacements=new Map();
  for (const line of lines) {
    replacements.set(line,translate(line));
    replacements.set(previous(line),translate(line));
  }
  const archive='[教学归档：{count} 个条目]';
  const escape=text=>text.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const archivePatterns=[archive,previous(archive)].map(template=>new RegExp('^'+template.split('{count}').map(escape).join('(\\d+)')+'$'));
  function text(value) {
    return value.split('\n').map(line=>{
      if (replacements.has(line)) return replacements.get(line);
      for (const pattern of archivePatterns) {
        const match=line.match(pattern);
        if (match) return translate(archive).replace('{count}',match[1]);
      }
      return line;
    }).join('\n');
  }
  const literal=new Set(['command','commands','history','solution','coreSolution','flowBefore','flowAfter','setup','path','target','cwd','previous','env','changes','entries','flowAssets','browsePath','previewPath']);
  function localize(value) {
    if (typeof value === 'string') return text(value);
    if (Array.isArray(value)) {
      const items=value.map(localize);
      // Expected stat sizes must follow the localized file contents.
      for (const goal of items) if (goal?.type === 'output' && goal.normalizeFilePath && goal.exact) {
        const path=goal.exact.match(/^File: (.+)\nSize: \d+\n/);
        const file=path && items.find(item=>item?.type === 'file' && item.text !== undefined && resolve(item.path) === resolve(path[1]));
        const contents=file?.text ?? goal.statText;
        if (contents !== undefined) goal.exact=goal.exact.replace(/\nSize: \d+\n/,'\nSize: '+contents.length+'\n');
      }
      return items;
    }
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,literal.has(key) ? structuredClone(item) : localize(item)]));
    return value;
  }
  return localize;
}
