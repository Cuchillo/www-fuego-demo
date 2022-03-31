import { CSS } from '../../utils/CSS';
import { Scroll } from '../Scroll';
import { Maths } from '../../utils/Maths';


export default class VScaleZero {
  static selector = "data-scroll-scale-zero"
  static isNativeAllowed = true;

  item;
  axis;
  scale0;
  scale1;
  offset;
  x;
  y;
  z;
  width;

  constructor(__item, __axis) {
    this.item = __item;
    this.axis = __axis;

    this.scale1 = this.item.getAttribute("data-end")!== null? Number(this.item.getAttribute("data-end")) : 1;
    this.scale0 = this.item.getAttribute("data-start")!== null? Number(this.item.getAttribute("data-start")) : 2;
    this.width = this.item.width;

    const TRANSLATE = CSS.getTranslate(this.item);
    this.x = TRANSLATE.x;
    this.y = TRANSLATE.y;
    this.z = this.item.style.zIndex || 0;

    this.offset = this.item.offsetLeft;
  }

  loop(__position, __progress) {
    const POS = this.axis === "x"? __position.x : __position.y;
    const PROGRESS = Maths.normalize(0, this.width, POS);
    const ALPHA = Maths.normalize(0, -this.width, POS);

    if(POS > 0) {
      let scale = Maths.lerp(this.scale0, this.scale1, PROGRESS);
      this.item.style[CSS.transform] = CSS.translate3D(this.x, this.y, this.z) + " " + CSS.scale3D(scale, scale);
    } else {
      this.item.style[CSS.transform] = CSS.translate3D(POS * -.9, this.y, this.z) + " " + CSS.scale3D(1, 1);
      this.item.style.opacity = ALPHA;
    }
  }

  dispose(){};

  resize(__size) {
    this.width = this.item.width;
  }
}

Scroll._registerInsider(VScaleZero);

