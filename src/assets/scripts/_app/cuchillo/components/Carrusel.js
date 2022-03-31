class CarruselItem {
  _x;
  _y;
  _item;
  width;

  get x() { return this._x;  }
  set x(__n) {
    this._x = Maths.precission(__n,2);
    this._item.style[CSS.transform] = "translate3d(" + this._x + "px, 0, 1px)";
  }

  constructor(__item) {
    this._item = __item;
    this.x = 0;
    this.width = this._item.offsetWidth;
  }

  resize() {
    this.width = this._item.offsetWidth();
  }
}

class Carrusel {
  _itemMain;
  _itemAux;

  _multiplicator = 1;
  _x;
  _widthMask;
  _limit1;
  _limit0;
  _progress;

  fixedDirection = false;
  fixedScroll = false;
  velocidad = 1;
  minVel = 1;

  get multiplicator() {
    return this._multiplicator;
  }
  set multiplicator(__n) {
    this._multiplicator = __n;
    this.velocidad *= this._multiplicator;
  }

  get progress() {
    return this._progress;
  }
  set progress(__n) {
    this._progress = __n;
    this.offsetX = this._limit1 * __n;
  }

  set offsetX(__x) {

    this._itemMain.x = 0;
    this._itemAux.x = this._itemMain.x - this._itemAux.width;

    this._itemMain.x += __x;
    this._itemAux.x += __x;

    if(__x > 0) {
      if (this._itemMain.x > this._limit1) {
        this._itemMain.x = this._itemAux.x - this._itemMain.width;
        let temp = this._itemAux;
        this._itemAux = this._itemMain;
        this._itemMain = temp;
      }
    } else {
      if (this._itemAux.x < this._limit0) {
        this._itemAux.x = this._itemMain.x + this._itemMain.width;
        let temp = this._itemAux;
        this._itemAux = this._itemMain;
        this._itemMain = temp;
      }
    }
  }

  constructor(__w, __item1, __item2) {
    this._itemAux = new CarruselItem(__item2);
    this._itemMain = new CarruselItem(__item1);

    this._limit1 = __w;
    this._limit0 = -this._itemMain.width;

    this._itemAux.x = this._itemMain.x - this._itemAux.width;
  }

  loop() {

    if(this.fixedScroll) {
      this.velocidad = Basics.velocidad * this.multiplicator;
    } else {

      let vel;
      let temp = Basics.velocidad * this.multiplicator;

      if (this.fixedDirection) {
        vel = Math.max(this.minVel, Math.abs(temp));
      } else {
        if (temp > 0) {
          vel = Math.min(-this.minVel, -temp);
        } else if (temp < 0) {
          vel = Math.max(this.minVel, -temp);
        } else {
          vel = this.velocidad > 0 ? this.minVel : -this.minVel;
        }
      }

      this.velocidad += Maths.precission(((vel - this.velocidad) * 0.1), 2);
    }


    this._itemMain.x += this.velocidad;
    this._itemAux.x += this.velocidad;

    if(this.velocidad > 0) {
      if (this._itemMain.x > this._limit1) {
        this._itemMain.x = this._itemAux.x - this._itemMain.width;
        let temp = this._itemAux;
        this._itemAux = this._itemMain;
        this._itemMain = temp;
      }
    } else {
      if (this._itemAux.x < this._limit0) {
        this._itemAux.x = this._itemMain.x + this._itemMain.width;
        let temp = this._itemAux;
        this._itemAux = this._itemMain;
        this._itemMain = temp;
      }
    }
  }

  resize(__w) {
    this._limit1 = __w;

    this._itemMain.resize();
    this._itemAux.resize();

    this._itemMain.x = 0;
    this._itemAux.x = this._itemMain.x - this._itemAux.width;
  }

  dispose() {
    this._itemMain = null;
    this._itemAux = null;

    this.velocidad = null;
    this._multiplicator = null;
    this._x = null;
    this._widthMask = null;
    this._limit1 = null;
    this._limit0 = null;
  }
}