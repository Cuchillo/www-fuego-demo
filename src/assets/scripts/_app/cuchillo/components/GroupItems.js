export class GroupItems__item {
  _container;

  constructor(__item) {
    this._container = __item;
    this.directHide();
  }

  show(__direction = 1, __d = 0, __inc = .02) {
    this._container.style.pointerEvents = "all";
    TweenLite.killTweensOf(this._container);
    TweenLite.to(this._container, .3, {alpha:1, ease: Quad.easeOut, delay:__d});
  }

  directShow() {
    this._container.style.pointerEvents = "all";
    TweenLite.killTweensOf(this._container);
    TweenLite.set(this._container, {alpha:1});
  }

  hide(__direction = 1, __d = 0, __inc = .01) {
    this._container.style.pointerEvents = "none";
    TweenLite.killTweensOf(this._container);
    TweenLite.to(this._container, .3, {alpha:0, ease: Quad.easeIn, delay:__d});
  }

  directHide() {
    this._container.style.pointerEvents = "none";
    TweenLite.killTweensOf(this._container);
    TweenLite.set(this._container,{alpha:0});
  }

  resize() {}
}

class GroupItems {

  _container;
  _items = [];
  _actual = null;

  total;

  constructor(__container, __selector = "__title") {
    this._container = __container;
    const items = C.GetBy.class(__selector, this._container);

    for(let i=0, j=items.length; i<j; i++) {
      this.total = this._items.push(new GroupItems__item(items[i]));
    }
  }

  getItem(__n) {
    return this._items[__n]._container;
  }

  show(__n) {
    if(__n!==this._actual) {

      let delay = 0;
      if(this._actual != null) {
        this._items[this._actual].hide();
        delay = .2;
      }
      this._actual = __n;
      this._items[__n].show(1, delay);
    }
  }

  hide(__n = null) {
    __n = __n || this._actual;
    if(__n !== null) {
      this._items[__n].hide();
      this._actual = null;
    }
  }

  directShow(__n) {
    this._actual = __n;
    this._items[__n].directShow();
  }

  directHide(__n) {
    this._items[__n].directHide();
  }

  dispose() {
    this._container = null;
    this._items = [];
  }
}
