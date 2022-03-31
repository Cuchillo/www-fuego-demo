class SliderInfinityScroll {
  _container;
  _holder;
  _scroll;
  _scrollBar;
  _interaction;
  _speedMin = 0;

  get speedMin() {
    return this._speedMin;
  }
  set speedMin(__n) {
    this._speedMin = __n;
    this._scroll.options.minVelocity = this._speedMin;
  }

  constructor(__container, __opt = {}) {
    this._container = __container;
    this._holder = C.GetBy.class("__holder", __container)[0];

    this._scroll = new VScrollHInfinity(__container, {
      axis:Scroll.AXIS_X,
      wheel:false,
      itemClass: SliderInfinityScroll__Item,
      easing: 0.05,
      minVelocity: this._speedMin,
      isMain: false
    });

    this._scrollBar = new Scrollbar(C.GetBy.class("scrollbar")[0]);
    this._scroll.addAll("[scroll-slider-item]");
    this._scroll.setScrollbar(this._scrollBar);
    this._scroll.resize();
    this._scrollBar.update(0);
    this._scroll.start();

    this._interaction = new MrInteraction(this._holder, {
      drag:true,
      axis:"x",
      dragCheckTime: .05,
      onMove:(n)=> {
        if(__opt.onMove) __opt.onMove();
        this._scroll.move(n);
      },
      onDragStart:()=> {
        if(__opt.onDragStart) __opt.onDragStart();
        for (let i = 0; i < this._scroll.total_items; i++) {
          this._scroll._items[i].mouseDown();
        }
      },
      onDragEnd:()=> {
        if(__opt.onDragEnd) __opt.onDragEnd();
        for (let i = 0; i < this._scroll.total_items; i++) {
          this._scroll._items[i].mouseUp();
        }
      }
    });
  }

  loop() {
    this._scroll.loop();
  }

  resize() {
    this._scroll.resize();
  }

  dispose() {
    this._scroll.dispose();
    this._interaction.dispose();
    this._scrollBar.dispose();
  }

  goto(__n) {
    this._scroll.goto(__n);
  }
}

class SliderInfinityScroll__Item extends VScrollHInfinityItem {
  _figure;
  _image;

  _size;
  _sizePress;

  _isDragging = false;
  _isDragged = false;
  _firstShow = true;

  isVoid = false;

//==================================================================================================================
//          CONSTRUCTOR
//==================================================================================================================

  constructor(__link, __index, __scroller) {
    super(__link, __index, __scroller);

    this.isVoid = C.GetBy.selector("img", this._item).length === 0;

    if(!this.isVoid) {
      this._image = C.GetBy.selector("img", this._item)[0];
      this._figure = C.GetBy.selector("figure", this._item)[0];
      this.resize();
    }
  }

//==================================================================================================================
//          PUBLIC
//==================================================================================================================

  mouseOver() {
    if(!this.isVoid) {
      TweenLite.to(this._figure, 0.8, {
        clip: this._sizeHover,
        ease: C.Ease.EASE_CUCHILLO_IN_OUT
      });
    }
  }

  mouseDown() {
    if(!this.isVoid) {
      TweenLite.to(this._figure, 0.8, {
        clip: this._sizePress,
        ease: C.Ease.EASE_CUCHILLO_IN_OUT
      });
      this._isDragging = true;
      this._isDragged = true;
    }
  }

  mouseUp() {
    if(!this.isVoid) {

      TweenLite.to(this._figure, 2, {
        clip: this._size,
        ease: Expo.easeOut
      });
      this._isDragging = false;

      this._isDragged = false;
    }
  }

  show() {
    super.show();
  }

  hide() {
    super.hide();
  }

  loop() {

  }

  resize(__w, __h) {
    if(!this.isVoid) {
      const wI = this._image.getAttribute("width") || this._image.getAttribute("data-width");
      const hI = this._image.getAttribute("height") || this._image.getAttribute("data-height");
      const scale = this.height/hI;
      const w = wI * scale;
      const h = hI * scale;

      this._size = Functions.getRect(w * .0, h * .0, w * 1, h * 1);
      this._sizePress = Functions.getRect(w * .05, h * .05, w * .9, h * .9);

      this._item.style.width = w + "px";
      this._figure.style.clip = this._size;
    }

    super.resize(__w, __h);
  }
}