export default class Cursor__Item {
  image = new Image();
  alpha = 1;
  _x = 1;
  _y = 1;
  _xabs = 1;
  _yabs = 1;
  _size = 0;
  _sizeabs = 0;
  _ctx;

  get x() { return this._x; }
  set x(__x) {
    this._xabs = __x - this._sizeabs *.5;
    this._x = this._xabs * window.devicePixelRatio;
  }
  get y() { return this._y; }
  set y(__y) {
    this._yabs = __y - this._sizeabs *.5;
    this._y = this._yabs * window.devicePixelRatio;
  }

  get size() { return this._sizeabs; }
  set size(__n) {
    this._sizeabs = __n;
    this._size = __n * window.devicePixelRatio;
  }

  constructor(__size, __ctx) {
    this.size = __size;
    this._ctx = __ctx;
  }

  draw() {}
}