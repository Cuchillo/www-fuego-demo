import { GetBy, C } from '../core/Element';
import { CSS } from '../utils/CSS';
import { Scroll } from './Scroll';
import { Maths } from '../utils/Maths';
import { isTouch, isSmartphone } from '../core/Basics';

export default class VScroll_Item {
  item;
  id;
  index;
  top;
  left;
  width;
  height;
  progress = 0;
  opts = {
    speed: {
      y:1,
      x:1,
      z:1
    },
    offset:0,
    offsetShow:0,
    positionStop:null,
    positionResume:null,
  };

  //
  onShow = null;
  onVisible = null;
  onHide = null;
  onMove = null; //position{x,y,z} size{width,height}

  hasHiddenEnabled = true;
  hasMove = true;
  isShow = false;
  isVisible = false;
  firstShow = true;
  firstVisible = true;

  _x = 0;
  _y = 0;
  _z = 0;
  _p0 = 0;
  _p1 = 0;

  _needUpdate = true;

  _nInsiders = 0;
  _insiders = [];
  _nVideos = 0;
  _videos = [];

  _axis = "y";
  _measure = "height";
  _domAxis = "top";
  _offsetAxis = "offsetTop";
  _offsetSize = "offsetHeight";

  /* GETTER SETTER */

  get isInViewport() { return this.positionAxis >= this._p0 && this.positionAxis < this._p1; }
  get isInViewportOffset() { return this.positionAxis + this.opts.offsetShow >= this._p0 && this.positionAxis + this.opts.offsetShow < this._p1; }
  get progressItem() { return Maths.precission(Maths.normalize(this._p0,this._p1,this.positionAxis),3); }
  get progressInside() { return Maths.precission(Maths.normalize(this._p0 + this[this._measure],this._p1 - this[this._measure], this.positionAxis),3); }
  get progressTop() { return Maths.precission(Maths.normalize(this._p0 + this[this._measure],this._p1, this.positionAxis),3); }

  get realX() { return this.left + this._x; }
  get realY() { return this.top + this._y; }

  get positionAxis() { return this[this._axis]; }
  set positionAxis(__n) {
    this[this._axis] = __n;
    this.update();
  }

  get x() { return this._x;  }
  set x(__n) {
    this._x = Maths.precission(__n, 2) * this.opts.speed.x;
    this.update();
  }

  get y() { return this._y;  }
  set y(__n) {
    this._y =  Maths.precission(__n,2) * this.opts.speed.y;
    this.update();
  }

  get z() { return this._z;  }
  set z(__n) {
    this._z = Maths.precission(__n, 2) * this.opts.speed.z;
    this.update();
  }

  update() {
    this.progress = this.progressItem;

    if(this.isInViewport || !this.hasHiddenEnabled) {
      if(!this._needUpdate) {
        this.item.style.opacity = 1;
        this.item.style.pointerEvents = "all";
        this._needUpdate = true;
      }

      this.draw();
      this.setInsideY();
      this.visible();
      this.show();

    } else if(this._needUpdate) {
      this._needUpdate = false;
      if(this.hasHiddenEnabled) {
        this.item.style.opacity = 0;
        this.item.style.pointerEvents = "none";
      }
      this.draw();
      this.setInsideY();
      this.hide();
    }
  }

  draw() {
    let y = this._y;
    let x = this._x;
    let z = this._z;

    if (this.opts.positionStop != null) {
      switch (this._axis) {
        case "y":
          y = Math.min(this.y + this.opts.positionResume, Math.max(this.y, this.opts.positionStop));
          break;

        case "x":
          //x = Math.min(this.x + this.opts.positionResume, Math.max(this.x, this.opts.positionStop));
          x = Math.max(this.x, this.opts.positionStop - this.left);
          break;

        case "z":
          z = Math.min(this.z + this.opts.positionResume, Math.max(this.z, this.opts.positionStop));
          break;
      }
    }

    
    if(!this._scroller.isNative && this.hasMove) {
      //this.item.style[CSS.transform] = CSS.translate3D(x, y, z);
      this.item.style[CSS.transform] = CSS.matrix3D(x, y, z);
    }

    this.item.style.setProperty('--y', `${this.realY}px`);

    if(this.onMove) {
      this.onMove({x:this.realX, y:this.realY, z:this.z}, {width:this.width, height:this.height});
    }
  }

  setPositions(__top, __left) {
    this.top = __top;
    this.left = __left;
    this.setInsidePosition();
  }

  setInsideY() {
    if(this._nInsiders > 0) {
      for(let i = 0; i<this._nInsiders; i++) {
        this._insiders[i].loop({x:this.realX, y:this.realY, z:this.z}, this.progress, this.progressInside);
      }
    }
  }

  setInsidePosition() {
    this.setInsideY();
  }

  //
  // CONSTRUCTOR
  //

  constructor(__link, __index, __scroller) {
    this.item = __link;
    this.index = __index;
    this.id = this.getId();

    this._item = __link;
    this._scroller = __scroller;

    this._axis = this._scroller._axis;
    this._domAxis = this._axis === "y"? "top" : "left";
    this._measure = this._axis === "y"? "height" : "width";

    const TRANSLATE = CSS.getTranslate(this.item);
    this._x = TRANSLATE.x;
    this._y = TRANSLATE.y;
    this._z = TRANSLATE.z;

    this.getOptions();
    this.getInsiders();
  }

  getOptions() {
    this.opts.speed[this._axis] = this.item.getAttribute("data-speed") !== null? Number(this.item.getAttribute("data-speed")) : this.opts.speed[this._axis];
    this.opts.speed.y = this.item.getAttribute("data-speed-y") !== null? Number(this.item.getAttribute("data-speed-y")) : this.opts.speed.y;
    this.opts.speed.x = this.item.getAttribute("data-speed-x") !== null? Number(this.item.getAttribute("data-speed-x")) : this.opts.speed.x;
    this.opts.speed.z = this.item.getAttribute("data-speed-z") !== null? Number(this.item.getAttribute("data-speed-z")) : this.opts.speed.z;
    this.opts.offset = this.item.getAttribute("data-offset") !== null? Number(this.item.getAttribute("data-offset")) : this.opts.offset;
    this.opts.positionStop = this.item.getAttribute("data-stop") !== null? Number(this.item.getAttribute("data-stop")) : this.opts.positionStop;
    this.opts.positionResume = this.item.getAttribute("data-resume") !== null? Number(this.item.getAttribute("data-resume")) : this.opts.positionResume;
    //POSTION Z
    this._z = this.item.getAttribute("data-z") !== null? Number(this.item.getAttribute("data-z")) : this._z;
  }

  getId() {
    if(!this.item.getAttribute("id")) {
      this.item.setAttribute("id", "__" + new Date().getTime() + "__" + this.index);
    }

    return this.item.getAttribute("id");
  }

  getInsiders() {
    let items;

    /* VIDEO */
    items = GetBy.selector("[data-scroll-video]", this.item);
    for (let i = 0, j = items.length; i < j; i++) {
      let id = items[i].getAttribute("data-scroller-id") || this._scroller.id;
      
      if(id === this._scroller.id) {
        this._nVideos = this._videos.push(items[i])
      }
    }

    /* INSIDERS */
    for (let i = 0, j = Scroll._insidersItems.length; i < j; i++) {
      const selector = Scroll._insidersItems[i].id;
      const InsiderClass = Scroll._insidersItems[i].class;

      if(!this._scroller.isNative || (this._scroller.isNative && InsiderClass.isNativeAllowed)) {
        C.forEach(GetBy.selector("[" + selector + "]", this.item), (e) => {
          const idScroll = e.getAttribute("data-scroller-id") || this._scroller.id;
          const MOBILE_ENABLED = isTouch && e.getAttribute("data-avoid-mobile") === null || !isTouch;
          const SMARTPHONE_ENABLED = isSmartphone && e.getAttribute("data-avoid-smartphone") === null || !isSmartphone;

          if (idScroll === this._scroller.id && MOBILE_ENABLED && SMARTPHONE_ENABLED) {
            this._nInsiders = this._insiders.push(new InsiderClass(e, this._axis))
          }
        })
      }
    }
  }

  loop() {};

  visible() {
    if(Math.round(this.realY) === 0) {
      Scroll.anchor = this.id;
    }
    if(this.isVisible) return;

    Scroll.anchor = this.id;

    this._playVideos();

    if (this.onVisible) {
      this.onVisible();
    }

    this.firstVisible = false;
    this.isVisible = true;
  }

  show() {
    if(this.isShow) return;

    const doShow = () => {
      if (this.onShow) {
        this.onShow();

        if(!this.onHide) {
          this.onShow =  null;
        }
      }

      this.firstShow = false;
      this.isShow = true;
    };

    if(this.opts.offsetShow) {
      if(this.isInViewportOffset) {
        doShow();
      }
    } else {
      doShow();
    }
  }

  hide() {
    this._pauseVideos();
    this.isShow = false;
    this.isVisible = false;

    if(this.onHide) {
      this.onHide();
    }
  }

  _playVideos() {
    for(let i = 0; i<this._nVideos; i++) {
      this._videos[i].play()
    }
  }

  _pauseVideos() {
    for(let i = 0; i<this._nVideos; i++) {
      this._videos[i].pause()
    }
  }

  resize(__w,__h) {
    this.width = this.item.offsetWidth;
    this.height = this.item.offsetHeight;
    this.opts.offset = window.innerHeight * .5;

    for(let i = 0; i<this._nInsiders; i++) {
      this._insiders[i].resize({width:this.width, height:this.height});
    }
  }

  resizeLimits(__h) {
    this.top = this.item.offsetTop;
    this.top = this.item.getBoundingClientRect().top - Scroll.y;
    this.left = this.item.offsetLeft;

    if(this.opts.positionResume){
      this._p0 = -(this[this._measure] + this.opts.offset + this.opts.positionResume + this[this._domAxis]);
    } else {
      this._p0 = -(this[this._measure] + this.opts.offset + this[this._domAxis]);
    }

    this._p1 = __h + this.opts.offset - this[this._domAxis];

    /**/
    if(!this._scroller.isNative) {
      this.item.style[CSS.transform] = CSS.matrix3D(this._x, this._y, this._z);
    }
    this.progress = this.progressItem;

    if(!this.isInViewport) {
      this.item.style.opacity = 1;
      this.item.style.pointerEvents = "all";
    }

    this.setInsideY();
  }

  dispose() {
    for(let i = 0; i<this._nInsiders; i++) {
      this._insiders[i].dispose();
    }

    this._nInsiders = 0;
    this._insiders = [];
    this.item.style[CSS.transform] = CSS.translate3D(0,0,0);
    this.item = null;
  }
}