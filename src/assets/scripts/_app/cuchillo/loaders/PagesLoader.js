import CustomLoader from './CustomLoader';
import { C } from '../core/Element';
import { Functions } from '../utils/Functions';

class PageData {
  id;
  url;
  title;
  page;
}

export default class PagesLoader extends CustomLoader {

  static NORMAL  = "normal";
  static BACKGOUND  = "bg";

  mode = "normal";
  data = [];

  _XHR;
  _manifest = [];
  _running = false;

//==================================================================================================================
//          CONSTRUCTOR
//==================================================================================================================

  constructor () {
    super();

    this.id           = "PagesLoader";
    this.itemsLoaded  = 0;
    this.progress     = 0;
    this.errors       = 0;
    this.itemsTotal   = 0;

    this.getLinks();
  }

  getLinks() {
    var tClass = this;
    let typeMedia = this.mode === PagesLoader.NORMAL ? "data-link-preload" : "data-link-load";

    C.forEach("[" + typeMedia + "]", function(el, i) {
      let href = el.getAttribute("href");

      if(tClass.getData(href)==null) {
        tClass.itemsTotal = tClass._manifest.push({
          id: Functions.url2Id(href),
          url: href,
          page: null,
          title: ""
        })
      }
    }.bind(this));
  }

  init() {
    this.mode = PagesLoader.NORMAL;

    if(this.itemsLoaded === this.itemsTotal)    {
      this.progress = 1;
      this.end();
    } else {
      this._running = true;
      this._next();
    }
  }

  initBackground() {
    this.mode = PagesLoader.BACKGOUND;

    this.reset();
    this.getLinks();
    this.init();
  }

  loadPage(__url, __callback) {
    var __id = Functions.url2Id(__url);

    this.cancel();
    this.reset();
    this.onFileLoaded = __callback;
    this.itemsTotal = this._manifest.push({id:__id, url:__url, page:null, title:""});
    this.init();
  }

  cancel() {
    if(this._XHR) this._XHR.abort();
  }

  reset() {
    this.onFileLoaded = null;
    this.onProgress = null;
    this.onComplete = null;
    this.itemsTotal = 0;
    this.itemsLoaded = 0;
    this.progress = 0;
    this.errors = 0;
    this._manifest = [];
    //$(".__remove-preload-image").remove();
  }

  end() {
    this._running = false;
    if(this.onComplete) this.onComplete(this.id);

    this.onFileLoaded = null;
    this.onProgress = null;
    this.onComplete = null;
  }

  dispose() {
    this.onFileLoaded = null;
    this.onProgress = null;
    this.onComplete = null;
    this.itemsTotal = null;
    this.itemsLoaded = null;
    this.progress = null;
    this.errors = null;
  }

//==================================================================================================================
//          PRIVATE
//==================================================================================================================

  _next() {
    if(this.itemsLoaded === this.itemsTotal)    {
      this.end();
    } else {
      this._load(this._manifest[0].id, this._manifest[0].url)
    }
  }



  _load(__id, __url) {
    var tClass = this;

    this._XHR = new XMLHttpRequest();
    this._XHR.open('GET', __url, true);

    this._XHR.onload = function() {
      if (tClass._XHR.status >= 200 && tClass._XHR.status < 400) {
        //var data = tClass._XHR.responseText;//.split("<!doctype html>")[1];
        //let parser = new DOMParser();
        //let xmlDoc = parser.parseFromString(data,"text/html");

        tClass._manifest[0].page = tClass._XHR.responseText;//xmlDoc.documentElement.getElementsByClassName("wrap")[0];
        let _p = tClass._manifest.shift();

        tClass.data.push(_p);
        tClass._pageLoaded(_p);
      } else {
        console.log("ERROR");
      }
    };

    this._XHR.onerror = function() {
      console.log("onerror");
    };

    this._XHR.send();
  }

  _pageLoaded(__p) {
    this.itemsLoaded++;
    this.progress = this.itemsLoaded/this.itemsTotal;
    if(this.onProgress) this.onProgress();
    if(this.onFileLoaded) this.onFileLoaded(__p);

    this._next();
  }

  _loadAssets(__assets, __index) {
    /*if(__assets.length > 0) {
        var tClass = this;
        $("<img class='__remove-preload-image'/>").appendTo($("body"))
            .css("display", "none")
            .attr("src", $(__assets[0]).attr("data-src")).on('load', function () {
                //tClass.data[__index].page = tClass.data[__index].page.split("data-item-preload").join("MIERDA")
                $(this).remove();
            });
    }*/
  }

  // An error happened on a file
  _doError(event) {
    this.errors  =   this.errors + 1;
  }

  getData(__url) {
    let _id = Functions.url2Id(__url);

    for(let i = 0, j=this.data.length; i<j; i++) {

      if(this.data[i].id === _id) {
        return this.data[i];
      }
    }

    return null;
  }

}



