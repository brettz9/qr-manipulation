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
    // if (Array.isArray(content)) {
      throw new TypeError('Unrecognized type of object for conversion to DOM');
    }

    // Array of nodes, QueryResult objects
    return content.reduce((frag, node) => {
      // We could use `append` to allow text strings, but would confuse
      //   things with strings otherwise treated as HTML (see below)
      frag.appendChild(node);
      return frag;
    }, document.createDocumentFragment());
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
      this.forEach((node) => {
        node[type](...args.map((content, i) => {
          return convertToDOM(content, type, i === args.length - 1);
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
        // Todo
        return;
      }
    } // Fallthrough
    default: {
      throw new TypeError('Unexpected type for attribute name: ' + typeof attributeNameOrAtts);
    }
    }
  }
  // Todo
  switch (typeof valueOrCb) {
  case 'function': {
    break;
  }
  case 'string': {
    break;
  }
  }
};

const methods = {
  after, before, append, prepend,
  html, text,
  addClass, hasClass, removeClass, toggleClass,
  attr
};

export const manipulation = function ($, jml) {
  [
    'after', 'before', 'append', 'prepend',
    'html', 'text',
    'addClass', 'hasClass', 'removeClass', 'toggleClass',
    'attr'
  ].forEach((method) => {
    $.extend(method, methods[method]);
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
