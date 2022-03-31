/*
──────────────────────────────────────────
──────────────────────────────────────────
GET ELEMENT BY
──────────────────────────────────────────
──────────────────────────────────────────
const content = Core.Element.id('content') UNIQUE
const btn = Core.Element.class('btn') ARRAY
const span = Core.Element.tag('span') ARRAY
CHILD OF ELEMENT
────────────────
const elements = Core.Element.class('elementClassName', parentEl)
*/

const GetBy = {
  p: function (p) {
    return p ? p : document
  },

  id: function (el, p) {
    return this.p(p).getElementById(el)
  },

  class: function (el, p) {
    return this.p(p).getElementsByClassName(el)
  },

  tag: function (el, p) {
    return this.p(p).getElementsByTagName(el)
  },

  selector: function (el, p) {
    return this.p(p).querySelectorAll(el)
  },
};

const C = {
  forEach: function(items, call) {
    if(!HTMLCollection.prototype.isPrototypeOf(items) && !NodeList.prototype.isPrototypeOf(items) && !Array.isArray(items)) {
      items = document.querySelectorAll(items);
    }

    items = [].slice.call(items);
    items.forEach(call);
  },

  remove: function(element) {
    element.parentNode.removeChild(element);
  },

  empty: function(element) {
    while(element.firstChild)
      element.removeChild(element.firstChild);
  },
}

export { C, GetBy }
