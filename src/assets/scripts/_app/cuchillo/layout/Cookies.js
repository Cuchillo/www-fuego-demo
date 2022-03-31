import { GetBy } from '../core/Element';
import { Keyboard } from '../core/Keyboard';
import { Basics } from '../core/Basics';
import { Accessibility } from '../core/Accessibility';
import { Analytics } from '../core/Analytics';

export default class _Cookies {
  static STATE_OPEN = "OPEN";
  static STATE_CLOSE = "CLOSE";
  static container = GetBy.id("Cookies");
  static _state = "CLOSE";

//==================================================================================================================
//          GETTER SETTER
//==================================================================================================================

  static get isOpen() { return this._state === _Cookies.STATE_OPEN; }

//==================================================================================================================
//          CONSTRUCTOR
//==================================================================================================================

  static init() {
    this.container.setAttribute("aria-expanded", "false");

    if(Basics.hasCookies) {
      if (document.cookie.indexOf(Basics.id + "_cookie_policy") < 0) {
        this.setup();
        this.show();
      } else {
        Analytics.init();
        this.dispose();
      }
    } else {
      this.dispose();
    }
  }

  static setup() {
    Accessibility.trap(this.container);
    Keyboard.add("Escape", "CookiesESC", () => { _Cookies.hide(); });

    GetBy.selector('[data-ok]', this.container)[0].addEventListener(Basics.clickEvent, (e) => { this.ok() }, {once : true});
    GetBy.selector('[data-cancel]', this.container)[0].addEventListener(Basics.clickEvent, (e) => { this.cancel() }, {once : true});
  }

  static ok(item) {
    var now = new Date();
    var time = now.getTime();
    var expireTime = time + 999999999999;
    now.setTime(expireTime);
    document.cookie = Basics.id + "_cookie_policy=accepted; expires="+now.toUTCString() +"; path=/";
    Analytics.init();
    this.hide();
  }

  static cancel(item) {
    this.hide();
  }

  //SHOW
  static show(__d = 0) {
    this._state = Cookies.STATE_OPEN;
    this.container.setAttribute("aria-expanded", "true");
    this.show__effect();
  }

  static show__effect(__d = 0) {
    this.container.style.opacity = 1;
  }

  //HIDE
  static hide(__d = 0) {
    this._state = _Cookies.STATE_CLOSE;
    this.hide__effect();
  }

  static hide__effect(__d = 0) {
    this.container.style.display = "none";
    this.dispose();
  }

  static dispose() {
    Accessibility.removeTrap();
    this.container.setAttribute("aria-expanded", "false");
    Keyboard.remove("Escape", "CookiesESC");
    this.container.parentNode.removeChild(this.container);

    if(document.body.classList.contains("__accessible")) {
      GetBy.tag("a", GetBy.id("Gotomain"))[0].focus();
    }
  }
}
