import { CSS } from '../../utils/CSS';
import { Scroll } from '../Scroll';

export default class VSticky {
  static selector = "data-scroll-sticky"
  static isNativeAllowed = false;

  item;
  p0;
  p1;
  isFreeStart = false;
  isSticked = false;
  min;
  max;
  offset;
  x;
  y;
  z;
  slomo;
  offsetSlomo //APAÑO para modificar la posicion slomo sin cambiar min;

  constructor(_item) {
    this.item = _item;
    this.p0 = this.item.getAttribute("data-stop")!== null? Number(this.item.getAttribute("data-stop")) : 0;
    this.p1 = this.item.getAttribute("data-resume")!== null? Number(this.item.getAttribute("data-resume")) : 1;
    this.isFreeStart = this.item.getAttribute("data-free-start")!== null? true : false;
    this.offset = this.item.offsetTop;
    this.slomo = this.item.getAttribute("data-slomo")!== null? Number(this.item.getAttribute("data-slomo")) : 1;


    const TRANSLATE = CSS.getTranslate(this.item);
    this.x = TRANSLATE.x;
    this.y = TRANSLATE.y;
    this.z = this.item.style.zIndex || 0;
  }

  loop(__position, __progress) {
    const POSITION = __position.y + this.offset;

    if(POSITION <= this.min) {
      if(!this.isSticked) {
        this.isSticked = true;
        this.item.classList.add("__sticked");
      }
      this.item.style[CSS.transform] = CSS.translate3D(0, Math.min(this.max, this.offsetSlomo + Math.max(this.min, POSITION*-this.slomo)), this.z);
      //this.item.style[CSS.transform] = CSS.translate3D(0, Math.min(this.max, Math.max(this.min, POSITION*-1)), this.z);
    } else {
      if(this.isSticked) {
        this.isSticked = false;
        this.item.classList.remove("__sticked");
      }
      if(this.isFreeStart) {
        this.item.style[CSS.transform] = CSS.translate3D(0, this.offsetSlomo + POSITION*-1, this.z);
      } else {
        this.item.style[CSS.transform] = CSS.translate3D(0, this.offsetSlomo + this.min, this.z);
      }
    }
  }

  dispose(){};

  resize(__size) {
    this.offset = this.item.offsetTop;
    this.min = ((__size.height - this.item.offsetHeight) * this.p0);
    this.max = (__size.height - this.item.offsetHeight) * this.p1;
    this.max -= this.offset;
    this.offsetSlomo = this.min + (this.max * (1 - this.slomo))*.5;
  }
}

Scroll._registerInsider(VSticky);

