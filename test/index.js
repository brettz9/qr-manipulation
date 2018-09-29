import $ from '../node_modules/query-result/esm/index.js';

// import {manipulation} from '../dist/index-es.js';
import {manipulation} from '../src/index.js';

import {test, describe, it, beforeEach, afterEach, assert, mocha} from './lite-mocha.js';

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

function domMatchesString (msg, qr, expected) {
  if (arguments.length === 2) {
    expected = qr;
    qr = msg;
    msg = undefined;
  }
  const actual = qr.nodeValue || qr.outerHTML; // text nodes and elements
  assert(actual === expected, `Expected HTML${msg ? ` (${msg})` : ''}: ${
    escapeHTML(expected)
  };<br> actual: ${escapeHTML(actual)}`);
}

describe('qr manipulation tests', () => {
  beforeEach(function () {
    testAreaDOM.append(...['test1', 'test2'].map((text) => {
      const p = document.createElement('p');
      p.textContent = text;
      return p;
    }));
    this.p = $('#test-area > p').after(function (i, oldTxt) {
      const node = document.createElement('div');
      node.textContent = oldTxt + '::' + i;
      return node;
    });
  });
  afterEach(() => {
    testAreaDOM.textContent = '';
  });
  it('`after` and `before`', function () {
    console.log('thisthis', this);
    const {p} = this.test.parent.ctx;
    domMatchesString('after1', p[0].nextElementSibling, `<div>test1::0</div>`);
    domMatchesString('after2', p[1].nextElementSibling, `<div>test2::1</div>`);

    p.before(function (i, oldTxt) {
      const node = document.createElement('div');
      node.textContent = 'aaaa:' + oldTxt + '::' + i;
      return node;
    });
    domMatchesString('before1', p[0].previousElementSibling, `<div>aaaa:test1::0</div>`);
    domMatchesString('before2', p[1].previousElementSibling, `<div>aaaa:test2::1</div>`);
  });
  it('`after` and `before` (chained)', function () {
    const {p} = this.test.parent.ctx;
    p.after('<b>ooo</b>').before(
      '<i>eee</i>', '<u>uuu</u>'
    ).after(document.createTextNode('----'), document.createElement('hr'), document.createElement('br'));
    domMatchesString('after and before chained (previous) 1', p[1].previousElementSibling.previousElementSibling, `<i>eee</i>`);
    domMatchesString('after and before chained (previous) 2', p[0].previousElementSibling, `<u>uuu</u>`);
    domMatchesString('after and before chained (previous) 3', p[1].previousElementSibling.previousElementSibling, `<i>eee</i>`);
    domMatchesString('after and before chained (previous) 4', p[0].previousElementSibling, `<u>uuu</u>`);

    domMatchesString('after and before chained (next) 1', p[0].nextSibling, `----`);
    domMatchesString('after and before chained (next) 2', p[1].nextSibling, `----`);
    domMatchesString('after and before chained (next) 3', p[0].nextElementSibling, `<hr>`);
    domMatchesString('after and before chained (next) 4', p[1].nextElementSibling, `<hr>`);
    domMatchesString('after and before chained (next) 5', p[0].nextElementSibling.nextElementSibling, `<br>`);
    domMatchesString('after and before chained (next) 6', p[1].nextElementSibling.nextElementSibling, `<br>`);
  });

  // Todo: Check last element in target does not have clones added
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
