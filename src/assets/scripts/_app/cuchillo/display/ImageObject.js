import MediaObject from './MediaObject';

export default class ImageObject extends MediaObject {

    constructor(__item) {
        super(__item, MediaObject.TYPE_IMG);
    }

    setup() {
      super.setup();
    }

    load(__callback) {
      this.item.addEventListener('load', () => {
        this.setup();
        this.show();

        if(__callback != null)  __callback();
      });

      this.item.setAttribute("src", this.src);
    }

    dispose() {
        if(!super.isStatic) {
          this.item = null;
        }
    }

    show() {
        super.show();
    }
}


