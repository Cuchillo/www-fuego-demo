import Win from './Window';
import { GetBy } from '../core/Element';
import { gsap, Power3 } from "gsap";

class Message extends Win {

  p;
  btn;
  _waiting;

  constructor(__container) {
    super(__container, "message");
    this.directHide();

    this.p = GetBy.selector("p", this.container)[0];
    this.btn = GetBy.selector("button", this.container)[0];
  }

  success(__text, __btn) {
    this.text(__text, "__success", __btn);
  }

  error(__text, __btn) {
    this.text(__text, "__error", __btn);
  }

  text(__text, __type, __btn) {

    if(this.isOpen) {
      this._waiting = {
        text: __text,
        btn: __btn,
        type: __type,
      }
    } else {
      this.p.textContent = __text;
      if(__btn) {
        this.btn.textContent = __textBTN;
      }
      if(__type) {
        this.container.classList.add(__type);
      }

      this.show();
    }
  }

  show__effect(__d = 0) {
    gsap.set(this.container,{y:this.container.offsetHeight, alpha:1});
    gsap.to(this.container,{y:0,duration:.4, ease:Power3.easeOut, onComplete:()=>{this.afterShow()}});
  }

  afterShow() {
    super.afterShow();
  }

  hide__effect(__d = 0) {
    gsap.to(this.container,{y:this.container.offsetHeight, duration:.4, ease:Power3.easeOut, onComplete:()=>{this.afterHide();}});
  }

  afterHide() {
    this.container.classList.remove("__success");
    this.container.classList.remove("__error");

    super.afterHide();

    if(this._waiting) {
      this.text(this._waiting.text, this._waiting.type, this._waiting.btn);
      this._waiting = null;
    }
  }

  directHide() {
    gsap.set(this.container,{y:this.container.offsetHeight, alpha:1});
    super.directHide();
  }

  resize() {
    super.resize();
  }
}

export const WinMessage = new Message(GetBy.id("Message"));

