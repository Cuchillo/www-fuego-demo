import { CSS } from '../../utils/CSS';
import { Scroll } from '../Scroll';
import { Maths } from '../../utils/Maths';

class VScale {
  static selector = "data-scroll-scale"
  static isNativeAllowed = true;

  item;
  scale0;
  scale1;
  offset;

  constructor(_item) {
    this.item = _item;

    this.scale1 = this.item.getAttribute("data-end")!== null? Number(this.item.getAttribute("data-end")) : 1;
    this.scale0 = this.item.getAttribute("data-start")!== null? Number(this.item.getAttribute("data-start")) : 2;

    this.offset = this.item.offsetLeft;
  }

  loop(__position, __progress) {
    let scale = Maths.lerp(this.scale0, this.scale1, __progress);
    this.item.style[CSS.transform] = CSS.scale3D(scale, scale);
  }

  dispose(){};

  resize(__size) {}
}

Scroll._registerInsider(VScale);

