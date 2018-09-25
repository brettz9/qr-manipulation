function convertToDOM (type, content) {
  switch (typeof content) {
  case 'object': {
    if (!content) {
      throw new TypeError('Cannot supply `null`');
    }
    if (content.nodeType === 1 || // ELEMENT
      content.nodeType === 3 // TEXT
    ) {
      return content.cloneNode(true);
    }
    // Todo: array of elements/text nodes (or Jamilih array?), QueryResult objects?
    return;
  }
  case 'string': {
    const div = document.createElement('div');
    div.innerHTML = content;
    return div.firstElementChild;
  }
  default:
    throw new TypeError('Bad content for ' + type);
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
        node[type](...args.map((content) => convertToDOM(type, content)));
      });
      break;
    }
    }
    return this;
  };
}

function index ($) {
  ['after', 'before', 'append'].forEach((method) => {
    $.extend(method, insert(method));
  });
  return $;
}

export default index;
