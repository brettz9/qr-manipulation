import {describe, it, assert, beforeEach, mocha} from './lite-mocha.js';

const $context = document.querySelector('#results');
mocha.setup({ui: 'tdd', $context});

describe('Group 1', function () {
  beforeEach(() => {
    assert(true, 'Group 1 beforeEach');
  });
  describe('Group 1-A', function () {
    beforeEach(() => {
      // eslint-disable-next-line promise/avoid-new
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          assert(true, 'Group 1-A beforeEach');
          resolve();
        }, 600);
      });
    });
    it('Group 1-A Test 1', function (done) {
      assert(true, 'ok group 1-A test 1');
      setTimeout(() => {
        assert(false, 'bad group 1-A test 1');
        done();
      }, 500);
    });
    it('Group 1-A Test 2', function () {
      assert(true, 'ok group 1-A test 2');
      assert(false, 'bad group 1-A test 2');
    });
  });
  describe('Group 1-B', function () {
    it('Group 1-B Test 1', function () {
      assert(true, 'ok group 1-B test 1');
      assert(false, 'bad group 1-B test 1');
    });
  });
});
describe('Group 2', function () {
  beforeEach((done) => {
    setTimeout(() => {
      assert(true, 'Group 2 beforeEach');
      done();
    }, 1000);
  });
  it('Group 2 Test 1', function () {
    // eslint-disable-next-line promise/avoid-new
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        assert(true, 'ok group 2 test 1');
        assert(false, 'bad group 2 test 1');
        resolve();
      }, 1);
    });
  });
  it('Group 2 Test 2', function () {
    assert(true, 'ok group 2 test 2');
    assert(false, 'bad group 2 test 2');
  });
});
