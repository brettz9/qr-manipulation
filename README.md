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

- `append(content [, content])` - Not yet supporting arrays or QueryResult objects
- `append(function-html)`
- `prepend(content [, content])` - Not yet supporting arrays or QueryResult objects
- `prepend(function-html)`

- `after(content [, content])` - Not yet supporting arrays or QueryResult objects
- `after(function-html)`
- `before(content [, content])` - Not yet supporting arrays or QueryResult objects
- `before(function-html)`

- `html(content)` - Not yet supporting arrays or QueryResult objects
- `html(function-html)`
- `text(content)` - Not yet supporting arrays or QueryResult objects
- `text(function-html)`

There is also an `htmlJML` method if `jml` instance is supplied as the
second argument to `manipulation`. This will expect an array to be used as
part of building a Jamilih document fragment. After converting from Jamilih,
it will use the `html()` method.
