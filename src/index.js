function afterOrBefore (type) {
  return function (cbOrContent, ...args) {
    switch (typeof cbOrContent) {
    case 'object': {
      if (!cbOrContent) {
        throw new Error('Cannot suppy `null`');
      }
      if (cbOrContent.nodeType === 1 || // ELEMENT
        cbOrContent.nodeType === 3 // TEXT
      ) {
        this.forEach((node) => {
          node[type](cbOrContent.cloneNode(true), ...(args.map((arg) => arg.cloneNode(true))));
        });
      } else {
        // Todo: array of elements/text nodes (or Jamilih array?), QueryResult objects?
      }
      break;
    }
    case 'function': {
      this.forEach((node, i) => {
        const ret = cbOrContent.call(this, i, node.textContent);
        node[type](ret);
      });
      break;
    }
    case 'string': {
      this.forEach((node) => {
        [cbOrContent, ...args].forEach((str) => {
          const div = document.createElement('div');
          div.innerHTML = str;
          node[type](div.firstElementChild);
        });
      });
      break;
    }
    }
    return this;
  };
}

export default function ($) {
  $.extend('after', afterOrBefore('after'));
  $.extend('before', afterOrBefore('before'));
  return $;
}
