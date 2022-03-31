import Cursor__Item from './Cursor__Item';
import { gsap, Power4 } from 'gsap';

export default class Cursor__Icon extends Cursor__Item{
  image = new Image();
  enabled = false;
  _sizeShow;

  constructor(__src, __size, __ctx) {
    super(__size, __ctx);
    this.image.onload = () => {this.enabled = true;};
    this.image.src = __src;
    this._sizeShow = this.size;
  }

  show() {
    this.size = this._sizeShow * .5;
    gsap.to(this,{duration:.5, size:this._sizeShow, ease:Power4.easeOut});
  }

  draw() {
    if(this.enabled) {
      this._ctx.globalAlpha = this.alpha;
      this._ctx.drawImage(this.image, this._x, this._y, this._size, this._size);
      this._ctx.restore();
      //this._ctx.translate(0,0);
    }
  }
}
