const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

for (const locale of ['', 'en', 'ja', 'ru', 'zh-TW']) {
  test(`homepage image follows initial theme and both toggles: ${locale || 'zh-CN'}`, () => {
    const page = fs.readFileSync(path.join(__dirname, '..', locale, 'index.html'), 'utf8');
    const source = page.match(/<script data-reading-layout="hero-theme">([\s\S]*?)<\/script>/)[1];
    for (const initialDark of [false, true]) {
      let dark = initialDark;
      const image = {};
      let onClick;
      vm.runInNewContext(source, {
        document: {
          body: { classList: { contains: () => dark } },
          getElementById: id => id === 'dynImg' ? image : {
            addEventListener: (event, callback) => { assert.equal(event, 'click'); onClick = callback; }
          }
        }
      });
      assert.equal(image.src, initialDark ? '/exporeImages/2.jpg' : '/images/town.jpg');
      dark = !initialDark;
      onClick();
      assert.equal(image.src, dark ? '/exporeImages/2.jpg' : '/images/town.jpg');
      dark = initialDark;
      onClick();
      assert.equal(image.src, initialDark ? '/exporeImages/2.jpg' : '/images/town.jpg');
    }
  });
}
