import Page from './Page';
import { GetBy } from '../core/Element';
import LoaderController from '../loaders/LoaderController';
import { Analytics } from '../core/Analytics';
import { ControllerWindow } from '../windows/ControllerWindow';
import { Scroll } from '../scroll/Scroll';


export const ControllerPage = {
  host: new URL(window.location).host,
  container:null,
  loader:null,
  page:null,
  pageOut:null,
  state:0, //ALL OK 1: RUNNING 2:WAITING FOR NEXT
  firsTime:true,
  userAction:false,
  _directHref:"",
  _selector:"",
  _historyType:false,
  _waitingData:null,
  _preloadHref:false,
  _cont:0,
  dataStates:[],
  pageClasses:{},


  init: function(__container) {
    this.container = __container;
    this._loader = LoaderController._loaders.PagesLoader;

    window.onpopstate = () => { this.popState(); };

    setTimeout(()=>{
      this.pushState({scrollX:window.pageXOffset, scrollY:window.pageYOffset}, null, window.location.href);
      this._continueLoad();
    },100);
  },

  _addPage: function(__id, __class) {
    this.pageClasses[__id] = __class;
  },

  enable_ESC_Mode(__isON = true) {
    if(__isON) {
      Keyboard.remove("Escape", "Page_ESC");
      Keyboard.add("Escape", "Page_ESC", () => { this.back(); });
    } else {
      Keyboard.remove("Escape", "Page_ESC");
    }
  },

  back(__safeURL = null) {
    if(ControllerPage.dataStates.length > 1) {
      history.back();
    } else if(__safeURL) {
      this.changePage(__safeURL);
    } else {
      this.changePage(GetBy.id("BackLINK").value);
    }
  },

  popState() {
    this._cont--;
    this.dataStates.pop();
    this._hidePage();
  },

  pushState(__data, __title, __url) {
    this._cont++;
    this.dataStates.push({data:__data, title:__title, url:__url});
    history.pushState(__data, __title, __url);
  },

  replaceState(__data, __title, __url) {
    this.dataStates[this.dataStates.length - 1] = {data:__data, title:__title, url:__url};
    history.replaceState(__data, __title, __url);
  },

  changePage: function(__href = "", __historyType = "push", __selector = "main", __section = null) {
    if(__href === ControllerPage._directHref) {
      this.state = 0;
    } else {
      if (this.state === 0) {
        this.state = 1;
        this.userAction = true;
        this._directHref = __href;
        this._historyType = __historyType;
        this._selector = __selector;

        if(this._historyType === "push") {
          history.replaceState({scrollX: -Scroll.x, scrollY: -Scroll.y}, null, window.location.href);
          if(this.dataStates[this.dataStates.length - 1]) this.dataStates[this.dataStates.length - 1].data = {scrollX: -Scroll.x, scrollY: -Scroll.y}

          ControllerPage.pushState({scrollX: 0, scrollY: 0, section: __section}, null, this._directHref);
        } else {
          ControllerPage.replaceState({scrollX: 0, scrollY: 0, section: __section}, null, this._directHref);
        }

        this._hidePage();

      } else {
        this.state = 2;
        this._waitingData = {_directHref: __href, _historyType: __historyType, _selector: __selector, _section: __section}
      }
    }
  },

  disposeOut: function() {
    if(this.pageOut!= null) {
      this.pageOut._dispose();
      this.pageOut = null;

      if (this.state < 2) {
        this.state = 0;
      } else {
        this.state = 0;
        this.changePage(
          this._waitingData._directHref,
          this._waitingData._historyType,
          this._waitingData._selector,
          this._waitingData._section
        );
      }
    }
  },

  _hidePage: function() {
      if (this.firsTime)  this._loadPage();
      else {
        if(this.page) {
          this.page._hide();
        }
      }
  },

  preloadPage: function(__href) {
    if(!ControllerPage._loader.getData(__href) && ControllerPage._preloadHref !== __href) {
      ControllerPage._preloadHref = __href;
      ControllerPage._loader.loadPage(ControllerPage._preloadHref, function () {
        ControllerPage._preloadHref = null
      });
    }
  },

  _loadPage: function() {
    this.pageOut = this.page;
    this.page = null;

    if(this.firsTime) {
      this.continueLoad();
    } else {
      this._directHref = window.location.href; //Utils.UrlManager.url;
      let _p = ControllerPage._loader.getData(ControllerPage._directHref);

      if(_p!=null) {
        const dataPage = ControllerPage._parsePage(_p.page);
        document.title = dataPage.title;
        this.container.insertBefore(dataPage.page, this.container.firstChild);
        ControllerPage._continueLoad();

        Analytics.sendUrl(ControllerPage._directHref, dataPage.title);
      } else {
        const pageLoaded = (__data) => {
          const dataPage = ControllerPage._parsePage(__data.page);

          ControllerPage.container.insertBefore(dataPage.page, ControllerPage.container.firstChild);
          document.title = dataPage.title;
          ControllerPage._preloadHref = null;
          ControllerPage._continueLoad();

          Analytics.sendUrl(ControllerPage._directHref, dataPage.title);
        };

        if(ControllerPage._preloadHref === ControllerPage._directHref) {
          ControllerPage.onFileLoaded = pageLoaded;
        } else {
          ControllerPage._loader.loadPage(ControllerPage._directHref, pageLoaded)
        }
      }
    }
  },

  _parsePage: function(__page) {
    var data = __page;
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(data,"text/html");

    return {
      title: GetBy.selector("title", xmlDoc.documentElement)[0].innerText,
      page: xmlDoc.documentElement.getElementsByClassName("wrap")[0]
    };
  },

  _continueLoad: function() {
    this.page = ControllerPage.getTypePage();
    this.page._load(ControllerPage.firsTime);
    this.firsTime = false;
  },

  //PAGES
  getTypePage: function() {
    const pageId = GetBy.selector('[data-page]')[0].getAttribute("data-page"); 
    const page = this.pageClasses[pageId] || Page;
    
    if(!this.pageClasses[pageId]) {
      console.warn(`data-page [${pageId}] no existe, posiblemente no hayas hecho el import`);
    }

    return new page();
  },

  loop: function() {
    if(ControllerPage.pageOut) ControllerPage.pageOut.loop();
    if(ControllerPage.page) ControllerPage.page.loop();
  },

  resize: function() {
    if(ControllerPage.page) ControllerPage.page.resize();
  },

  isUrlSameHost: function(__hrefURL) {
    return (__hrefURL.startsWith("/") || new URL(__hrefURL).host === this.host);
  }
};
