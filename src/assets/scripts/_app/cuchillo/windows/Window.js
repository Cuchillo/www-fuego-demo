import EventDispatcher from '../core/EventDispatcher';
import { ControllerWindow } from './ControllerWindow';
import { Accessibility } from '../core/Accessibility';
import { Keyboard } from '../core/Keyboard';

export default class Win {

  static ON_SHOW = "onshow";
  static ON_SHOW_END = "onshowend";
  static ON_HIDE = "onhide";
  static ON_HIDE_END = "onhideend";

  static STATE_OPEN = "OPEN";
  static STATE_CLOSE = "CLOSE";

  container;
  id;
  width;
  height;
  _state;
  _btnClose;

//==================================================================================================================
//          GETTER SETTER
//==================================================================================================================

  get isOpen() { return this._state === Win.STATE_OPEN; }
  get state() { return this._state };
  set state(__state) {
    if(this._state === __state) return;

    this._state = __state;

    if(this.isOpen) {
      Keyboard.add("Escape", this.id + "_ESC", () => { this.hide(); });
      Accessibility.trap(this.container);
      EventDispatcher.dispatchEvent(Win.ON_SHOW);
    } else {
      Keyboard.remove("Escape", this.id + "_ESC");
      Accessibility.removeTrap();
      EventDispatcher.dispatchEvent(Win.ON_HIDE);
    }
  }

//==================================================================================================================
//          CONSTRUCTOR
//==================================================================================================================

  constructor(__container, __id) {
    this.id = __id;
    this.container = __container;
    this.container.setAttribute("aria-expanded", "false");

    this.resize();

    ControllerWindow.registerWindow(this.id, this);
  }

//==================================================================================================================
//          PUBLIC
//==================================================================================================================

  actionButtonToggle(item) {
    if(item.classList.contains("__close")) {
      item.classList.remove("__close");
    } else {
      item.classList.add("__close");
    }

    if(!this.isOpen) this._btnClose = item;

    this.toogleState();
  }

  toogleState() {
    if(!this.isOpen)    this.show();
    else                this.hide();
  }

  //SHOW
  show(__d = 0) {
    this.container.style.visibility = "visible";
    this.container.setAttribute("aria-expanded", "true");
    this.state = Win.STATE_OPEN;
    this.show__effect();
  }

  show__effect(__d = 0) {
    this.afterShow();
  }

  afterShow() {
    EventDispatcher.dispatchEvent(Win.ON_SHOW_END);
  }

  //HIDE
  hide(__d = 0) {
    if(this._btnClose) this._btnClose.classList.remove("__close");

    this.state = Win.STATE_CLOSE;
    this.hide__effect();
  }

  hide__effect(__d = 0) {
    this.afterHide();
  }

  afterHide() {
    this.container.style.visibility = "hidden";
    this.container.setAttribute("aria-expanded", "false");
    EventDispatcher.dispatchEvent(Win.ON_HIDE_END);
  }

  directHide() {
    this._state = Win.STATE_CLOSE;
    this.afterHide();
  }

  loop() {}
  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
  }
}


