import MediaObject from './MediaObject';
import { C } from '../core/Element';

export default class BGObject extends MediaObject{

  _temp = document.createElement("img");
  size;
  position;

  constructor(__item) {
    super(__item, MediaObject.TYPE_BG);

    this.size = getComputedStyle(this.item)["background-size"];
    this.position = getComputedStyle(this.item)["background-position"];

    this._temp.style.display = "none";
    this.item.appendChild(this._temp);
  }

  setup() {
    super.setup();
  }

  load(__callback) {
    this._temp.addEventListener('load', () => {
      C.Remove(tClass._temp);
      this._temp = null;

      this.item.style.backgroundImage = "url(" + this.src + ")";
      this.item.style.backgroundSize = this.bgSize;
      this.item.style.backgroundPosition = this.bgPos;

      this.setup();
      this.show();

      if(__callback != null)  __callback();
    });

    this._temp.setAttribute("src", this.src);
  }

  dispose() {
    if (!super.isStatic) {
      if (this._temp) {
        this._temp.setAttribute("src", "");
        this._temp = null;
      }
      this.item = null;
    }
  }

  show() {
    super.show();
  }
}


