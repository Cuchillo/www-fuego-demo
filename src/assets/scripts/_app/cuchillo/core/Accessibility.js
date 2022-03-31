import { GetBy } from './Element';
import { gsap } from "gsap";

const Accessibility = {
  _spark: GetBy.class("focus-spark")[0],
  _selector: "__accessible",
  _idTimer: null,
  _time: 80000,
  isTrap: false,
  isAuto: false,
  isEnable: false,

  lastFocusableEl:null,
  firstFocusableEl:null,

  init: function (__time = 2000) {
    this._time = __time;
    this._callDisable = this.disable.bind(this);
    this.disable();
    this.addCheck();
  },

  enable: function() {
    if(!Accessibility.isEnable) {
      Accessibility.isEnable = true;
      document.body.classList.add(Accessibility._selector);
      document.addEventListener('mousedown', Accessibility.disable);

      if(Accessibility.isAuto) {
        Accessibility._idTimer = setTimeout(Accessibility.disable, Accessibility._time);
      }
    }
  },

  disable: function() {
    document.body.classList.remove(Accessibility._selector);
    document.removeEventListener('mousedown', Accessibility.disable);
    Accessibility._idTimer = null;
    Accessibility.isEnable = false;
  },

  addCheck: function() {
    document.addEventListener('keydown', (e) => {
      const isTab = (e.key === 'Tab' || e.keyCode === 9);
      if (isTab) {

        //TIMER
        if (this._idTimer) {
          clearTimeout(this._idTimer);
          this._idTimer = null;
        }

        //IS TRAP
        if(this.isTrap) {
          if ( e.shiftKey ) /* shift + tab */ {
            if (document.activeElement === this.firstFocusableEl) {
              this.lastFocusableEl.focus();
              e.preventDefault();
            }
          } else /* tab */ {
            if(this.isTrapFirst) {
              this.isTrapFirst = false;
              this.firstFocusableEl.focus();
              e.preventDefault();
            } else {
              if (document.activeElement === this.lastFocusableEl) {
                this.firstFocusableEl.focus();
                e.preventDefault();
              }
            }
          }
        }

        //ENABLE ACCESSIBILITY
        this.enable();

        //DRAW CIRCLE
        /*setTimeout(() => {
          TweenLite.killTweensOf(this._spark);

          const rect = document.activeElement.getBoundingClientRect();
          const size = Math.min(100, Math.max(rect.width, rect.height));

          this._spark.style.opacity = "1";
          this._spark.style.width = size + "px";
          this._spark.style.height = size + "px";
          TweenLite.set(this._spark, {
            alpha: 1,
            x: Number(rect.left + (rect.width - size) / 2),
            y: Number(rect.top + (rect.height - size) / 2),
            scaleX: 1,
            scaleY: 1,
            ease: Quad.easeOut,
            force3D: true
          });
          TweenLite.to(this._spark, 1, {alpha: 0, scaleX: 3, scaleY: 3, ease: Quad.easeOut, force3D: true});
        }, 100);*/
      }
    });
  },

  trap: function(element, _first = null, _last = null) {
    this.isTrap = true;
    this.isTrapFirst = !this.isEnable;
    let focusableEls = element.querySelectorAll('a[href]:not([disabled]):not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), input[type="text"]:not([disabled]):not([tabindex="-1"]), input[type="radio"]:not([disabled]):not([tabindex="-1"]), input[type="checkbox"]:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"])');
    this.firstFocusableEl = _first ? _first : focusableEls[0];
    this.lastFocusableEl = _last ? _first : focusableEls[focusableEls.length - 1];
    if(this.firstFocusableEl) this.firstFocusableEl.focus();
  },

  removeTrap: function() {
    this.isTrap = false;
    this.isTrapFirst = false;
    this.firstFocusableEl = null;
    this.lastFocusableEl = null;
  }
};

export { Accessibility }
