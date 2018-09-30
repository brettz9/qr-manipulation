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
const qs = (sel) => document.querySelector(sel);
const qsa = (sel) => document.querySelectorAll(sel);

const testAreaDOM = qs('#test-area');
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

function domMatchesString (msg, qr, expected, not, argLen2) {
  if (arguments.length === 2 || argLen2) {
    expected = qr;
    qr = msg;
    msg = undefined;
  }
  const actual = qr.nodeValue || qr.outerHTML; // text nodes and elements
  assert(not ? actual !== expected : actual === expected, `Expected HTML${msg ? ` (${msg})` : ''}: ${
    escapeHTML(expected)
  };<br> actual: ${escapeHTML(actual)}`);
}

function domNotMatchesString (msg, qr, expected) {
  return domMatchesString(msg, qr, expected, true, arguments.length === 2);
}
function setup () { // We should fix `beforeEach` so can work in outer scope too and avoid need for this
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
}
describe('qr-manipulation', function () {
  describe('`after` and `before`', function () {
    setup();
    it('`after` and `before` (basic operation)', function () {
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

    it('`after`/`before` (only cloning for non-final items)', function () {
      const {p} = this.test.parent.ctx;
      const [div1] = [...qsa('#test-area > div')];
      p.after(div1); // Should make a copy of div1 after the first p and move the real one to after the 2nd p
      domMatchesString('First item(s) gets the content', p[0].nextElementSibling, '<div>test1::0</div>');
      domMatchesString('Final item gets the content', p[1].nextElementSibling, '<div>test1::0</div>');
      domMatchesString('Only one div is left intervening', p[0].nextElementSibling.nextElementSibling, '<p>test2</p>');
      assert(p[0].nextElementSibling !== div1, 'The first item(s) in a set get clones');
      assert(p[1].nextElementSibling === div1, 'The last item in a set gets the actual node');
    });

    it('`after`/`before` (types: HTML string, text node, arrays)', function () {
      const {p} = this.test.parent.ctx;
      p.after('the', '<i>fake</i>', document.createTextNode(' end '), [
        'the', '<b>actual</b>', document.createTextNode(' end ')
      ]);
      assert(p[0].nextSibling.nodeValue === 'the');
      domMatchesString(p[0].nextElementSibling, '<i>fake</i>');
      assert(p[0].nextElementSibling.nextSibling.nodeValue === ' end ');
      assert(p[0].nextElementSibling.nextSibling.nextSibling.nodeValue === 'the');
      domMatchesString(p[0].nextElementSibling.nextElementSibling, '<b>actual</b>');
      assert(p[0].nextElementSibling.nextElementSibling.nextSibling.nodeValue === ' end ');
    });
  });
  describe('`append` and `prepend`', function () {
    setup();
    it('`append`', function () {
      const {p} = this.test.parent.ctx;
      p[0].appendChild(document.createElement('br'));
      p[1].appendChild(document.createElement('br'));
      p.append('<b>END</b>');
      domMatchesString(p[0].lastElementChild, '<b>END</b>');
      domNotMatchesString(p[0].lastElementChild.previousElementSibling, '<b>END</b>');
      domMatchesString(p[1].lastElementChild, '<b>END</b>');
      domNotMatchesString(p[1].lastElementChild.previousElementSibling, '<b>END</b>');
    });
    it('`prepend`', function () {
      const {p} = this.test.parent.ctx;
      p[0].appendChild(document.createElement('br'));
      p[1].appendChild(document.createElement('br'));
      p.prepend('<b>BEGIN</b>');
      domMatchesString(p[0].firstElementChild, '<b>BEGIN</b>');
      domNotMatchesString(p[0].firstElementChild.nextElementSibling, '<b>BEGIN</b>');
      domMatchesString(p[1].firstElementChild, '<b>BEGIN</b>');
      domNotMatchesString(p[1].firstElementChild.nextElementSibling, '<b>BEGIN</b>');
    });
    it('`append` and `prepend` (chained)', function () {
      const {p} = this.test.parent.ctx;
      p.append('<b>END</b>').prepend('<b>BEGIN</b>');
      domMatchesString(p[0].firstElementChild, '<b>BEGIN</b>');
      domMatchesString(p[0].firstElementChild.nextElementSibling, '<b>END</b>');
      domMatchesString(p[1].firstElementChild, '<b>BEGIN</b>');
      domMatchesString(p[1].firstElementChild.nextElementSibling, '<b>END</b>');
    });

    it('`append`/`prepend` (only cloning for non-final items)', function () {
      const {p} = this.test.parent.ctx;
      const [div1] = [...qsa('#test-area > div')];
      p.append(div1); // Should make a copy of div1 after the first p and move the real one to after the 2nd p
      domMatchesString('First item(s) gets the content', p[0].firstElementChild, '<div>test1::0</div>');
      domMatchesString('Final item gets the content', p[1].firstElementChild, '<div>test1::0</div>');
      domMatchesString('No first div is left', p[0].nextElementSibling, '<p>test2<div>test1::0</div></p>');
      assert(p[0].firstElementChild !== div1, 'The first item(s) in a set get clones');
      assert(p[1].firstElementChild === div1, 'The last item in a set gets the actual node');
    });
    it('`append`/`prepend` (types: HTML string, text node, arrays)', function () {
      const {p} = this.test.parent.ctx;
      p.prepend('the', '<i>fake</i>', document.createTextNode(' end '), [
        'the', '<b>actual</b>', document.createTextNode(' end ')
      ]);
      assert(p[0].firstChild.nodeValue === 'the');
      domMatchesString(p[0].firstElementChild, '<i>fake</i>');
      assert(p[0].firstElementChild.nextSibling.nodeValue === ' end ');
      assert(p[0].firstElementChild.nextSibling.nextSibling.nodeValue === 'the');
      domMatchesString(p[0].firstElementChild.nextElementSibling, '<b>actual</b>');
      assert(p[0].firstElementChild.nextElementSibling.nextSibling.nodeValue === ' end ');
    });
  });

  describe('`appendTo` and `prependTo`', function () {
    setup();
    it('`appendTo`', function () {
      const {p} = this.test.parent.ctx;
      p[0].appendChild(document.createElement('br'));
      p[1].appendChild(document.createElement('br'));
      p.appendTo('<b>END</b>');
      domMatchesString(p[0].lastElementChild, '<b>END</b>');
      domNotMatchesString(p[0].lastElementChild.previousElementSibling, '<b>END</b>');
      domMatchesString(p[1].lastElementChild, '<b>END</b>');
      domNotMatchesString(p[1].lastElementChild.previousElementSibling, '<b>END</b>');
    });
    it('`prependTo`', function () {
      const {p} = this.test.parent.ctx;
      p[0].appendChild(document.createElement('br'));
      p[1].appendChild(document.createElement('br'));
      p.prependTo('<b>BEGIN</b>');
      domMatchesString(p[0].firstElementChild, '<b>BEGIN</b>');
      domNotMatchesString(p[0].firstElementChild.nextElementSibling, '<b>BEGIN</b>');
      domMatchesString(p[1].firstElementChild, '<b>BEGIN</b>');
      domNotMatchesString(p[1].firstElementChild.nextElementSibling, '<b>BEGIN</b>');
    });
    it('`appendTo` and `prependTo` (chained)', function () {
      const {p} = this.test.parent.ctx;
      p.appendTo('<b>END</b>').prependTo('<b>BEGIN</b>');
      domMatchesString(p[0].firstElementChild, '<b>BEGIN</b>');
      domMatchesString(p[0].firstElementChild.nextElementSibling, '<b>END</b>');
      domMatchesString(p[1].firstElementChild, '<b>BEGIN</b>');
      domMatchesString(p[1].firstElementChild.nextElementSibling, '<b>END</b>');
    });

    it('`appendTo`/`prependTo` (only cloning for non-final items)', function () {
      const {p} = this.test.parent.ctx;
      const [div1] = [...qsa('#test-area > div')];
      p.appendTo(div1); // Should make a copy of div1 after the first p and move the real one to after the 2nd p
      domMatchesString('First item(s) gets the content', p[0].firstElementChild, '<div>test1::0</div>');
      domMatchesString('Final item gets the content', p[1].firstElementChild, '<div>test1::0</div>');
      domMatchesString('No first div is left', p[0].nextElementSibling, '<p>test2<div>test1::0</div></p>');
      assert(p[0].firstElementChild !== div1, 'The first item(s) in a set get clones');
      assert(p[1].firstElementChild === div1, 'The last item in a set gets the actual node');
    });
    it('`appendTo`/`prependTo` (types: HTML string, text node, arrays)', function () {
      const {p} = this.test.parent.ctx;
      p.prependTo('the', '<i>fake</i>', document.createTextNode(' end '), [
        'the', '<b>actual</b>', document.createTextNode(' end ')
      ]);
      assert(p[0].firstChild.nodeValue === 'the');
      domMatchesString(p[0].firstElementChild, '<i>fake</i>');
      assert(p[0].firstElementChild.nextSibling.nodeValue === ' end ');
      assert(p[0].firstElementChild.nextSibling.nextSibling.nodeValue === 'the');
      domMatchesString(p[0].firstElementChild.nextElementSibling, '<b>actual</b>');
      assert(p[0].firstElementChild.nextElementSibling.nextSibling.nodeValue === ' end ');
    });
    it('Use with selectors');
    // Todo: Test arrays within arrays
  });
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
/* eslint-disable */

// 'appendTo', 'prependTo', 'insertAfter', 'insertBefore',

// 'html', 'text',
const div = document.createElement('div');
div.className = 'aDiv';

const i = document.createElement('i');
i.textContent = 'another end';

testArea.append(div);
testArea.append(div.cloneNode(true));
$('.aDiv').html(i);
// ----

const div2 = document.createElement('div');
div2.id = 'anotherDiv';
testArea.append(div2);

$('#anotherDiv').text(i);
// ----

const div3 = document.createElement('div');
div3.id = 'anotherDiv3';
testArea.append(div3);
const frag = document.createDocumentFragment();
frag.append('a', document.createElement('hr'), 'b');
$('#anotherDiv3').html(frag);
// ----

const div4 = document.createElement('div');
div4.id = 'anotherDiv4';
testArea.append(div4);
const qr = $('hr');
$('#anotherDiv4').html([document.createElement('hr'), ...qr]);
// ----

// 'clone',
// 'attr',
// 'addClass', 'hasClass', 'removeClass', 'toggleClass'

test.end();
})();
