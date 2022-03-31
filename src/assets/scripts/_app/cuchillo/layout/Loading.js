import { Functions } from '../utils/Functions';
import { Metrics } from '../core/Metrics';

export default class _Loading {

  static POSITION_BOTTOM_LEFT = "BL";
  static POSITION_BOTTOM_RIGHT = "BR";
  static POSITION_TOP_LEFT = "TL";
  static POSITION_TOP_RIGHT = "TR";
  static POSITION_CENTER = "C";

  static colorRGB = "#FFFFFF";
  static options;
  static optionsAbs;

  static _enabled = false;
  static _color = "#FFFFFF";
  static _indicator;

  static get color() { return this._color; }
  static set color(__c) {
    this._color = __c;
    this.colorRGB =  Functions.hexToRgb(__c);

    if(this._indicator) {
      this._indicator.color = this.colorRGB;
    }
  }

  static get enabled() {
    return this._enabled;
  }
  static set enabled(__bool) {
    if(this._enabled === __bool) return;

    this._enabled = __bool

    if(this._enabled) {
      this.start();
    } else {
      this.stop();
    }
  }

  static init(options = {}) {
    this.color = options.color || this.color;

    this.optionsAbs = {
      color: options.color !== undefined? options.color : this._color,
      size: options.size !== undefined? options.size : 110,
      position: options.position !== undefined? options.position : Loading.POSITION_BOTTOM_RIGHT,
      padding: options.padding !== undefined? options.padding : 20,
      sizeModificator: options.sizeModificator !== undefined? options.sizeModificator : 1,

      stroke: options.stroke !== undefined? options.stroke : 1.4,
      strokeBG: options.stroke !== undefined? options.strokeBG : .2,
      strokeAlpha: options.strokeAlpha !== undefined? options.strokeAlpha : 1,
    };

    this.options = {
      color: this.optionsAbs.color,
      size: Metrics.parseSize(this.optionsAbs.size),
      position: this.optionsAbs.position,
      padding: Metrics.parseSize(this.optionsAbs.padding) + Metrics.parseSize(this.optionsAbs.stroke)/2,
      sizeModificator: this.optionsAbs.sizeModificator,
      stroke: Metrics.parseSize(this.optionsAbs.stroke),
      strokeBG: Metrics.parseSize(this.optionsAbs.strokeBG),
      strokeAlpha: this.optionsAbs.strokeAlpha,
    };

    this._indicator = new Loading__Indicator(this.options, Interface.ctx);
    this.color = this.options.color;
    this.color = this.options.color;
  }

  static start() {
    document.body.classList.add("__loading");
    this.start__effect();
  }

  static start__effect() {
    if(!this._indicator.enabled) {
      this._indicator.show();
    }
  }

  static stop() {
    document.body.classList.remove("__loading");
    this.stop__effect();
  }

  static stop__effect() {
    if(this._indicator.enabled) {
      this._indicator.hide();
    }
  }

  static loop() {
    if(this._indicator.enabled) {
      this._indicator.draw();
    }
  }

  static resize() {
    let x = 0;
    let y = 0;

    this.options.size = Metrics.parseSize(this.optionsAbs.size);
    this.options.padding = Metrics.parseSize(this.optionsAbs.padding) + Metrics.parseSize(this.optionsAbs.stroke) / 2;
    this.options.stroke = Metrics.parseSize(this.optionsAbs.stroke);
    this.options.strokeBG = Metrics.parseSize(this.optionsAbs.strokeBG);

    switch (this.options.position) {
      case Loading.POSITION_TOP_LEFT:
        x = this.options.size / 2 + this.options.padding;
        y = this.options.size / 2 + this.options.padding;
        break;
      case Loading.POSITION_TOP_RIGHT:
        x = Metrics.WIDTH - this.options.size / 2 - this.options.padding;
        y = this.options.size / 2 + this.options.padding;
        break;
      case Loading.POSITION_BOTTOM_LEFT:
        x = this.options.size / 2 + this.options.padding;
        y = Metrics.HEIGHT - this.options.size / 2 - this.options.padding;
        break;
      case Loading.POSITION_BOTTOM_RIGHT:
        x = Metrics.WIDTH - this.options.size / 2 - this.options.padding;
        y = Metrics.HEIGHT - this.options.size / 2 - this.options.padding;
        break;
      case Loading.POSITION_CENTER:
        x = Metrics.CENTER_X;
        y = Metrics.CENTER_Y;
        break;
    }

    this._indicator.setPosition(x, y);
  }
}

class Loading__Indicator extends Cursor__Item{
  enabled = false;
  _bg;
  _dot;
  _idTimer;
  _options;

  set color(__c) {
    if(this._dot) {
      this._dot.colorR = __c.r;
      this._dot.colorG = __c.g;
      this._dot.colorB = __c.b;
    }

    if(this._bg) {
      this._bg.colorR = __c.r;
      this._bg.colorG = __c.g;
      this._bg.colorB = __c.b;
    }
  }

  constructor(__options, __ctx) {
    super(__options.size, __ctx);
    this._options = __options;

    this._bg = new Cursor__Dot({size:this._options.size, alpha:0, stroke:0, strokeAlpha: 0}, __ctx);
    this._dot = new Cursor__DotComplex({size:this._options.size, alpha:0, stroke:0, strokeAlpha: 0}, __ctx);
    this._dot.angleStart = 0;
    this._dot.angleEnd = 0;
  }

  setPosition(__x, __y) {
    this._dot.x = __x;
    this._dot.y = __y;
    this._bg.x = __x;
    this._bg.y = __y;
  }

  show() {
    if(this._idTimer) {
      clearTimeout(this._idTimer);
    }

    this.enabled = true;
    this._dot.angleStart = 0;
    this._dot.angleEnd = 0;
    this._dot.stroke = this._options.stroke;

    this._idTimer = setTimeout(()=> {
      this._bg.stroke =
        this._dot.stroke = 0;

      this._bg.strokeAlpha =
        this._dot.strokeAlpha = 1;

      this._dot.size =
        this._bg.size = this._options.size * this._options.sizeModificator;

      TweenLite.to(this._bg, 1, {size: this._options.size, stroke: this._options.strokeBG, ease: Expo.easeOut});
      TweenLite.to(this._dot, 1, {size: this._options.size, stroke: this._options.stroke, ease: Expo.easeOut});
      TweenLite.to(this._dot, 10, {angleEnd: .9, ease: Linear.easeNone});
    },200);
  }

  hide() {
    if(this._idTimer) {
      clearTimeout(this._idTimer);
    }

    TweenLite.killTweensOf(this._dot);
    TweenLite.to(this._dot, .4, {angleEnd: 1, ease: Power4.easeOut});
    TweenLite.to(this._bg, 1, {size: this._options.size * this._options.sizeModificator, stroke:0, strokeAlpha:0, ease: Expo.easeInOut});
    TweenLite.to(this._dot, 1, {size: this._options.size * this._options.sizeModificator, stroke:0, strokeAlpha:0, ease: Expo.easeInOut});

    this._idTimer = setTimeout(()=>{
      this.enabled = false;
      this._idTimer = null;
      document.body.classList.remove("__loading");
    },1000);
  }

  draw() {
    this._dot.rotation += .1;
    this._dot.draw();
    this._bg.draw();
  }
}

