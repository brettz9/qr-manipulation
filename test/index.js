import $ from '../node_modules/query-result/esm/index.js';

// import {manipulation} from '../dist/index-es.js';
import {manipulation} from '../src/index.js';

import {test, describe, it, beforeEach, assert, mocha} from './lite-mocha.js';

manipulation($);

// Todo: Move to traversal
$.extend('each', function each (cb, thisObj) {
  this.forEach(cb, thisObj);
  return this;
});

(async () => {
const testAreaDOM = document.querySelector('#test-area');
const testArea = $('#test-area');
const $context = $('#results')[0];
mocha.setup({ui: 'tdd', $context, $allowHTML: true});
/*
function qrMatchesString (qr, expected) {
  const actual = qr[0].outerHTML;
  assert(actual === expected, `Expected HTML: ${expected}; actual: ${actual}`);
}
*/
function escapeHTML (s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function domMatchesString (qr, expected, msg) {
  const actual = qr.outerHTML;
  assert(actual === expected, `Expected HTML${msg ? ` (${msg})` : ''}: ${
    escapeHTML(expected)
  };<br> actual: ${escapeHTML(actual)}`);
}

describe('qr manipulation tests', () => {
  beforeEach(() => {
    testAreaDOM.textContent = '';
    testAreaDOM.append(...['test1', 'test2'].map((text) => {
      const p = document.createElement('p');
      p.textContent = text;
      return p;
    }));
  });
  it('`after` and `before`', () => {
    const p = $('#test-area > p').after(function (i, oldTxt) {
      const node = document.createElement('div');
      node.textContent = oldTxt + '::' + i;
      return node;
    });
    domMatchesString(p[0].nextElementSibling, `<div>test1::0</div>`, 'after1');
    domMatchesString(p[1].nextElementSibling, `<div>test2::1</div>`, 'after2');

    p.before(function (i, oldTxt) {
      const node = document.createElement('div');
      node.textContent = 'aaaa:' + oldTxt + '::' + i;
      return node;
    });
    domMatchesString(p[0].previousElementSibling, `<div>aaaa:test1::0</div>`, 'before1');
    domMatchesString(p[1].previousElementSibling, `<div>aaaa:test2::1</div>`, 'before2');

    p.after('<b>ooo</b>').before('<i>eee</i>', '<u>uuu</u>'
    ).after(document.createTextNode('----'), document.createElement('hr'));
  });
  // describe('qr manipulation inner', () => {});
});

/*
$('p').map((p) => {
  console.log('p', p);
  return p;
}).each(function (p) {
  console.log('ppp', p);
})
*/
/*
test(1, 'ok');
test(0, 'failed');
test.log('abce\n### def');
await test.async((done) => {
  setTimeout(() => {
    console.log('cccc');
    done();
  }, 500);
}, 1000);
*/
return;
testArea.append('the', document.createTextNode(' '), '<b>end</b>');

$('#test-area > *:first-child').prepend('<b>BEGIN</b>');

const p = document.createElement('p');
p.className = 'move';
p.textContent = 'of the end';
testArea[0].append(p);
const p2 = document.createElement('p');
p2.className = 'move';
p2.textContent = 'was at end';
testArea[0].append(p2);

testArea.before($('p.move')[0], $('p.move')[1]);

const div = document.createElement('div');
div.className = 'aDiv';

const i = document.createElement('i');
i.textContent = 'another end';

testArea.append(div);
testArea.append(div.cloneNode(true));
$('.aDiv').html(i);

const div2 = document.createElement('div');
div2.id = 'anotherDiv';
testArea.append(div2);

$('#anotherDiv').text(i);

const div3 = document.createElement('div');
div3.id = 'anotherDiv3';
testArea.append(div3);
const frag = document.createDocumentFragment();
frag.append('a', document.createElement('hr'), 'b');
$('#anotherDiv3').html(frag);

const div4 = document.createElement('div');
div4.id = 'anotherDiv4';
testArea.append(div4);
const qr = $('hr');
$('#anotherDiv4').html([document.createElement('hr'), ...qr]);

test.end();
})();
