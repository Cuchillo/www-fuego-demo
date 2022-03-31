import { CSS } from '../../utils/CSS';
import { Scroll } from '../Scroll';
import { Maths } from '../../utils/Maths';


export default class VDisplace {
  static selector = "data-scroll-displace"
  static isNativeAllowed = true;

  item;
  parent;
  p0;
  p1;
  direction;
  offset;
  axis;
  x;
  y;
  z;

  constructor(__item, __axis) {
    this.item = __item;
    this.parent = __item.parentNode;
    this.direction = this.item.getAttribute("data-start")!== null? Number(this.item.getAttribute("data-start")) : 1;
    this.axis = this.item.getAttribute("data-axis") || __axis;
    this.offset = this.item.offsetTop;

    const TRANSLATE = CSS.getTranslate(this.item);
    this.x = TRANSLATE.x;
    this.y = TRANSLATE.y;
    this.z = this.item.style.zIndex || 0;
  }

  loop(__position, __progress) {
    const X = this.axis === "x"? Maths.lerp(this.p0, this.p1, __progress) : this.x;
    const Y = this.axis === "y"? Maths.lerp(this.p0, this.p1, __progress) : this.y;
    this.item.style[CSS.transform] = CSS.translate3D(X,Y,this.z);
  }

  dispose(){};

  resize(__size) {
    const LIMIT = this.axis === "y"? this.item.offsetHeight - this.parent.offsetHeight : this.item.offsetWidth - this.parent.offsetWidth;

    if(this.direction === 0) {
      this.p0 = 0;
      this.p1 = -LIMIT;
    } else {
      this.p1 = 0;
      this.p0 = -LIMIT;
    }
  }
}

Scroll._registerInsider(VDisplace);

