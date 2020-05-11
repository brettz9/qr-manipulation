'use strict';

module.exports = {
  extends: ['ash-nazg/sauron-node'],
  parserOptions: {
    sourceType: 'module'
  },
  settings: {
    polyfills: [
      'Object.entries',
      'Promise',
      'Promise.resolve'
    ]
  },
  overrides: [
    {
      files: '.eslintrc.js',
      extends: ['plugin:node/recommended-script'],
      rules: {
        'import/no-commonjs': 0
      }
    }
  ],
  env: {
    node: false,
    browser: true
  },
  rules: {
    // Disabling for now
    'max-len': 0,
    'unicorn/no-fn-reference-in-iterator': 0,
    'jsdoc/require-jsdoc': 0,
    'require-unicode-regexp': 0
  }
};
