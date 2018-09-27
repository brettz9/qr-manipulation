import tressa from '../node_modules/tressa/tressa-es.js';

import $ from '../node_modules/query-result/esm/index.js';
// import {manipulation} from '../dist/index-es.js';
import {manipulation} from '../src/index.js';

manipulation($);

// Todo: Move to traversal
$.extend('each', function each (cb, thisObj) {
  this.forEach(cb, thisObj);
  return this;
});
/*
$('p').map((p) => {
  console.log('p', p);
  return p;
}).each(function (p) {
  console.log('ppp', p);
})
*/

console.log('tressa', tressa);

$('p').after(function (i, oldTxt) {
  const node = document.createElement('div');
  node.textContent = oldTxt + '::' + i;
  return node;
}).before(function (i, oldTxt) {
  const node = document.createElement('div');
  node.textContent = 'aaaa:' + oldTxt + '::' + i;
  return node;
}).after('<b>ooo</b>').before('<i>eee</i>', '<u>uuu</u>'
).after(document.createTextNode('----'), document.createElement('hr'));

$('body').append('the', document.createTextNode(' '), '<b>end</b>');

$('body > *:first-child').prepend('<b>BEGIN</b>');

const p = document.createElement('p');
p.className = 'move';
p.textContent = 'of the end';
document.body.append(p);
const p2 = document.createElement('p');
p2.className = 'move';
p2.textContent = 'was at end';
document.body.append(p2);

$('body').before($('p.move')[0], $('p.move')[1]);

const div = document.createElement('div');
div.className = 'aDiv';

const i = document.createElement('i');
i.textContent = 'another end';

$('body').append(div);
$('body').append(div.cloneNode(true));
$('.aDiv').html(i);

const div2 = document.createElement('div');
div2.id = 'anotherDiv';
$('body').append(div2);

$('#anotherDiv').text(i);

const div3 = document.createElement('div');
div3.id = 'anotherDiv3';
$('body').append(div3);
const frag = document.createDocumentFragment();
frag.append('a', document.createElement('hr'), 'b');
$('#anotherDiv3').html(frag);

const div4 = document.createElement('div');
div4.id = 'anotherDiv4';
$('body').append(div4);
const qr = $('hr');
$('#anotherDiv4').html([document.createElement('hr'), ...qr]);
