import CustomLoader from './CustomLoader';
import { Display } from '../display/Display';
import { C } from '../core/Element';

export default class MediaLoader extends CustomLoader{

  static NORMAL  = "normal";
  static BACKGROUND  = "bg";

  mode = "";
  data = [];
  maxLoads = 10;

  _manifest = [];
  _running = false;
  _activeLoads = 0;

  constructor () {
    super();

    this.id           = "MediaLoader";
    this.itemsLoaded  = 0;
    this.progress     = 0;
    this.errors       = 0;
    this.itemsTotal   = 0;

    this.getMedia();
  }

  getMedia(__all = false) {
    let tClass = this;
    const TYPE_MEDIA = __all? "data-item-load" : "data-item-preload";
    let item;

    C.forEach("[" + TYPE_MEDIA + "]", function(el, i) {
      switch (el.tagName.toUpperCase()) {
        case "IMG":
          item = new Display.image(el);
          break;

        case "VIDEO":
          item = new Display.video(el);
          break;

        default:
          item = new Display.bg(el);
          break;
      }

      tClass.add(item);
    }.bind(this));
  }

  add(__item) {
    this.itemsTotal =  this._manifest.push(__item);
  }

  init() {
    this.mode = MediaLoader.NORMAL;
    this.maxLoads = 10;

    if(this.itemsLoaded === this.itemsTotal)    {
      this.progress = 1;
      this.end();
    } else {
      this._running = true;

      while(this._activeLoads < this.maxLoads && this._manifest.length > 0) {
        this.next();
      }
    }
  }

  initBackground() {
    this.mode = MediaLoader.BACKGROUND;
    this.maxLoads = 2;

    this.reset();
    this.getMedia();
    this.getMedia(true);
    this.next();
  }

  cancel() {
    for(let i = 0, j=this._manifest.length; i<j; i++) {
      this._manifest[i].dispose();
    }
    for(let i = 0, j=this.data.length; i<j; i++) {
      this.data[i].dispose();
    }

    this.data = [];
  }

  end() {
    this._running = false;
    if(this.onComplete) this.onComplete(this.id);

    this.onFileLoaded = null;
    this.onProgress = null;
    this.onComplete = null;
  }

  reset() {
    this._activeLoads = 0;
    this.onFileLoaded = null;
    this.onProgress = null;
    this.onComplete = null;
    this.itemsTotal = 0;
    this.itemsLoaded = 0;
    this.progress = 0;
    this.errors = 0;
    this._manifest = [];
  }

  next() {
    if(this._activeLoads !== this.maxLoads) {
      if (this.itemsLoaded === this.itemsTotal) {
        this.end();
      } else if (this._manifest.length > 0) {
        var tClass = this;
        var _item = this._manifest.shift();

        this.data.push(_item);
        this._activeLoads++;

        _item.load(function () {
          tClass.itemLoaded();
        });
      }
    }
  }

  itemLoaded() {
    this.itemsLoaded++;
    this._activeLoads--;
    this.progress = this.itemsLoaded/this.itemsTotal;
    if(this.onProgress) this.onProgress();
    if(this.onFileLoaded) this.onFileLoaded();

    this.next();
  }

  doError(event) {
    this.errors  =   this.errors + 1;
    this.itemLoaded();
  }
}


