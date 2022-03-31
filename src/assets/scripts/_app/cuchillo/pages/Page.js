import LoaderController from '../loaders/LoaderController';
import { GetBy, C } from '../core/Element';
import { Metrics } from '../core/Metrics';
import { ControllerPage } from './ControllerPage';
import EventDispatcher from '../core/EventDispatcher';
import BG from '../layout/Background';
import { ControllerWindow } from '../windows/ControllerWindow';
import _Wrap from '../layout/Wrap';

export default class Page {
  static ON_ACTIVATE = "page_activate";
  static ON_SHOW = "page_show";
  static ON_HIDE = "page_hide";
  static ON_HIDE_END = "page_hide_end";

  _disposes = [];
  _resizes = [];
  _loops = [];

  _nDisposes;
  _nResizes;
  _nLoops;

  _isHide = false;
  _isActive = false;

  _bodyClass;

  id;
  wrap;
  container;
  color;
  isFirstTime = false;
  isWrapAutoRemove = true;

//==================================================================================================================
//          CONSTRUCTOR
//==================================================================================================================

  constructor() {
    this.id = "__" + new Date().getTime();

    this.wrap = GetBy.class("wrap")[0];
    this.container = GetBy.selector('[data-page]')[0];
    this.color = this.container.getAttribute("data-palette");
    this.container.removeAttribute("data-page");
    this._bodyClass = this.container.getAttribute("data-body-class");
    if(this._bodyClass) document.body.classList.add(this._bodyClass);

    this._setupColor();
    this._setupComponents();
  }

//==================================================================================================================
//          PRIVATE
//==================================================================================================================

  _setupColor() {
    if(ControllerPage.firsTime) {
      BG.changePaletteDirect(this.color);
    }
  }

  _setupComponents() {
    ControllerWindow.init();
  }

  _load(__firstTime = false) {
    this.isFirstTime = __firstTime;
    if(!__firstTime && LoaderController._loaders.MediaLoader) {
      LoaderController.onComplete = () => { this._contentLoaded(); };
      LoaderController._loaders.MediaLoader.getMedia();
      LoaderController.init(false);
    } else {
      this._contentLoaded();
    }
  }

  _contentLoaded() {
    if(LoaderController._loaders.PagesLoader) LoaderController._loaders.PagesLoader.initBackground();
    if(LoaderController._loaders.MediaLoader) LoaderController._loaders.MediaLoader.initBackground();
    if(LoaderController._loaders.LazyLoader) LoaderController._loaders.LazyLoader.initBackground();
    this._activate();
  }

  _activate() {
    EventDispatcher.dispatchEvent(Page.ON_ACTIVATE);

    C.forEach(".__language", function(element, i) {
      element.setAttribute("href", GetBy.id("__langURL").getAttribute("value"));
    });

    Metrics.update();
    ControllerPage.disposeOut();

    this.beforeShow();
    /*if(Preloader.enabled) {
      Preloader.hide(() => { this._show(); });
    } else {*/
      this._show();
    //}
  }

  _show() {
    EventDispatcher.dispatchEvent(Page.ON_SHOW);
    requestAnimationFrame(() => {
      BG.changePalette(this.color, ()=> { this.show__effect() });
    });
  }

  _hide() {
    EventDispatcher.dispatchEvent(Page.ON_HIDE);

    this._isHide = true;
    this.wrap.classList.add("wrap-out");
    this.wrap.classList.remove("wrap");

    this.beforeHide();

    this.beforeHide__effect(()=> {
      if(this._bodyClass) document.body.classList.remove(this._bodyClass);

      /*if(Preloader.enabled) {
        Preloader.show(() => { this.hide__effect(); });
      } else {*/
        this.hide__effect();
     // }
    });
  }


  _dispose() {
    for(var i = 0,j=this._nDisposes; i<j; i++) {
      this._disposes[i]();
    }

    this._disposes = [];
    this._resizes = [];
    this._loops = [];
  }


  //SHOW
  beforeShow() {}
  show__effect() {
    _Wrap.show();
    this.container.style.opacity = 1;
    this.afterShow();
  }

  afterShow() {
    this._isActive = true;
  }

  //HIDE
  beforeHide() {
    ControllerWindow.hideAll();
  }
  beforeHide__effect(__call) {
    __call();
  }

  hide__effect() {
    this.container.style.opacity = 0;
    this.afterHide();
  }

  afterHide() {
    this._isHide = true;
    if(this.isWrapAutoRemove) this.removeWrap();

    LoaderController.reset();
    EventDispatcher.dispatchEvent(Page.ON_HIDE_END);

    ControllerPage._loadPage();
  }

  removeWrap() {
    this.wrap.parentNode.removeChild(this.wrap);
  }

  //LOOP
  addLoop(call) {
    this._nLoops = this._loops.push(call);
  }

  loop() {
    if(!this._isHide) {
      for (var i = 0; i < this._nLoops; i++) {
        this._loops[i]();
      }
    }
  }

  //RESIZE
  addResize(call) {
    this._nResizes = this._resizes.push(call);
  }
  resize() {
    if(!this._isHide) {
      for (var i = 0; i < this._nResizes; i++) {
        this._resizes[i]();
      }
    }
  }

  addDispose(call) {
    this._nDisposes = this._disposes.push(call);
  }
}
