import Cursor__Item from './Cursor__Item';
import Cursor__DotComplex from './Cursor__DotComplex';
import { gsap, Power3, Expo, Linear } from 'gsap';

export default class Cursor__Loading extends Cursor__Item{
  enabled = false;
  _follower;
  _dot;
  _idTimer;
  _options

  constructor(__options, __arrow, __follower, __ctx) {
    super(__options.size, __ctx);
    this._arrow = __arrow;
    this._follower = __follower;
    this._options = __options;

    this._dot = new Cursor__DotComplex({size:this._follower.default.size, alpha:0, stroke:this._options.stroke, strokeAlpha: 1}, __ctx);
    this._dot.angleStart = 0;
    this._dot.angleEnd = 0;
  }

  show() {
    if(this._idTimer) {
      clearTimeout(this._idTimer);
    }

    document.body.classList.add("__loading");

    this.enabled = true;
    this._dot.angleStart = 0;
    this._dot.angleEnd = 0;
    this._dot.stroke = this._options.stroke;

    this._idTimer = setTimeout(()=> {
      gsap.to(this._arrow, .1, {alpha: 0, ease: Power3.easeOut});
      gsap.to(this._follower, 1, {size: this._sizeabs, stroke: this._options.strokeBG, strokeAlpha: this._options.strokeAlpha, ease: Expo.easeOut});
      gsap.to(this._arrow, 1, {size: this._sizeabs, ease: Expo.easeOut});
      gsap.to(this._dot, 1, {size: this._sizeabs, ease: Expo.easeOut});
      gsap.to(this._dot, 10, {angleEnd: .9, ease: Linear.easeNone});
    },200);
  }

  hide() {
    if(this._idTimer) {
      clearTimeout(this._idTimer);
    }

    gsap.killTweensOf(this._dot);
    gsap.to(this._dot, .4, {angleEnd: 1, ease: Power4.easeOut});
    gsap.to(this._dot, 1, {size: this._follower.default.size, stroke:this._follower.default.stroke, ease: Expo.easeInOut});
    gsap.to(this._arrow, 1, {size: this._arrow.default.size, alpha:this._arrow.default.alpha, ease: Expo.easeInOut});
    gsap.to(this._follower, 1, {size: this._follower.default.size, stroke: this._follower.default.stroke, ease: Expo.easeInOut});

    this._idTimer = setTimeout(()=>{
      this.enabled = false;
      this._idTimer = null;
      document.body.classList.remove("__loading");
    },1000);
  }

  draw() {
    this._dot.colorR = this._arrow.colorR;
    this._dot.colorG = this._arrow.colorG;
    this._dot.colorB = this._arrow.colorB;

    this._dot.rotation += .1;
    this._dot._x = this._follower._x;
    this._dot._y = this._follower._y;
    this._dot.draw();
  }
}

