const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const vm = require('node:vm');

test('Hessian articles configure dollar-delimited inline math before loading MathJax 3', () => {
  for (const locale of ['', 'en', 'ja', 'ru', 'zh-TW']) {
    const page = readFileSync(resolve(__dirname, '..', locale, 'blogs/h/index.html'), 'utf8');
    const scripts = [...page.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
    const renderer = scripts.findIndex(match => /src="[^"]*\/mathjax\/3\./.test(match[1]));
    const config = scripts.findIndex(match => /src="\/js\/mathjax-config\.js\?/.test(match[1]));
    assert.ok(config >= 0 && config < renderer, `${locale || 'zh-CN'}: configure inline math before the renderer`);
    assert.ok(!page.includes('MathJax.Hub.Config'), 'obsolete v2 configuration must be removed');
    const context = { window: {} };
    const file = scripts[config][1].match(/src="([^"?]+)/)[1];
    vm.runInNewContext(readFileSync(resolve(__dirname, '..', '.' + file), 'utf8'), context);
    const delimiters = JSON.parse(JSON.stringify(context.window.MathJax.tex.inlineMath));
    assert.deepEqual(delimiters, [['$', '$'], ['\\(', '\\)']]);
    assert.match(page, /\$f\$/, 'retain the original article formula source');
  }
});
