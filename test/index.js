import $ from '../node_modules/query-result/esm/index.js';
import manipulation from '../dist/index-es.js';
// import manipulation from '../src/index.js';

// Todo: Move to traversal
$.extend('each', function each (cb, thisObj) {
  this.forEach(cb, thisObj);
  return this;
});

manipulation($);

$('p').map((p) => {
  console.log('p', p);
  return p;
}).each(function (p) {
  console.log('ppp', p);
}).after(function (i, oldTxt) {
  console.log('qqqq', this);
  const node = document.createElement('div');
  node.textContent = oldTxt + '::' + i;
  return node;
}).before(function (i, oldTxt) {
  console.log('rrr', this);
  const node = document.createElement('div');
  node.textContent = 'aaaa:' + oldTxt + '::' + i;
  return node;
}).after('<b>ooo</b>').before('<i>eee</i>', '<u>uuu</u>').after(document.createTextNode('----'), document.createElement('hr'));
