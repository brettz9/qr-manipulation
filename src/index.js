function convertToString (type, content) {
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
        return s + convertToString(type, node);
      }, '');
    }
    }
    // Todo: array of elements/text nodes (or Jamilih array?), QueryResult objects?
    return;
  }
  case 'string': {
    return content;
  }
  default:
    throw new TypeError('Bad content for ' + type + '; type: ' + typeof content);
  }
}
function convertToDOM (type, content, avoidClone) {
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
    // Todo: array of elements/text nodes (or Jamilih array?), QueryResult objects?
    return;
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
          return convertToDOM(type, content, i === args.length - 1);
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
        node[type] = convertToString(type, ret);
      });
      break;
    }
    default: {
      this.forEach((node) => {
        node[type] = convertToString(type, cbOrContent);
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

const methods = {after, before, append, prepend, html, text};

export const manipulation = function ($, jml) {
  ['after', 'before', 'append', 'prepend', 'html', 'text'].forEach((method) => {
    $.extend(method, methods[method]);
  });
  if (jml) {
    $.extend('htmlJML', function (arg) {
      const frag = jml({'#': arg});
      return html(frag);
    });
  }
  return $;
};
