export default class VScrollHInfinity {
  type = null;
  maxV = 4000;
  res = 0.09;
  vel = 0;
  mainVel = 0;
  target = 0;
  autoDirection = -1;

  scrollPosition = 0;
  scrollSize = 0;

  x = 0;
  p0 = 0;
  p1 = 0;
  total_items = 0;
  progress = 0;
  scrollbar = null;

  first;
  last;
  speed = 0;

  _separacion = 0;
  multiplicator = Basics.isTouch? 2 : 1;

  _items = [];
  _itemsCheck = [];
  _container = null;
  _actual = null;
  _zero = null;

  _onChange = null;
  _enabled = false;

  _aligning = false;

  //
  // GETTER & SETTER
  //

  get enabled() { return this._enabled; };
  set enabled(__e) {
    if(this._enabled !== __e) {
      this._enabled = __e;

      if(this.options.wheel) {
        if(__e) {
          VirtualScroll.on(this._call);
        } else {
          VirtualScroll.off(this._call);
        }
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

  constructor(__container, options, __onChange = null) {
    this.options = {
      axis: options.axis || Scroll.AXIS_Y,
      easing: options.easing || 0.08,
      maxSpeed: options.maxSpeed || 400,
      multiplicator: options.multiplicator || 1,
      gap: options.gap || 0,
      itemClass: options.itemClass || VScrollHInfinityItem,
      wheel: options.wheel === undefined? true : options.wheel,
      minVelocity: options.minVelocity || this.minVelocity,
      isMain: options.isMain? true : false,
    };

    this._container = __container;
    this._onChange = __onChange;

    this._container.classList.add("__vscroll");
  }

  //
  // PRIVATE
  //

  _check(e) {
    this._aligning = false;

    let d = Math.abs(e.deltaY) > Math.abs(e.deltaX)? e.deltaY * this.multiplicator : e.deltaX * this.multiplicator;

    Scroll.isScrolling = true;
    Scroll.direction = d < 0? 1 : -1;

    this.target = Maths.precission(this.target + d, 2);
  }

  _getClass(__item) {
    let idClass = __item.getAttribute("data-scroll-class") || "default";
    for(let i = 0, j = this.options.itemClass.length; i<j; i++) {
      if(idClass === this.options.itemClass[i].id || i === this.options.itemClass.length-1) {
        return this.options.itemClass[i].class;
      }
    }
  }

  //
  // PUBLIC
  //

  start() {
    this.enabled = true;
  }

  addDomElement(__item, __z = 0) {
    let item = new this.options.itemClass(__item, this.total_items, this);
    item.z = __z;
    this.total_items = this._items.push(item);
    this._itemsCheck.push(__item);

    this.resetPositions();
  }

  add(__item) {
    this.total_items = this._items.push(__item);
    this._itemsCheck.push(__item);

    this.resetPositions();
  }

  addAll(__selector = '[scroll-item]') {
    let _items = this._container.querySelectorAll(__selector);

    for (let i = 0, j = _items.length; i<j; i++) {
      let _class = Array.isArray(this.options.itemClass)? this._getClass(_items[i]) : this.options.itemClass;
      let _item = new _class(_items[i], this.total_items, this);
      this.total_items = this._items.push(_item);
      this._itemsCheck.push(_item);
    }

    this.resetPositions();
  }

  setScrollbar(__scrollbar) {
    this.scrollbar = __scrollbar;
    this.scrollbar.onChange = (__p) => {
      let m = Math.max(1, Math.floor(this.x/(-this.p1 - Metrics.WIDTH)));

      this.goto(Maths.lerp(this.p0, -this.p1, __p)*m);
    };
  }

  resetPositions() {
    this.p1 = this.p0;

    for(let i=0; i<this.total_items; i++) {
      this.p1 += this.options.gap;
      this._items[i].setPositions(this.p1, 0);
      this._items[i].itemSig = this._items[i + 1 === this.total_items? 0 : i + 1];
      this._items[i].itemAnt = this._items[i - 1 < 0? this.total_items-1 : i - 1];
      this.p1 += this._items[i].width;
    }

    this.first = 0;
    this.last = this.total_items-1;
    this.x = this._items[0].x;
    this.p1 = Math.floor(Metrics.WIDTH - this.p1);

    this.scrollPosition = this._items[0].x;
    this.scrollSize =  Number(this._items[this.total_items-1].x + this._items[this.total_items-1].width);


  }

  goto(__n, __t = 3, __e = Expo.easeOut) {
    this.target = -__n;
  }

  move(__n) {
    this.target = Maths.precission(this.target + __n, 2);
    if(__n!==0) this.autoDirection = __n < 0? -1 : 1;
  }

  loop() {
    if(this._enabled) {

      //ALIGN
      if(Math.abs(this.speed) < .5 && this.speed !== 0 && !this._aligning) {

        this.target = Metrics.CENTER_X * Math.round(this.x/Metrics.CENTER_X);
        this._aligning = true;
      }

      this.vel = Maths.precission(((this.target - this.x) * this.res), 2);
      //this.vel = Math.max(Math.abs(this.vel), this.options.minVelocity);


      if(this.options.minVelocity!=undefined) {
        if (this.autoDirection < 0) {
          this.vel = Math.min(this.vel, -this.options.minVelocity);
        } else {
          this.vel = Math.max(this.vel, this.options.minVelocity);
        }
      }

      if(this.vel === 0) this.x = this.target;

      this.x = Maths.precission(this.x + this.vel, 2);
      this.speed = this.vel;

      if(this.options.isMain) {
        Basics.velocidad = this.speed;
      }

      Scroll.x = this.x;

      if (this.vel < 0) {

        this._items[this.first].x = this._items[this.first].x + this.vel;

        let ant = this.first;
        let act = this.first + 1;

        for (let i = 1; i < this.total_items; i++) {
          if (ant === this.total_items) ant = 0;
          if (act === this.total_items) act = 0;

          this._items[act].x = this._items[ant].x + this._items[ant].width + this.options.gap;
          ant++;
          act++;
        }

        for (let i = 0; i < this.total_items; i++) {
          this._itemsCheck[i].checkPosition(this.options.gap);
        }

      } else if (this.vel > 0) {

        this._items[this.last].x = this._items[this.last].x + this.vel;

        let ant = this.last;
        let act = this.last - 1;

        for (let i = 1; i < this.total_items; i++) {
          if (ant < 0) ant = this.total_items - 1;
          if (act < 0) act = this.total_items - 1;

          this._items[act].x = this._items[ant].x - this._items[act].width - this.options.gap;
          ant--;
          act--;
        }

        for (let i = 0; i < this.total_items; i++) {
          this._itemsCheck[i].checkPositionInv(this.options.gap);
        }
      }

      this.progress = this.y === 0 ? 0 : this.x / this.p1;

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

    for(let i=0; i<this.total_items; i++) {
      this._items[i].resize(this._container.offsetWidth, this._container.offsetHeight);
    }

    this._items[this.first].x = this._items[this.first].x + this.vel;

    let ant = this.first;
    let act = this.first + 1;
    for (let i = 1; i < this.total_items; i++) {
      if (ant === this.total_items) ant = 0;
      if (act === this.total_items) act = 0;

      this._items[act].x = this._items[ant].x + this._items[ant].width + this.options.gap;
      ant++;
      act++;
    }

    for (let i = 0; i < this.total_items; i++) {
      this._itemsCheck[i].checkPosition(this.options.gap);
    }
  }

  hide() {
    this.enabled = false;
    if(this._bar) TweenLite.to(this._bar,1,{scaleX:0});
  }

  dispose() {
    this.enabled = false;
    for (let i = 0; i < this.total_items; i++) {
      this._items[i].dispose();
    }
    this.total_items = 0;
    this._items = [];
  }
}

class VScrollHInfinityItem  {
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
  _needUpdate = false;
  _isShow = false;
  _scroller;

  onShow = null;
  onHide = null;
  onLoop = null;

  _nInsiders = 0;
  _insiders = [];

  get isInViewport() { return this._x >= this._p0 && this._x < this._p1; }
  get progressItem() { return Maths.precission(Maths.normalize(this._p0,this._p1,this._x),3); }

  get x() { return this._x;  }
  set x(__n) {

    this._x = Maths.precission(__n, 2);
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
      this.setInsideX();
    }  else if(this._needUpdate) {
      this._needUpdate = false;
      this._item.style.visibility = "hidden";
      this._item.style[CSS.transform] = CSS.translate3D(this._x,this._y,this._z);
      this.setInsideX();

      if(this.onHide) {
        this._isShow = false;
        this.onHide();
      }
    }
  }
  get y() { return this._y;  }
  set y(__n) {
    this._y =  Maths.precission(__n,2);
    this._item.style[CSS.transform] = CSS.translate3D(this._x,this._y,this._z);

  }
  setPositions(__x, __y) {
    this._x =  Maths.precission(__x,2);
    this._y = Maths.precission(__y,2);
    this._item.style[CSS.transform] = CSS.translate3D(this._x,this._y,this._z);
  }

  setInsideX() {
    if(this._nInsiders > 0) {
      for(let i = 0; i<this._nInsiders; i++) {
        this._insiders[i].loop(this.x, this.progress);
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
      let item = new VScrollH_Item_Sticky(_items[i]);
      this._nInsiders = this._insiders.push(item)
    }

    /* SCALERS */
    _items = C.GetBy.selector("[data-scroll-scale]", this._item);
    for (let i = 0, j = _items.length; i < j; i++) {
      let item = new VScrollH_Item_Scale(_items[i]);
      this._nInsiders = this._insiders.push(item)
    }

    /* MOVERS */
    _items = C.GetBy.selector("[data-scroll-displace]", this._item);
    for (let i = 0, j = _items.length; i < j; i++) {
      let item = new VScrollH_Item_Displace(_items[i]);
      this._nInsiders = this._insiders.push(item)
    }

    /* INSIDERS */
    _items = C.GetBy.selector("[data-scroll-insider]", this._item);
    for (let i = 0, j = _items.length; i < j; i++) {
      let item = new VScrollH_Item_Insider(_items[i]);
      this._nInsiders = this._insiders.push(item)
    }
  }


  resize(__w, __h) {
    if(this._item.offsetWidth > 0) {
      this.width = this._item.offsetWidth;
      this.height = this._item.offsetHeight;
    }
    this._p0 = -(this.width + 500);
    this._p1 = __w + 500;

    /**/
    if(this._nInsiders > 0) {
      for(let i = 0; i<this._nInsiders; i++) {
        this._insiders[i].resize(this.width);
      }
    }
    /**/
  }

  checkPosition(__sep = 0) {
    if(this._x + this.width < -100) {
      this._scroller.first = this._scroller.first + 1;
      this._scroller.last = this.index;
      if(this._scroller.first == this._scroller.total_items) this._scroller.first = 0;

      this.x = this.itemAnt.x + this.itemAnt.height + __sep
    } else if(this._x > 0 && this._x < Metrics.CENTER_X) {
      this._scroller.actual = this.index;

      if(this._x < 10010)  {
        this._scroller.zero = this.index;
      }
    }
  }

  checkPositionInv(__sep = 0) {
    if(this.x > Metrics.WIDTH + 100) {
      this._scroller.last = this._scroller.last-1;
      this._scroller.first = this.index;
      if(this._scroller.last < 0) this._scroller.last = this._scroller.total_items-1;

      this.x = this.itemSig.x - this.width - __sep
    } else if(this._x > 0 && this._x < Metrics.CENTER_X) {
      this._scroller.actual = this.index;

      if(this._x < 10000) {
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
