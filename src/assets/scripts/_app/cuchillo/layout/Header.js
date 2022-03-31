import { isTouch } from '../core/Basics';
import { GetBy } from '../core/Element';
import EventDispatcher from '../core/EventDispatcher';
import { gsap, Power3 } from 'gsap';
import { Scroll } from '../scroll/Scroll';

export default class _Header {
  static container = GetBy.id("Header");

  static ON_SHOW = "HEADERSHOW";
  static ON_HIDE = "HEADERHIDE";
  static isShow = true;
  static isShowing = true;
  static isFixed = false;
  static showOnBack = true;
  static hasBG = false;

  static _y = 0;
  static oldY = 0;
  static height;
  static yOffset = 0;

  static _idTimerBG = 0;

  static options = {
    show: {
      duration: .6,
      delay: 0,
      ease: Power3.easeOut
    },
    hide: {
      duration: .3,
      delay: 0,
      ease: Power3.easeIn
    }
  }

  static get y () { return this._y; }
  static set y (__y) {
    this._y = Math.max(-this.height, __y);
    document.body.style.setProperty('--y-header', `${this.y}px`);
  }

  static init () {
    this.height = this.container.offsetHeight + this.yOffset;
  }

  static directShow () {
    this.isShow = true;
    this.y = 0;
  }

  static show () {
    if (!this.isShow) {
      this.isShow = true;
      this.show__effect();
    }
  }

  static show__effect () {
    EventDispatcher.dispatchEvent(_Header.ON_SHOW);

    gsap.to(this, {
      y: 0,
      duration: this.options.show.duration,
      delay: this.options.show.delay,
      ease: this.options.show.duration.ease,
      onComplete: () => {
        this.isShowing = false;
      }
    });
  }

  static directHide () {
    this.isShow = false;
    this.y = -this.height;
  }

  static hide () {
    if (this.isShow) {
      this.isShow = false;
      this.hide__effect();
    }
  }

  static hide__effect () {
    EventDispatcher.dispatchEvent(_Header.ON_HIDE);
    gsap.to(this,
      {
        y: -this.height,
        duration: this.options.hide.duration,
        delay: this.options.hide.delay,
        ease: this.options.hide.duration.ease,
        onComplete: () => {
          this.isShowing = false;
        }
      });
  }

  static showBG (__class = "--with-bg", __delay = 0) {
    this.hasBG = true;
    if (this._idTimerBG) clearTimeout(this._idTimerBG);

    this._idTimerBG = setTimeout(() => { this.container.classList.add(__class) }, __delay)
  }

  static hideBG (__class = "--with-bg", __delay = 0) {
    this.hasBG = false;
    if (this._idTimerBG) clearTimeout(this._idTimerBG);

    this._idTimerBG = setTimeout(() => { this.container.classList.remove(__class) }, __delay)
  }

  static resize () {
    this.height = this.container.offsetHeight + this.yOffset;
  }

  static loop () {
    if (Scroll.isScrolling && !this.isFixed) {
      const DELTA = Scroll.y - this.oldY;
      const POS_Y = Math.min(0, Math.max(-this.height, this.y + DELTA));

      if (Scroll.direction === -1 && !this.isShow) {
        this.show();
      } else if (Scroll.direction === 1) {
        this.isShow = false;
        if (this.isShowing) {
          gsap.killTweensOf(this);
        }

        if (Scroll.y <= 0) this.y = POS_Y;

        if (POS_Y === -this.height && !this.hasBG) {
          this.showBG();
        }
      }

      if (Scroll.y >= -10 && this.hasBG) {
        this.hideBG();
      }

      this.oldY = Scroll.y;
    } else if (Scroll.isScrolling && this.isFixed) {
      if (Scroll.y < -this.height && !this.hasBG) {
        this.showBG();
      } else if (Scroll.y > -this.height && this.hasBG) {
        this.hideBG();
      }
    }
  }
}
