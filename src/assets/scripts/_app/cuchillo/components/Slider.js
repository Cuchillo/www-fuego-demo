import { Keyboard } from '../core/Keyboard';
import { GetBy } from '../core/Element';

export class Slider_Item {
  item;
  index;
  slider;
  links;
  width;
  height;

  constructor(__item, __index, __slider) {
    this.item = __item;
    this.index = __index;
    this.slider = __slider;
    this.links = GetBy.tag("a", __item);
    this.height = __item.offsetHeight;
    this.width = __item.offsetWidth;
    this.afterHide();
  }
  show(__d = 1) {
    if(!this.item.classList.contains("__active")) {
      this.item.classList.add("__active");
    }
    this.item.setAttribute("aria-hidden", "false");
    for(let i=0, j= this.links.length; i<j; i++) {
      this.links[i].removeAttribute("tabindex");
    }
  }
  hide(__d = 1) {
    this.afterHide();
  }

  afterHide() {
    this.item.classList.remove("__active");
    this.item.setAttribute("aria-hidden", "true");

    for(let i=0, j= this.links.length; i<j; i++) {
      this.links[i].setAttribute("tabindex", "-1");
    }
  }
}

export class Slider_Button {
  item;
  index;

  constructor(__item, __index, __call) {
    this.item = __item;
    this.index = __index;

    this.item.addEventListener(Basics.clickEvent, (e) => {
      e.preventDefault();
      __call(this.index, null, true);
    });
  }

  show() {
    if(!this.item.classList.contains("__active")) {
      this.item.classList.add("__active");
    }
  }

  hide() {
    this.item.classList.remove("__active");
  }
}

export class Slider  {
  id;
  isInfinity = true;
  isShow = true;
  _sSlides = "__slides";
  _sControls = "__controls";
  _container = null;
  _containerSlides = null;
  _controls = null;
  _total = 0;
  _actual = null;
  _enabled = false;
  _items = [];
  _btns = [];

  get actual() { return this._actual; }
  get total() { return this._total; }

  get enabled() { return this._enabled; }
  set enabled(__bol) {
    if(this._enabled !== __bol) {
      this._enabled = __bol;
      this._keyEnabled = __bol;

      if(this._enabled) {
        Keyboard.add("ArrowLeft", this.id, () => { this.prev(); });
        Keyboard.add("ArrowRight", this.id, () => { this.next(); });
      } else {
        Keyboard.remove("ArrowLeft", this.id);
        Keyboard.remove("ArrowRight", this.id);
      }
    }
  }

  constructor(__container, __classSlide = Slider_Item, __classButton = Slider_Button) {
    this.id = String(new Date().getTime());
    this._container = __container;
    this._containerSlides = GetBy.class(this._sSlides, this._container)[0];
    this._controls = GetBy.class(this._sControls, this._container)[0];

    //SLIDES
    let temp = GetBy.tag("li", this._containerSlides);
    for(let i = 0, j=temp.length; i<j; i++) {
      let item = new __classSlide(temp[i], i, this);
      this._total = this._items.push(item);
    }

    if(this._total <= 1 && this._controls) {
      this._controls.classList.add("__noSlides");

      //BUTTON
      temp = GetBy.tag("button", this._controls);
      let index = 0;
      for (let i = 0, j = temp.length; i < j; i++) {

        if (temp[i].classList.contains("__next")) {
          temp[i].addEventListener(Basics.clickEvent, (e) => {
            e.preventDefault();
            let n = this._actual ? this._actual : 0;
            n = this._actual + 1 === this._total ? 0 : this._actual + 1;

            this.goto(n, 1, true);
          });

        } else if (temp[i].classList.contains("__prev")) {
          temp[i].addEventListener(Basics.clickEvent, (e) => {
            e.preventDefault();

            let n = this._actual ? this._actual : 0;
            n = this._actual === 0 ? this._total - 1 : this._actual - 1;

            this.goto(n, -1, true);
          });

        } else if (temp[i].classList.contains("__close")) {

          temp[i].addEventListener(Basics.clickEvent, (e) => {
            e.preventDefault();
            this.close();
          });

        } else {
          let item = new __classButton(temp[i], index, this.goto.bind(this));
          this._btns.push(item);

          index++;
        }
      }
    }

    //INIT
    /*this._items[0].show();
    if(this._btns.length > 0) this._btns[0].show();
    this._actual = 0;*/
  }

  goto(__index, __direction = null, isUserAction = false) {
    if(__index === this._actual) return;

    if(__direction === null) {
      __direction = __index > this._actual ? 1 : -1;
    }

    if(isUserAction) {
      this._container.setAttribute("aria-live", "polite");
    }
    this.beforeGoto(__direction);

    if(this._actual!= null) {
      this._items[this._actual].hide(__direction);
      if(this._btns.length > 0) this._btns[this._actual].hide(__direction);
    }

    this._actual = __index;
    this._items[this._actual].show(__direction);
    if(this._btns.length > 0) this._btns[this._actual].show(__direction);

    this.afterGoto(__direction);
  }

  afterGoto(__direction) {}
  beforeGoto(__direction) {}

  next() {
    const index =  this._actual + 1;

    if(index === this._total) {
        if(this.isInfinity) {
          this.goto(0, 1);
        }
    } else {
      this.goto(index, 1);
    }
  }

  prev() {
    const index =  this._actual - 1;

    if(index < 0) {
      if(this.isInfinity) {
        this.goto(this._total - 1, 1);
      }
    } else {
      this.goto(index, 1);
    }
  }
  close() {}
  dispose() {
    this.enabled = false;
  }
}
