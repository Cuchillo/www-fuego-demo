const virtualScroll = require('../../vendor/VirtualScroll')

export default class WheelControls {
  _enabled = false;
  _isPosible = false;
  _oldDelta = 0;
  _idTimer;
  scroller;
  options;
  direction;
  _call;

  get enabled() { return this._enabled; }
  set enabled(__enabled) {
    if(this._enabled !== __enabled) {
      this._enabled = __enabled;
      this._isPosible = __enabled;

      if(this._enabled) {
        this.scroller.on(this._call);
      } else {
        this.scroller.off(this._call);
      }
    }
  }

  constructor(options = {}) {
    this.scroller = new virtualScroll();
    this.options = {
      onMove: options.onMove || null,
      onBackward: options.onBackward || null,
      onForward: options.onForward || null,
      timeToActive: options.timeToActive === undefined? 200 : options.timeToActive,
    };

    this._call = (e) => {
      this._check(e);
    }
  }

  _isSpeedPossible(__delta) {
    if(this.direction < 0) {
      if(__delta > this._oldDelta) {
        return true;
      }
    } else if(this.direction > 0) {
      if(__delta < this._oldDelta) {
        return true;
      }
    }

    return false;
  }

  _check(e) {
    const keyMod = e.isKey? -1 : 1;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY)? e.deltaX * keyMod : e.deltaY;
    let newDirection = delta < 0 ? 1 : -1;

    if (e.isKey || this.direction !== newDirection || this._isSpeedPossible(delta) || !this.options.timeToActive) {
      this.direction = newDirection;

      if (this.options.onMove && this._isPosible) {
        this.options.onMove(this.direction,delta);
      }

      if (this.options.onForward && this.direction === 1 && this._isPosible) {
        this.options.onForward(delta);
      }

      if (this.options.onBackward && this.direction === -1 && this._isPosible) {
        this.options.onBackward(delta);
      }

      if(this.options.timeToActive) {
        this._isPosible = false;
        clearTimeout(this._idTimer);
        this._idTimer = setTimeout(() => {
          this._isPosible = true;
        }, this.options.timeToActive);
      }
    }

    this._oldDelta = delta;
  }

  dispose() {
    this.enabled = false;
    this.scroller.destroy();
    this.options = {};
  }
};
