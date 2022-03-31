class LazyLoader extends CustomLoader{

    static NORMAL  = "normal";
    static BACKGROUND  = "bg";

    isBackground = true;
    data = [];

    _manifest = [];
    _running = false;

    constructor () {
        super();

        this.id = "LazyLoader";
        this.itemsTotal = 0;
    }

    getMedia() {
        let tClass = this;
        let typeMedia = "data-item-lazyload";
        let item;

        C.Selector.forEach("[" + typeMedia + "]", function(el, i) {
            if(el.tagName.toUpperCase() !== "IMG") {
                item = new Display.bg(el, true, true);
            } else {
              item = new Display.image(el, true, true);
            }

            tClass.add(item);
        }.bind(this));
    }

    add(__item) {
        this.itemsTotal =  this._manifest.push(__item);
    }

    initBackground() {
        this.getMedia();

    }

    loop() {
        if(this.itemsTotal > 0) {
            for(let i = 0; i<this.itemsTotal; i++) {
                if (this._manifest[i]._yShow + Scroll.y <= 0) {
                    let item = this._manifest.shift();
                    this.data.push(item);
                    item.load();

                    i--;
                    this.itemsTotal--;
                }
            }
        }
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
    }

    reset() {
        this.itemsTotal = 0;
        this._manifest = [];
    }
}


