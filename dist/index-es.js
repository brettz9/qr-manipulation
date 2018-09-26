function convertToString (type, content) {
  switch (typeof content) {
  case 'object': {
    if (!content) {
      throw new TypeError('Cannot supply `null`');
    }
    if (content.nodeType === 1) { // ELEMENT
      return content.outerHTML;
    }
    if (content.nodeType === 3) { // TEXT
      return content.nodeValue;
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
    if (content.nodeType === 1 || // ELEMENT
      content.nodeType === 3 // TEXT
    ) {
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

const after = insert('after');
const before = insert('before');
const append = insert('append');
const prepend = insert('prepend');
const html = insertText('innerHTML');
const text = insertText('textContent');

const methods = {after, before, append, prepend, html, text};

const manipulation = function ($) {
  ['after', 'before', 'append', 'prepend', 'html', 'text'].forEach((method) => {
    $.extend(method, methods[method]);
  });
  return $;
};

export { after, before, append, prepend, html, text, manipulation };
