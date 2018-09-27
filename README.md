# qr-manipulation

[![Dependencies](https://img.shields.io/david/brettz9/qr-manipulation.svg)](https://david-dm.org/brettz9/qr-manipulation)
[![devDependencies](https://img.shields.io/david/dev/brettz9/qr-manipulation.svg)](https://david-dm.org/brettz9/qr-manipulation?type=dev)
[![npm](http://img.shields.io/npm/v/qr-manipulation.svg)](https://www.npmjs.com/package/qr-manipulation)
[![License](https://img.shields.io/npm/l/qr-manipulation.svg)](LICENSE-MIT)
[![Code Quality: Javascript](https://img.shields.io/lgtm/grade/javascript/g/brettz9/qr-manipulation.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/brettz9/qr-manipulation/context:javascript)
[![Total Alerts](https://img.shields.io/lgtm/alerts/g/brettz9/qr-manipulation.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/brettz9/qr-manipulation/alerts)

Extension for Query Result to add jQuery-type manipulation functionality.

In very early stages...

## Methods

- `append(content [, content])`
- `append(function-html)`
- `prepend(content [, content])`
- `prepend(function-html)`

- `appendTo(target)` - Does not support selectors (would require context
    (or assumption thereof) and/or QR mutual dependency); just wrap
    `target` in QR
- `prependTo(target)` - Does not support selectors (would require context
    (or assumption thereof) and/or QR mutual dependency); just wrap
    `target` in QR

- `after(content [, content])`
- `after(function-html)`
- `before(content [, content])`
- `before(function-html)`

- `html(content)`
- `html(function-html)`
- `text(content)`
- `text(function-html)`

- `hasClass(className)`
- `addClass(className)`
- `addClass(function)`
- `removeClass([className])`
- `removeClass(function)`
- `toggleClass(className)`
- `toggleClass(className, state)`
- `toggleClass(function [, state])`

- `attr(attributeName)`
- `attr(attributes)`
- `attr(attributeName, value)`
- `attr(attributeName, function)`


There is also an `jml` method if a `jml` instance is supplied as the
second argument to `manipulation`. This will expect an array to be used as
part of building a Jamilih document fragment. After converting from Jamilih,
it will empty and then `append` the contents.
