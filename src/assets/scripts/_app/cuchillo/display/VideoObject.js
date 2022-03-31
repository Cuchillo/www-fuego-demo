import MediaObject from './MediaObject';

export default class VideoObject extends MediaObject {
  constructor(__item) {
      super(__item, MediaObject.TYPE_IMG);
  }

  load(__callback) {
    this.item.setAttribute("poster", this.src);
    this.setup();
    this.show();
    if(__callback != null)  __callback();
  }

  dispose() {
      if(!super.isStatic) {
        this.item = null;
      }
  }
}


