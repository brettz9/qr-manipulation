# qr-manipulation

## ?

- Build: Update as per latest devDeps
- Build: Use "json" extension for RC
- Linting (ESLint): As per latest ash-nazg / ESLint 7
- Maintenance: Add `.editorconfig`
- npm: Add rollup config to ignore
- npm: Add missing peer dep. (no-unsanitized)
- npm: Add eslint and rollup to test script
- npm: Update `rollup-plugin-babel` to `@rollup/plugin-babel`
    and make explicit `babelHelpers` value of `bundled`
- npm: Update devDeps

## 0.7.0

- Breaking change: Remove `htmlJML` in favor of `jml`

## 0.6.1

- Fix: Pass `this` properly for `htmlJML`

## 0.6.0

- Enhancement: Allow optional support of Jamilih method `htmlJML`
- Enhancement: Support fragment with `append`

## 0.5.0

- Enhancement: Support conversion of document fragments

## 0.4.0

- Breaking change: Export former default as `manipulation` and export methods
  individually, so user could choose a subset of methods to apply themselves.

## 0.3.0

- Enhancement: Support `text` and `html`
- Enhancement: More detail in error reporting

## 0.2.2

- Fix: Allow strings to be text nodes

## 0.2.1

- Fix: Adhere to jQuery behavior in not cloning last item

## 0.2.0

- Fix: Allow mixed string/DOM content
- Enhancement: Add `append` and `prepend` methods

## 0.1.0

- Initial commit (`after` and `before` with some desired argument types)
