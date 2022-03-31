import {Sizes} from "assets/scripts/_app/cuchillo/core/Sizes";

export default class MediaObject {

    static TYPE_BG = "BG";
    static TYPE_IMG = "IMG";

    _type;
    id;
    item;
    sizes;
    isLoaded = false;
    width;
    height;
    isImportant = false;
    isStatic = false;

//==================================================================================================================
//          GETTER SETTER
//==================================================================================================================

    get src() {
      return this.sizes[this.size];
    }

    get size() {
        let __size = Math.min(this.sizes.length, Math.floor((this.item.offsetWidth * Sizes.RATIO)/this.width * .85));
        return __size > 1? __size-1 : 0;
    }

    get type() {
        return this._type;
    }

//==================================================================================================================
//          CONSTRUCTOR
//==================================================================================================================

    constructor(__item, __type = MediaObject.TYPE_IMG) {
        this.item  =   __item;
        this.id = __item.getAttribute("id");
        this._type = __type;

        this.isImportant = this.item.getAttribute("data-item-preload") !== undefined;
        this.isStatic = this.item.getAttribute("data-item-static") !== undefined;
        this.sizes = this.item.getAttribute("data-src").split(",");

        if(this.item.getAttribute("data-mobile-src")) {
          this.width = this.item.getAttribute("data-mobile-width")? Number(this.item.getAttribute("data-mobile-width")) : Number(this.item.getAttribute("width"));
          this.height = this.item.getAttribute("data-mobile-height")? Number(this.item.getAttribute("data-mobile-height")) : Number(this.item.getAttribute("height"));
        } else {
          this.width = this.item.getAttribute("data-width")? Number(this.item.getAttribute("data-width")) : Number(this.item.getAttribute("width"));
          this.height = this.item.getAttribute("data-height")? Number(this.item.getAttribute("data-height")) : Number(this.item.getAttribute("height"));
        }

        this.item.setAttribute("data-item-loaded", "");
        this.item.removeAttribute("data-item-preload");
        this.item.removeAttribute("data-item-load");
    }

//==================================================================================================================
//          PUBLIC
//==================================================================================================================

    load(__callback = null) {
        if(__callback!=null)
          __callback();
    }

    setup(__callback = null) {
        this.isLoaded = true;
        this.item.removeAttribute("data-item-preload");
        this.item.removeAttribute("data-item-load");
        this.item.removeAttribute("data-src");

        if(__callback)  __callback();
    }

    dispose() {}
        show() {
        this.afterShow();
    }

    afterShow() {
        if(this.item) {
            this.item.parentNode.classList.remove("__load_indicator");
        }
    }
}


