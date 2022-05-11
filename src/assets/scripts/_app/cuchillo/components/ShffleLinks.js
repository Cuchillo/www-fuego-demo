import { GetBy, C } from '../core/Element';
import { Basics, isTouch } from '../core/Basics';
import { Shffl } from './Shffl';


export default class ShffleLinks {
  static _items = [];

  static init() {
    ShffleLinks.dispose();

    const items = GetBy.selector(".link-holder");
    C.forEach(items, (el) => {
      this._items.push(new ShffleLinks__Link(el));
    });
  }

  static dispose() {
    this._items.map(item => {
      item.dispose();
    });
    this._items = [];
  }
}

class ShffleLinks__Link {
  _dom;
  _shuffle;
  _timerOut = null;

  _calls = {
    hover: () => this.hover(),
    out: () => this.out(),
  }

  constructor(__dom) {
    this._dom = __dom;
    this._shuffle = new Shffl(GetBy.selector("a",this._dom)[0],
      {
        duration: .8,
      });

    this._dom.addEventListener(Basics.mouseOver, this._calls.hover, {passive: true});
    this._dom.addEventListener(Basics.mouseOut, this._calls.out, {passive: true});
  }

  hover() {
    clearTimeout(this._timerOut)
    this._shuffle.play();
  }

  out() {
    this._timerOut = setTimeout(()=> {
      clearTimeout(this._timerOut)
      this._shuffle.reverse();
    }, 200);
  }

  dispose() {
    clearTimeout(this._timerOut);
    this._shuffle.dispose();
    this._dom.removeEventListener(Basics.mouseOver, this._calls.hover);
    this._dom.removeEventListener(Basics.mouseOut, this._calls.out);

    this._shuffle = null;
    this._dom = null;
  }
}