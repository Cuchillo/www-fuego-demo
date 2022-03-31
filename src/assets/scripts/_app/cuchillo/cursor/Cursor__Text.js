import Cursor__Item from './Cursor__Item';

export default class Cursor__Text extends Cursor__Item{
  text = null;
  alpha = 1;
  style = {
    size:16,
    unit:"px",
    fontFamily:"Helvetica",
    color:"#000000",
    textAlign:"center"
  };
  _arrow;
  _offsetY;

  constructor(__style = {}, __arrow, __ctx) {
    super(0, __ctx);

    this.style = {
      size: __style.size || this.style.size,
      unit: __style.unit || this.style.unit,
      fontFamily: __style.fontFamily || this.style.fontFamily,
      color: __style.color || this.style.color,
      textAlign: __style.textAlign || this.style.textAlign,
    };

    this._arrow = __arrow;
    this.style.size = this.style.size * window.devicePixelRatio;
    this._offsetY = this.style.size*.5;
  }

  hide() {
    this.text = null;
  }

  draw() {
    if(this.text) {
      this._ctx.globalAlpha = this.alpha;
      this._ctx.font = this.style.size + this.style.unit + " " + this.style.fontFamily;
      this._ctx.fillStyle = this.style.color;
      this._ctx.textAlign = this.style.textAlign;
      this._ctx.fillText(this.text, this._arrow._x, this._arrow._y + this._offsetY);
    }
  }
}