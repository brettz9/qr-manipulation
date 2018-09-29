# qr-manipulation

[![Dependencies](https://img.shields.io/david/brettz9/qr-manipulation.svg)](https://david-dm.org/brettz9/qr-manipulation)
[![devDependencies](https://img.shields.io/david/dev/brettz9/qr-manipulation.svg)](https://david-dm.org/brettz9/qr-manipulation?type=dev)
[![npm](http://img.shields.io/npm/v/qr-manipulation.svg)](https://www.npmjs.com/package/qr-manipulation)
[![License](https://img.shields.io/npm/l/qr-manipulation.svg)](LICENSE-MIT)
[![Code Quality: Javascript](https://img.shields.io/lgtm/grade/javascript/g/brettz9/qr-manipulation.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/brettz9/qr-manipulation/context:javascript)
[![Total Alerts](https://img.shields.io/lgtm/alerts/g/brettz9/qr-manipulation.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/brettz9/qr-manipulation/alerts)

Extension for Query Result to add jQuery-type manipulation functionality.

In very early stages...

## `manipulation` export signature

- `manipulation($ [, jml])` - `$` is the [query-result](https://github.com/WebReflection/query-result)
  instance, while the second (optional) argument is a [Jamilih](https://github.com/brettz9/jamilih/)
  instance that will be used for adding a `jml` method.

## Methods

These methods may be obtained individually (though see the notes for
`appendTo`, `prependTo`, `insertBefore`, and `insertAfter` which
require `insertTo` in such a situation), or one may use `manipulation`
which makes available all methods automatically.

- `append(content [, content])`
- `append(function-html)`
- `prepend(content [, content])`
- `prepend(function-html)`

- `after(content [, content])`
- `after(function-html)`
- `before(content [, content])`
- `before(function-html)`

- `html(content)`
- `html(function-html)`
- `text(content)`
- `text(function-html)`

- `clone()` - Does not support optional `withDataAndEvents` and
  `deepWithDataAndEvents` arguments

- `attr(attributeName)`
- `attr(attributes)`
- `attr(attributeName, value)`
- `attr(attributeName, function)`

- `hasClass(className)`
- `addClass(className)`
- `addClass(function)`
- `removeClass([className])`
- `removeClass(function)`
- `toggleClass(className)`
- `toggleClass(className, state)`
- `toggleClass(function [, state])`

For the following methods, because they allow selectors, and so we can
avoid a mutual dependency with query-result (or use
`document.querySelectorAll` which doesn't have all of the latter's features),
are not available directly as exports.

You should, if you are not using `manipulation` (which adds all methods
automatically) instead import `insertTo` and invoke it as
`insertTo(method, queryResultInstance)`, e.g., `insertTo('appendTo', $);`
in order to get that particular method for manual use of `$.extend`:

- `appendTo(target)`
- `prependTo(target)`

- `insertAfter(target)`
- `insertBefore(target)`

There is also an `jml` method if a `jml` instance is supplied as the
second argument to `manipulation`. This will expect an array to be used as
part of building a Jamilih document fragment. After converting from Jamilih,
it will empty and then `append` the contents.
