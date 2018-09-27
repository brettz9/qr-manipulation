function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function convertToString(content, type) {
  switch (_typeof(content)) {
    case 'object':
      {
        if (!content) {
          throw new TypeError('Cannot supply `null`');
        }

        switch (content.nodeType) {
          case 1:
            {
              // ELEMENT
              return content.outerHTML;
            }

          case 3:
            {
              // TEXT
              return content.nodeValue;
            }

          case 11:
            {
              // DOCUMENT_FRAGMENT_NODE
              return _toConsumableArray(content.childNodes).reduce(function (s, node) {
                return s + convertToString(node, type);
              }, '');
            }

          case undefined:
            {
              // Array of nodes, QueryResult objects
              // if (Array.isArray(content)) {
              if (typeof content.reduce === 'function') {
                return content.reduce(function (s, node) {
                  return s + convertToString(node, type);
                }, '');
              }
            }
        }

        return;
      }

    case 'string':
      {
        return content;
      }

    default:
      throw new TypeError('Bad content for ' + type + '; type: ' + _typeof(content));
  }
}

function convertToDOM(content, type, avoidClone) {
  switch (_typeof(content)) {
    case 'object':
      {
        if (!content) {
          throw new TypeError('Cannot supply `null`');
        }

        if ([1, // ELEMENT
        3, // TEXT
        11 // Document fragment
        ].includes(content.nodeType)) {
          return avoidClone ? content : content.cloneNode(true);
        }

        if (typeof content.reduce !== 'function') {
          throw new TypeError('Unrecognized type of object for conversion to DOM');
        } // Array of nodes, QueryResult objects


        return avoidClone ? content.map(function (node, i, arr) {
          // We still clone for all but the last
          return i === arr.length - 1 ? node : node.cloneNode(true);
        }) : content.map(function (node) {
          return node.cloneNode(true);
        });
      }

    case 'string':
      {
        var div = document.createElement('div');
        div.innerHTML = content;
        return div.firstElementChild || div.firstChild;
      }

    default:
      throw new TypeError('Bad content for ' + type + '; type: ' + _typeof(content));
  }
}

function insert(type) {
  return function () {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var cbOrContent = args[0];

    switch (_typeof(cbOrContent)) {
      case 'function':
        {
          this.forEach(function (node, i) {
            var ret = cbOrContent.call(_this, i, node.textContent);
            node[type](ret);
          });
          break;
        }

      default:
        {
          this.forEach(function (node) {
            node[type].apply(node, _toConsumableArray(args.flatMap(function (content, i) {
              return convertToDOM(content, type, i === args.length - 1);
            })));
          });
          break;
        }
    }

    return this;
  };
}

function insertText(type) {
  return function (cbOrContent) {
    var _this2 = this;

    switch (_typeof(cbOrContent)) {
      case 'function':
        {
          this.forEach(function (node, i) {
            var ret = cbOrContent.call(_this2, i, node[type]);
            node[type] = convertToString(ret, type);
          });
          break;
        }

      default:
        {
          this.forEach(function (node) {
            node[type] = convertToString(cbOrContent, type);
          });
          break;
        }
    }

    return this;
  };
}

var after = insert('after');
var before = insert('before');
var append = insert('append');
var prepend = insert('prepend');
var html = insertText('innerHTML');
var text = insertText('textContent');

function insertTo(type) {
  return function (target) {
    var toType = type + 'To';
    this.forEach(function (node) {
      // We could allow selectors, but then we'd need QueryResult as
      //   a mutual dependency and we wouldn't know which context (or
      // would need to assume global context and/or just use
      // `document.querySelectorAll` but then we'd miss the optimization
      // of its `:first-child` and behave differently in different contexts)
      // if (typeof target === 'string' && target.charAt(0) !== '<') {
      target = Array.isArray(target) ? target : [target];
      node[type].apply(node, _toConsumableArray(target.flatMap(function (content, i, arr) {
        return convertToDOM(content, toType, i === arr.length - 1);
      })));
    });
    return this;
  };
}

var appendTo = insertTo('append');
var prependTo = insertTo('prepend');
var clone = function clone() {
  return this.map(function (node) {
    // Still a QueryResult with such a map
    return node.cloneNode(true);
  });
};

function classAttManipulation(type) {
  return function (cbOrContent) {
    var _this3 = this;

    switch (_typeof(cbOrContent)) {
      case 'function':
        {
          this.forEach(function (node, i) {
            var _node$classList;

            var ret = cbOrContent.call(_this3, i, node.className);

            (_node$classList = node.classList)[type].apply(_node$classList, _toConsumableArray(ret.split(' ')));
          });
          break;
        }

      default:
        {
          if (type === 'remove' && !cbOrContent) {
            this.forEach(function (node) {
              node.className = '';
            });
            break;
          }

          this.forEach(function (node) {
            var _node$classList2;

            (_node$classList2 = node.classList)[type].apply(_node$classList2, _toConsumableArray(cbOrContent.split(' ')));
          });
          break;
        }
    }

    return this;
  };
}

var addClass = classAttManipulation('add');
var removeClass = classAttManipulation('remove');
var hasClass = function hasClass(className) {
  return this.some(function (node) {
    return node.classList.contains(className);
  });
};
var toggleClass = function toggleClass(classNameOrCb, state) {
  var _this4 = this;

  switch (typeof cbOrContent === "undefined" ? "undefined" : _typeof(cbOrContent)) {
    case 'function':
      {
        if (typeof state === 'boolean') {
          this.forEach(function (node, i) {
            var _node$classList3;

            var ret = classNameOrCb.call(_this4, i, node.className, state);

            (_node$classList3 = node.classList).toggle.apply(_node$classList3, _toConsumableArray(ret.split(' ')).concat([state]));
          });
        } else {
          this.forEach(function (node, i) {
            var _node$classList4;

            var ret = classNameOrCb.call(_this4, i, node.className, state);

            (_node$classList4 = node.classList).toggle.apply(_node$classList4, _toConsumableArray(ret.split(' ')));
          });
        }

        break;
      }

    case 'string':
      {
        if (typeof state === 'boolean') {
          this.forEach(function (node) {
            var _node$classList5;

            (_node$classList5 = node.classList).toggle.apply(_node$classList5, _toConsumableArray(classNameOrCb.split(' ')).concat([state]));
          });
        } else {
          this.forEach(function (node) {
            var _node$classList6;

            (_node$classList6 = node.classList).toggle.apply(_node$classList6, _toConsumableArray(classNameOrCb.split(' ')));
          });
        }

        break;
      }
  }
};
var attr = function attr(attributeNameOrAtts, valueOrCb) {
  var _this5 = this;

  if (valueOrCb === undefined) {
    switch (_typeof(attributeNameOrAtts)) {
      case 'string':
        {
          return this[0].hasAttribute(attributeNameOrAtts) ? this[0].getAttribute(attributeNameOrAtts) : undefined;
        }

      case 'object':
        {
          if (attributeNameOrAtts) {
            this.forEach(function (node, i) {
              Object.entries(attributeNameOrAtts).forEach(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    att = _ref2[0],
                    val = _ref2[1];

                node.setAttribute(att, val);
              });
            });
            return this;
          }
        }
      // Fallthrough

      default:
        {
          throw new TypeError('Unexpected type for attribute name: ' + _typeof(attributeNameOrAtts));
        }
    }
  }

  switch (_typeof(valueOrCb)) {
    case 'function':
      {
        this.forEach(function (node, i) {
          var ret = valueOrCb.call(_this5, i, node.getAttribute(valueOrCb));

          if (ret === null) {
            node.removeAttribute(attributeNameOrAtts);
          } else {
            node.setAttribute(attributeNameOrAtts, ret);
          }
        });
        break;
      }

    case 'string':
      {
        this.forEach(function (node, i) {
          node.setAttribute(attributeNameOrAtts, valueOrCb);
        });
        break;
      }

    case 'object':
      {
        if (!valueOrCb) {
          this.forEach(function (node, i) {
            node.removeAttribute(attributeNameOrAtts);
          });
          break;
        }
      }
    // Fallthrough

    default:
      {
        throw new TypeError('Unexpected type for attribute name: ' + _typeof(attributeNameOrAtts));
      }
  }

  return this;
};
var methods = {
  after: after,
  before: before,
  append: append,
  prepend: prepend,
  appendTo: appendTo,
  prependTo: prependTo,
  clone: clone,
  html: html,
  text: text,
  addClass: addClass,
  hasClass: hasClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  attr: attr
};

var manipulation = function manipulation($, jml) {
  ['after', 'before', 'append', 'prepend', 'appendTo', 'prependTo', 'clone', 'html', 'text', 'addClass', 'hasClass', 'removeClass', 'toggleClass', 'attr'].forEach(function (method) {
    $.extend(method, methods[method]);
  });

  if (jml) {
    $.extend('jml', function () {
      var _this6 = this;

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      this.forEach(function (node) {
        while (node.hasChildNodes()) {
          node.firstChild.remove();
        }

        var n = jml.apply(void 0, args);
        return append.call(_this6, n);
      });
    });
  }

  return $;
};

export { after, before, append, prepend, html, text, appendTo, prependTo, clone, addClass, removeClass, hasClass, toggleClass, attr, manipulation };
