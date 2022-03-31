import Cursor from './Cursor';
import { Maths } from '../utils/Maths';
import { gsap, Power3, Power2 } from 'gsap';

export default class Cursor__Dot {
  _x = 1;
  _y = 1;
  _xabs = 1;
  _yabs = 1;
  _size = 0;
  _sizeabs = 0;
  _easing = 1;
  _stroke = 0;
  _strokeabs = 0;
  _radius = 0;
  _pi2 = Math.PI * 2;
  _ctx;

  alpha = 0;
  strokeAlpha = 0;
  colorR = 255;
  colorG = 255;
  colorB = 255;

  default = {
    size: 40,
    color: {r:255, g:255, b:255},
    alpha: 0,
    stroke: 0,
    strokeAlpha: 0,
    time: .3
  };

  get x() { return this._x; }
  set x(__x) {
    this._x = __x * window.devicePixelRatio;
    this._xabs = __x;
  }
  get y() { return this._y; }
  set y(__y) {
    this._y = __y * window.devicePixelRatio;
    this._yabs = __y;
  }

  get stroke() { return this._strokeabs; }
  set stroke(__n) {
    this._strokeabs = __n;
    this._stroke = Maths.precission(__n * window.devicePixelRatio);
  }
  get size() { return this._sizeabs; }
  set size(__n) {
    this._sizeabs = __n;
    this._size = __n * window.devicePixelRatio;
    this._radius = this._size * .5;
  }

  constructor(__default = {}, __ctx) {
    this._ctx = __ctx;

    this.default = {
      size: __default.size || this.default.size,
      stroke: __default.stroke || this.default.stroke,
      color: Cursor.hexToRgb(__default.color) || null,
      alpha: __default.alpha || this.default.alpha,
      strokeAlpha: __default.strokeAlpha || this.default.strokeAlpha,
      strokeColor: __default.strokeColor || null,
      time: __default.time || this.default.time,
    };

    const defaultColor = this.default.color? this.default.color : Cursor.colorRGB;

    this._easing = __default.easing || this._easing;
    this.size = this.default.size;
    this.stroke = this.default.stroke;
    this.color = this.default.color;
    this.alpha = this.default.alpha;
    this.strokeColor = this.default.strokeColor;
    this.strokeAlpha = this.default.strokeAlpha;

    this.colorR = defaultColor.r;
    this.colorG = defaultColor.g;
    this.colorB = defaultColor.b;
  }

  changeTo(__item, __type = "arrow", __target = null, __isOnlyColor = false) {
    if(!__target) __target = __item;
    let alpha = __item.getAttribute("data-" + __type + "-alpha") !== null? Number(__item.getAttribute("data-" + __type + "-alpha")) : null;
    let strokeAlpha = __item.getAttribute("data-" + __type + "-stroke-alpha") !== null? Number(__item.getAttribute("data-" + __type + "-stroke-alpha")) : null;

    const defaultColor = this.default.color? this.default.color : Cursor.colorRGB;

    let options = {
      color: Cursor.hexToRgb(__item.getAttribute("data-" + __type + "-color")) || defaultColor,
      alpha: __item.getAttribute("data-" + __type + "-alpha") !== null? Number(__item.getAttribute("data-" + __type + "-alpha")) : this.default.alpha,
      time: __item.getAttribute("data-" + __type + "-time") !== null? Number(__item.getAttribute("data-" + __type + "-time")) : this.default.time,
      size: __item.getAttribute("data-" + __type + "-size") !== null? Cursor.parseSize(__item.getAttribute("data-" + __type + "-size"), __target) : this.default.size,
      stroke:  __item.getAttribute("data-" + __type + "-stroke") !== null? Number(__item.getAttribute("data-" + __type + "-stroke")) : this.default.stroke,
      strokeAlpha:  __item.getAttribute("data-" + __type + "-stroke-alpha") !== null? Number(__item.getAttribute("data-" + __type + "-stroke-alpha")) : this.default.strokeAlpha,
    };

    if(__isOnlyColor) {
      gsap.to(this,options.time, {
        colorR:options.color.r,
        colorG:options.color.g,
        colorB:options.color.b,
        ease:Power3.easeOut
      });
    } else {
      gsap.to(this,options.time, {
        size: options.size,
        colorR:options.color.r,
        colorG:options.color.g,
        colorB:options.color.b,
        alpha:options.alpha,
        stroke:options.stroke,
        strokeAlpha:options.strokeAlpha,
        ease:Power3.easeOut
      });
    }
  }

  backToDefault() {
    const options = this.default;
    const defaultColor = this.default.color? this.default.color : Cursor.colorRGB;

    gsap.to(this, {
      size:options.size,
      colorR:defaultColor.r,
      colorG:defaultColor.g,
      colorB:defaultColor.b,
      alpha:options.alpha,
      stroke:options.stroke,
      strokeAlpha:options.strokeAlpha,
      ease:Power3.easeOut,
      duration: options.time
    });
  }

  backToDefaultColor() {
    const options = this.default;
    const defaultColor = this.default.color? this.default.color : Cursor.colorRGB;

    gsap.to(this,{
      colorR:defaultColor.r,
      colorG:defaultColor.g,
      colorB:defaultColor.b,
      ease:Power3.easeOut,
      duration: options.time
    });
  }

  draw() {
    this._ctx.globalAlpha = 1;
    this._ctx.beginPath();
    this._ctx.arc(this._x, this._y, this._radius, 0, this._pi2, false);
    this._ctx.fillStyle = Cursor.rgbToCSS({r:this.colorR, g:this.colorG, b:this.colorB}, this.alpha);
    this._ctx.fill();//

    this._ctx.lineWidth = this._stroke;
    this._ctx.strokeStyle = Cursor.rgbToCSS({r:this.colorR, g:this.colorG, b:this.colorB}, this.strokeAlpha);
    this._ctx.stroke();
  }
}
