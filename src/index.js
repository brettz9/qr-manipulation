function convertToString (content, type) {
  switch (typeof content) {
  case 'object': {
    if (!content) {
      throw new TypeError('Cannot supply `null`');
    }
    switch (content.nodeType) {
    case 1: { // ELEMENT
      return content.outerHTML;
    }
    case 3: { // TEXT
      return content.nodeValue;
    }
    case 11: { // DOCUMENT_FRAGMENT_NODE
      return [...content.childNodes].reduce((s, node) => {
        return s + convertToString(node, type);
      }, '');
    }
    case undefined: {
      // Array of nodes, QueryResult objects
      // if (Array.isArray(content)) {
      if (typeof content.reduce === 'function') {
        return content.reduce((s, node) => {
          return s + convertToString(node, type);
        }, '');
      }
    }
    }
    return;
  }
  case 'string': {
    return content;
  }
  default:
    throw new TypeError('Bad content for ' + type + '; type: ' + typeof content);
  }
}
function convertToDOM (content, type, avoidClone) {
  switch (typeof content) {
  case 'object': {
    if (!content) {
      throw new TypeError('Cannot supply `null`');
    }
    if ([
      1, // ELEMENT
      3, // TEXT
      11 // Document fragment
    ].includes(content.nodeType)) {
      return avoidClone ? content : content.cloneNode(true);
    }

    if (typeof content.reduce !== 'function') {
      throw new TypeError('Unrecognized type of object for conversion to DOM');
    }

    // Array of nodes, QueryResult objects
    return avoidClone
      ? content
      : content.map((node) => {
        if (!node || !node.cloneNode) { // Allows for arrays of HTML strings
          return convertToDOM(node, type, false);
        }
        return node.cloneNode(true);
      });
  }
  case 'string': {
    const div = document.createElement('div');
    div.innerHTML = content;
    return div.firstElementChild || div.firstChild;
  }
  default:
    throw new TypeError('Bad content for ' + type + '; type: ' + typeof content);
  }
}

function insert (type) {
  return function (...args) {
    const [cbOrContent] = args;
    switch (typeof cbOrContent) {
    case 'function': {
      this.forEach((node, i) => {
        const ret = cbOrContent.call(this, i, node.textContent);
        node[type](ret);
      });
      break;
    }
    default: {
      this.forEach((node, i, arr) => {
        node[type](...args.flatMap((content) => {
          return convertToDOM(content, type, i === arr.length - 1);
        }));
      });
      break;
    }
    }
    return this;
  };
}

function insertText (type) {
  return function (cbOrContent) {
    switch (typeof cbOrContent) {
    case 'function': {
      this.forEach((node, i) => {
        const ret = cbOrContent.call(this, i, node[type]);
        node[type] = convertToString(ret, type);
      });
      break;
    }
    default: {
      this.forEach((node) => {
        node[type] = convertToString(cbOrContent, type);
      });
      break;
    }
    }
    return this;
  };
}

export const after = insert('after');
export const before = insert('before');
export const append = insert('append');
export const prepend = insert('prepend');
export const html = insertText('innerHTML');
export const text = insertText('textContent');

/*
// Todo:
export const val = function (valueOrFunc) {

};
*/

// Given that these types require a selector engine and
// in order to avoid the absence of optimization of `document.querySelectorAll`
// for `:first-child` and different behavior in different contexts,
// and to avoid making a mutual dependency with query-result,
// exports of this type accept a QueryResult instance;
// if selected without a second argument, we do default to
//  `document.querySelectorAll`, however.
export const insertTo = function (method, $ = (sel) => [...document.querySelectorAll(sel)]) {
  const type = {
    appendTo: 'append',
    prependTo: 'prepend',
    insertAfter: 'after',
    insertBefore: 'before'
  }[method] || 'append';
  return function (target) {
    const toType = type + 'To';
    if (typeof target === 'string' && target.charAt(0) !== '<') {
      target = $(target);
    }
    target = Array.isArray(target) ? target : [target];
    target.forEach((t, i, arr) => {
      t = convertToDOM(t, toType, i === arr.length - 1);
      t[type](...this);
    });
    return this;
  };
};

// Todo: optional `withDataAndEvents` and `deepWithDataAndEvents` arguments?
export const clone = function () {
  return this.map((node) => { // Still a QueryResult with such a map
    return node.cloneNode(true);
  });
};

export const empty = function () {
  this.forEach((node) => {
    node.textContent = '';
  });
};
export const remove = function (selector) {
  if (selector) {
    this.forEach((node) => {
      if (node.matches(selector)) { // Todo: Use query-result instead?
        node.remove();
      }
    });
  } else {
    this.forEach((node) => {
      node.remove();
    });
  }
  return this;
};
/*
// Todo:
export const detach = function (selector) {
  // Should preserve attached data
  return remove(selector);
};
*/

export const attr = function (attributeNameOrAtts, valueOrCb) {
  if (valueOrCb === undefined) {
    switch (typeof attributeNameOrAtts) {
    case 'string': {
      return this[0].hasAttribute(attributeNameOrAtts)
        ? this[0].getAttribute(attributeNameOrAtts)
        : undefined;
    }
    case 'object': {
      if (attributeNameOrAtts) {
        this.forEach((node, i) => {
          Object.entries(attributeNameOrAtts).forEach(([att, val]) => {
            node.setAttribute(att, val);
          });
        });
        return this;
      }
    } // Fallthrough
    default: {
      throw new TypeError('Unexpected type for attribute name: ' + typeof attributeNameOrAtts);
    }
    }
  }
  switch (typeof valueOrCb) {
  case 'function': {
    this.forEach((node, i) => {
      const ret = valueOrCb.call(this, i, node.getAttribute(valueOrCb));
      if (ret === null) {
        node.removeAttribute(attributeNameOrAtts);
      } else {
        node.setAttribute(attributeNameOrAtts, ret);
      }
    });
    break;
  }
  case 'string': {
    this.forEach((node, i) => {
      node.setAttribute(attributeNameOrAtts, valueOrCb);
    });
    break;
  }
  case 'object': {
    if (!valueOrCb) { // `null`
      return removeAttr.call(this, attributeNameOrAtts);
    }
  } // Fallthrough
  default: {
    throw new TypeError('Unexpected type for attribute name: ' + typeof attributeNameOrAtts);
  }
  }
  return this;
};

export const removeAttr = function (attributeName) {
  if (typeof attributeName !== 'string') {
    throw new TypeError('Unexpected type for attribute name: ' + typeof attributeName);
  }
  this.forEach((node) => {
    node.removeAttribute(attributeName);
  });
};

function classAttManipulation (type) {
  return function (cbOrContent) {
    switch (typeof cbOrContent) {
    case 'function': {
      this.forEach((node, i) => {
        const ret = cbOrContent.call(this, i, node.className);
        node.classList[type](...ret.split(' '));
      });
      break;
    }
    default: {
      if (type === 'remove' && !cbOrContent) {
        this.forEach((node) => {
          node.className = '';
        });
        break;
      }
      this.forEach((node) => {
        node.classList[type](...cbOrContent.split(' '));
      });
      break;
    }
    }
    return this;
  };
}

export const addClass = classAttManipulation('add');
export const removeClass = classAttManipulation('remove');
export const hasClass = function (className) {
  return this.some((node) => {
    return node.classList.contains(className);
  });
};
export const toggleClass = function (classNameOrCb, state) {
  switch (typeof cbOrContent) {
  case 'function': {
    if (typeof state === 'boolean') {
      this.forEach((node, i) => {
        const ret = classNameOrCb.call(this, i, node.className, state);
        node.classList.toggle(...ret.split(' '), state);
      });
    } else {
      this.forEach((node, i) => {
        const ret = classNameOrCb.call(this, i, node.className, state);
        node.classList.toggle(...ret.split(' '));
      });
    }
    break;
  }
  case 'string': {
    if (typeof state === 'boolean') {
      this.forEach((node) => {
        node.classList.toggle(...classNameOrCb.split(' '), state);
      });
    } else {
      this.forEach((node) => {
        node.classList.toggle(...classNameOrCb.split(' '));
      });
    }
    break;
  }
  }
};

const methods = {
  after, before, append, prepend,
  html, text,
  clone,
  empty, remove, // detach
  attr, removeAttr,
  addClass, hasClass, removeClass, toggleClass
};

export const manipulation = function ($, jml) {
  [
    'after', 'before', 'append', 'prepend',
    'html', 'text',
    'clone',
    'empty', 'remove', // 'detach'
    'attr', 'removeAttr',
    'addClass', 'hasClass', 'removeClass', 'toggleClass'
  ].forEach((method) => {
    $.extend(method, methods[method]);
  });
  ['appendTo', 'prependTo', 'insertAfter', 'insertBefore'].forEach((method) => {
    $.extend(method, insertTo(method, $));
  });
  if (jml) {
    $.extend('jml', function (...args) {
      this.forEach((node) => {
        while (node.hasChildNodes()) {
          node.firstChild.remove();
        }
        const n = jml(...args);
        return append.call(this, n);
      });
    });
  }
  return $;
};
