import Cursor from './Cursor';
import Cursor__Dot from './Cursor__Dot';

export default class Cursor__DotComplex extends Cursor__Dot{
  angleStart = 0;
  angleEnd = 1;
  rotation = 0;

  constructor(__default = {}, __ctx) {
    super(__default, __ctx);
  }

  draw() {
    this._ctx.globalAlpha = 1;
    this._ctx.beginPath();
    this._ctx.arc(this._x, this._y, this._radius, (this._pi2 * this.angleStart) + this.rotation, (this._pi2 * this.angleEnd) + this.rotation, false);
    this._ctx.fillStyle = Cursor.rgbToCSS({r:this.colorR, g:this.colorG, b:this.colorB}, this.alpha);
    this._ctx.fill();//

    this._ctx.lineWidth = this._stroke;
    this._ctx.strokeStyle = Cursor.rgbToCSS({r:this.colorR, g:this.colorG, b:this.colorB}, this.strokeAlpha);
    this._ctx.stroke();
  }
}