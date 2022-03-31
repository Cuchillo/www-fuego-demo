export default class VScrollInfinity {
  type = null;
  maxV = 4000;
  res = 0.09;
  vel = 0;
  mainVel = 0;
  target = 0;

  scrollPosition = 0;
  scrollSize = 0;

  y = 0;
  y0 = 0;
  y1 = 0;
  nItems = 0;
  progress = 0;
  scrollbar = null;
  gap = 0;
  first;
  last;

  _separacion = 0;
  multiplicator = Basics.isTouch? 2 : 1;

  _items = [];
  _itemsCheck = [];
  _container = null;
  _actual = null;
  _zero = null;
  _element = null;
  _onChange = null;
  _enabled = false;

  //
  // GETTER & SETTER
  //

  get enabled() { return this._enabled; };
  set enabled(__e) {
    if(this._enabled !== __e) {
      this._enabled = __e;

      if(__e) {
        VirtualScroll.on(this._check.bind(this));
      } else {
        VirtualScroll.off(this._check.bind(this));
      }
    }
  };

  get actual() { return this._actual; };
  set actual(__n) {
    if(this._actual !== __n) {
      this._actual = __n;
      if(this._onChange) this._onChange(__n);
    }
  };

  get zero() { return this._zero; };
  set zero(__n) { this._zero = __n; };

  //
  // CONSTRUCTOR
  //

  constructor(__container, __element = null, __onChange = null, __type = 'MANUAL') {
    this._container = __container;
    this._element = __element == null? __container : __element;
    this._onChange = __onChange;
    this.type = __type;
    this._separacion = this.gap;

    this._container.classList.add("__vscroll");
  }

  //
  // PRIVATE
  //

  _check(e) {
    let d = Math.abs(e.deltaY) > Math.abs(e.deltaX)? e.deltaY * this.multiplicator : e.deltaX * this.multiplicator;

    Scroll.isScrolling = true;
    Scroll.direction = d < 0? 1 : -1;

    this.target = Maths.precission(this.target + d, 2);
  }

  //
  // PUBLIC
  //

  start() {
    this.enabled = true;
  }

  add(__item) {
    this.nItems = this._items.push(__item);
    this._itemsCheck.push(__item);

    this.resetPositions();
  }

  addAll(__selector = "[scroll-item]", __z = 0) {
    let _items = this._container.querySelectorAll(__selector);

    for (let i = 0, j = _items.length; i<j; i++) {
      let _item = new VScrollInfinityItem(_items[i], this.nItems, this);
      _item.z = __z;
      this.nItems = this._items.push(_item);
      this._itemsCheck.push(_item);
    }

    this.resetPositions();
  }

  setScrollbar(__scrollbar) {
    this.scrollbar = __scrollbar;
    this.scrollbar.onChange = (__p) => {
      this.goto(Maths.lerp(this.y0, -this.y1, __p));
    };
  }

  resetPositions() {
    this.y1 = this.y0;

    for(let i=0; i<this.nItems; i++) {
      this.y1 += this._separacion;
      this._items[i].setPositions(0, this.y1);
      this._items[i].itemSig = this._items[i + 1 === this.nItems? 0 : i + 1];
      this._items[i].itemAnt = this._items[i - 1 < 0? this.nItems-1 : i - 1];
      this.y1 += this._items[i].height;
    }

    this.first = 0;
    this.last = this.nItems-1;
    this.y = this._items[0].y;
    this.y1 = Math.floor(Metrics.WIDTH - this.y1);

    this.scrollPosition = this._items[0].y;
    this.scrollSize =  Number(this._items[this.nItems-1].y + this._items[this.nItems-1].height);
  }

  goto(__n, __t = 3, __e = Expo.easeOut) {
    this.mainVel = 0;
    this.vel = 0;
    TweenLite.to(this,__t,{x:__n, ease:__e});
  }

  move(__n) {
    Math.min(this.p0, Math.max(Maths.precission(this.target + __n, 2), this.p1));
  }

  loop() {
    if(this._enabled) {

      this.vel = Maths.precission(((this.target - this.y) * this.res), 2);
      if(this.vel === 0) this.y = this.target;

      this.y = Maths.precission(this.y + this.vel, 2);
      Basics.velocidad = this.vel;
      Scroll.y = this.y;

      if (this.vel < 0) {

        this._items[this.first].y = this._items[this.first].y + this.vel;

        let ant = this.first;
        let act = this.first + 1;

        for (let i = 1; i < this.nItems; i++) {
          if (ant === this.nItems) ant = 0;
          if (act === this.nItems) act = 0;

          this._items[act].y = this._items[ant].y + this._items[ant].height + this._separacion;
          ant++;
          act++;
        }

        for (let i = 0; i < this.nItems; i++) {
          this._itemsCheck[i].checkPosition(this._separacion);
        }

      } else if (this.vel > 0) {
        this._items[this.last].y = this._items[this.last].y + this.vel;

        let ant = this.last;
        let act = this.last - 1;

        for (let i = 1; i < this.nItems; i++) {
          if (ant < 0) ant = this.nItems - 1;
          if (act < 0) act = this.nItems - 1;

          this._items[act].y = this._items[ant].y - this._items[act].height - this._separacion;
          ant--;
          act--;
        }

        for (let i = 0; i < this.nItems; i++) {
          this._itemsCheck[i].checkPositionInv(this._separacion);
        }
      }

      if (this._enabled &&
        !Basics.isMobile &&
        this.scrollbar) {

        this.calcProgress();
        this.scrollbar.update(this.progress);
      }

    } else {
      Scroll.isScrolling = false;
    }
  }

  calcProgress() {
    this.scrollPosition = this.scrollPosition + (this.vel * (-1));
    if (this.scrollPosition > this.scrollSize) this.scrollPosition = this.scrollPosition - this.scrollSize;
    else if (this.scrollPosition < 0) this.scrollPosition = this.scrollSize - this.scrollPosition;

    this.progress = this.scrollPosition === 0 ? 0 : this.scrollPosition / this.scrollSize;
  }


  resize() {

    for(let i=0; i<this.nItems; i++) {
      this._items[i].resize(this._container.offsetWidth, this._container.offsetHeight);
    }

    this._items[this.first].y = this._items[this.first].y + this.vel;

    let ant = this.first;
    let act = this.first + 1;
    for (let i = 1; i < this.nItems; i++) {
      if (ant === this.nItems) ant = 0;
      if (act === this.nItems) act = 0;

      this._items[act].y = this._items[ant].y + this._items[ant].height + this._separacion;
      ant++;
      act++;
    }

    for (let i = 0; i < this.nItems; i++) {
      this._itemsCheck[i].checkPosition(this._separacion);
    }
  }

  hide() {
    this.enabled = false;
    if(this._bar) TweenLite.to(this._bar,1,{scaleX:0});
  }

  dispose() {
    this.enabled = false;
    for (let i = 0; i < this.nItems; i++) {
      this._items[i].dispose();
    }
    this.nItems = 0;
    this._items = [];
  }
}

class VScrollInfinityItem  {
  _item;
  index;
  itemAnt;
  itemSig;
  width;
  height;
  _x = 0;
  _y = 0;
  _z = 0;
  _y0;
  _y1;
  _scroller;
  _needUpdate = false;
  _isShow = false;

  onShow = null;
  onHide = null;
  onLoop = null;

  _nInsiders = 0;
  _insiders = [];

  get isInViewport() { return this._y >= this._y0 && this._y < this._y1; }
  get progressItem() { return Maths.precission(Maths.normalize(this._y0,this._y1,this._y),3); }

  get x() { return this._y;  }
  set x(__n) {
    this._x = Maths.precission(__n,2);
    this._item.style[CSS.transform] = CSS.translate3D(this._x,this._y,this._z);
  }
  get y() { return this._y;  }
  set y(__n) {
    this._y =  Maths.precission(__n,2);
    this.progress = this.progressItem;

    if(this.isInViewport) {
      if (!this._needUpdate) {
        this._item.style.visibility = "visible";
        this._needUpdate = true;
      }

      if(!this._isShow) {
        this._isShow = true;
        if(this.onShow) this.onShow();
      }

      this._item.style[CSS.transform] = CSS.translate3D(this._x,this._y,this._z);
      this.setInsideY();

    } else if(this._needUpdate) {

      this._needUpdate = false;
      this._item.style.visibility = "hidden";
      this._item.style[CSS.transform] = CSS.translate3D(this._x,this._y,this._z);
      this.setInsideY();

      if(this.onHide) {
        this._isShow = false;
        this.onHide();
      }
    }
  }
  setPositions(__x, __y) {
    this._x =  Maths.precission(__x,2);
    this._y = Maths.precission(__y,2);
    this._item.style[CSS.transform] = CSS.translate3D(this._x,this._y,this._z);
  }
  setInsideY() {
    if(this._nInsiders > 0) {
      for(let i = 0; i<this._nInsiders; i++) {
        this._insiders[i].loop(this.y, this.progress);
      }
    }
  }


  constructor(__link, __index, __scroller) {
    this._item = __link;
    this.index = __index;
    this._scroller = __scroller;

    this._z = this._item.getAttribute("data-z") == null? this._z : Number(this._item.getAttribute("data-z"));

    if(__link) {
      this.width = this._item.offsetWidth;
      this.height = this._item.offsetHeight;
    }

    this.getInsiders();
  }

  getInsiders() {
    let _items;
    /* STOPPERS */
    _items = C.GetBy.selector("[data-scroll-sticky]", this._item);
    for (let i = 0, j = _items.length; i < j; i++) {
      let item = new VScroll_Item_Sticky(_items[i]);
      this._nInsiders = this._insiders.push(item)
    }

    /* SCALERS */
    _items = C.GetBy.selector("[data-scroll-scale]", this._item);
    for (let i = 0, j = _items.length; i < j; i++) {
      let item = new VScroll_Item_Scale(_items[i]);
      this._nInsiders = this._insiders.push(item)
    }

    /* MOVERS */
    _items = C.GetBy.selector("[data-scroll-displace]", this._item);
    for (let i = 0, j = _items.length; i < j; i++) {
      let item = new VScroll_Item_Displace(_items[i]);
      this._nInsiders = this._insiders.push(item)
    }

    /* INSIDERS */
    _items = C.GetBy.selector("[data-scroll-insider]", this._item);
    for (let i = 0, j = _items.length; i < j; i++) {
      let item = new VScroll_Item_Insider(_items[i]);
      this._nInsiders = this._insiders.push(item)
    }
  }

  resize(__w, __h) {
    if(this._item.offsetHeight > 0) {
      this.width = this._item.offsetWidth;
      this.height = this._item.offsetHeight;
    }
    this._y0 = -(this.height + 500);
    this._y1 = __w + 500;

    this.progress = this.progressItem;

    /**/
    if(this._nInsiders > 0) {
      for(let i = 0; i<this._nInsiders; i++) {
        this._insiders[i].resize(this.height);
      }
    }
    /**/
  }

  checkPosition(__sep = 0) {

    if(this._y + this.height < -100) {

      this._scroller.first = this._scroller.first + 1;
      this._scroller.last = this.index;
      if(this._scroller.first == this._scroller.nItems) this._scroller.first = 0;

      this.y = this.itemAnt.y + this.itemAnt.height + __sep
    } else if(this._y > 0 && this._y < Metrics.CENTER_Y) {
      this._scroller.actual = this.index;

      if(this._y < 10010)  {
        this._scroller.zero = this.index;
      }
    }
  }

  checkPositionInv(__sep = 0) {

    if(this.y > Metrics.HEIGHT + 100) {
      this._scroller.last = this._scroller.last-1;
      this._scroller.first = this.index;
      if(this._scroller.last < 0) this._scroller.last = this._scroller.nItems-1;

      this.y = this.itemSig.y - this.height - __sep
    } else if(this._y > 0 && this._y < Metrics.CENTER_Y) {
      this._scroller.actual = this.index;

      if(this._y < 10000) {
        this._scroller.zero = this.index;
      }
    }
  }

  dispose() {
    this._item = null;
    this._nInsiders = 0;
    this._insiders = [];
  }
}
