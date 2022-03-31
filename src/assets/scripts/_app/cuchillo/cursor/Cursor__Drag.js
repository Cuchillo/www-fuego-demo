import Cursor__Item from './Cursor__Item';
import Cursor__Dot from './Cursor__Dot';
import { gsap, Power3, Power4 } from 'gsap';

export default class Cursor__Drag extends Cursor__Item{
  iconL;
  iconR;
  posL = 0;
  posR = 0;
  enabled = false;
  axis;
  _arrow;
  _follower;
  _isOut = true;

  constructor(__size, __arrow, __follower, __ctx) {
    super(__size, __ctx);
    this.iconL = new Cursor__Dot({size:__size, alpha:1, stroke:0, strokeAlpha: 0}, __ctx);
    this.iconR = new Cursor__Dot({size:__size, alpha:1, stroke:0, strokeAlpha: 0}, __ctx);
    this._arrow = __arrow;
    this._follower = __follower;
  }

  show(__axis = "x") {
    this.axis = __axis;
    this._isOut = false;
    this.enabled = true;

    if(!this.isDragging) {
      gsap.to(this.iconL, .2, {size:this._sizeabs, ease: Power4.easeOut});
      gsap.to(this.iconR, .2, {size:this._sizeabs, ease: Power4.easeOut});
      gsap.to(this, .8, {posL: -20, posR: 20, ease: Power4.easeOut});
      gsap.to(this._arrow, .4, {size: 10, ease: Power4.easeOut});
      gsap.to(this._follower, .8, {size: 80, ease: Power4.easeOut});
    }
  }

  hide() {
    this._isOut = true;
    if(!this.isDragging) {
      gsap.to(this.iconL, .2, {size:0, ease: Power3.easeOut});
      gsap.to(this.iconR, .2, {size:0, ease: Power3.easeOut});
      gsap.to(this._arrow, .4, {size: this._arrow.default.size, ease: Power3.easeOut});
      gsap.to(this._follower, .3, {size: this._follower.default.size, ease: Power3.easeOut});
      gsap.to(this, .4, {
        posL: 0, posR: 0, ease: Power3.easeOut, onComplete: () => {
          this.enabled = false;
        }
      });
    }
  }

  drag() {
    this.isDragging = true;
    this.enabled = true;
    gsap.to(this.iconL, .2, {size:this._sizeabs, ease: Power4.easeOut});
    gsap.to(this.iconR, .2, {size:this._sizeabs, ease: Power4.easeOut});
    gsap.to(this,.8, {posL:-14, posR:14, ease:Power4.easeOut});
    gsap.to(this._arrow, .4, {size: 10, ease: Power4.easeOut});
    gsap.to(this._follower,.8, {size:100, ease:Power4.easeOut});
  }

  dragEnd() {
    this.isDragging = false;
    if(this._isOut) {
      this.hide();
    } else {
      this.show(this.axis);
    }
  }

  draw() {
    if(this.axis === "x") {
      this.iconL._x = this._arrow._x + this.posL * window.devicePixelRatio;
      this.iconL._y = this._arrow._y;
      this.iconR._x = this._arrow._x + this.posR * window.devicePixelRatio;
      this.iconR._y = this._arrow._y;
    } else {
      this.iconL._x = this._arrow._x;
      this.iconL._y = this._arrow._y + this.posL * window.devicePixelRatio;
      this.iconR._x = this._arrow._x;
      this.iconR._y = this._arrow._y + this.posR * window.devicePixelRatio;
    }

    this.iconL.colorR = this._arrow.colorR;
    this.iconL.colorG = this._arrow.colorG;
    this.iconL.colorB = this._arrow.colorB;
    this.iconR.colorR = this._arrow.colorR;
    this.iconR.colorG = this._arrow.colorG;
    this.iconR.colorB = this._arrow.colorB;

    this.iconL.draw();
    this.iconR.draw();
  }
}

