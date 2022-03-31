import { gsap, Power2 } from "gsap";
import { Metrics } from "../core/Metrics";
import { Scroll } from "../scroll/Scroll";

export default class BG {
  static colors;
  static container = document.body;
  static actualPalette = null;
  static actualColor = null;
  static actualKey = null;
  static time = .2;
  static ease = Power2.easeOut;
  static keys;
  
  static _positions = {
    actual: 0,
    positionNext: 0,
    positionPrev: 0,
  };
  static _changes = [];
  static _domPage;

  static init(__colors) {
    this.colors = __colors;
    this.keys = Object.keys(this.colors);
  }

  static initChanges(__container) {
    this._changes = [];
    this._domPage = __container? __container : this._domPage;

    if(this._domPage) {
      this.setupChanges();

      if(this._changes.length === 0) return;

      this._positions.actual = 0;
      this._positions.positionNext = this._changes[1].position;
      this._positions.positionPrev = this._changes[0].position;
    }

  
  }

  static setupChanges() {
    if(this._domPage) {
      [...this._domPage.querySelectorAll("[data-palette]")].map((item)=> {
        this._changes.push({position: item.offsetTop - Metrics.HEIGHT * .5, palette: item.getAttribute("data-palette")})
      });
    }
  }

  static loop() {
    if(this._changes.length === 0) return;
    if(
      (-Scroll.y > this._positions.positionNext && Scroll.direction === 1) ||
      (-Scroll.y < this._positions.positionPrev && Scroll.direction === -1)
      ) {
      
      const actual = Math.max(0, Math.min(this._changes.length - 1, this._positions.actual + Scroll.direction));
      const next = Math.min(this._changes.length - 1, actual + 1);
      const prev = actual;
        
      this._positions.actual = actual;
      this._positions.positionNext = this._changes[next].position;
      this._positions.positionPrev = this._changes[prev].position;
      
      this.changePalette(this._changes[actual].palette, null, .4);
    }
  }

  static resize() {
    this._changes = [];
    this.setupChanges();
  }

  static nextPalette() {
    const actualIndex = this.keys.indexOf(this.actualKey);
    const newKey = actualIndex + 1 === this.keys.length? this.keys[0] : this.keys[actualIndex + 1];
    this.changePalette(newKey);
  }

  static changePaletteDirect(__color, __call = null) {
    this.changePalette(__color, __call, 0);
  }

  static changePalette(__color, __call = null, __time = BG.time, __ease = null) {
    this.actualKey = __color;
    const color = this.colors[__color];  

    if(__color && this.actualPalette !== color.str) {
      if (this.actualPalette !== null) {
        document.body.classList.remove(this.actualPalette);
      }

      this.actualPalette = color.str;
      document.body.classList.add(this.actualPalette);

      this.changeBG(color.css, __call, __time, __ease);
    } else if(__call) {
       __call();
    }
  }

  static changeBG(__color, __call = null, __time = BG.time, __ease = BG.ease) {
    if(this.actualColor === __color) {
      if(__call) __call();
      return;
    }

    this.actualColor = __color;

    if(__time === 0) {
      gsap.set(this.container,{backgroundColor:__color});
      if(__call) __call();
    } else {
      gsap.to(this.container, {backgroundColor:__color, duration:__time, ease: __ease, onComplete:()=>{if(__call) __call();}});
    }
  }
}