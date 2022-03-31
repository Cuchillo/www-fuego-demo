import { CSS } from '../../utils/CSS';
import { Scroll } from '../Scroll';


export default class VInsider {
  static selector = "data-scroll-insider"
  static isNativeAllowed = true;

  item;
  speed;
  rotation;
  position;
  offset;
  axis;
  x;
  y;
  z;
  width;
  height;
  _rotX;
  _rotY;
  _rotZ;

  constructor(__item, __axis) {
    this.item = __item;
    this.axis = __axis;
    this.speed = this.item.getAttribute("data-speed")!== null? Number(this.item.getAttribute("data-speed")) : 0.8;
    this.rotation = this.item.getAttribute("data-rotation")!== null? Number(this.item.getAttribute("data-rotation")) : 0;
    this._rotX = this.item.getAttribute("data-rotation-x")!== null? Number(this.item.getAttribute("data-rotation-x")) : 0;
    this._rotY = this.item.getAttribute("data-rotation-y")!== null? Number(this.item.getAttribute("data-rotation-y")) : 0;
    this._rotZ = this.item.getAttribute("data-rotation-z")!== null? Number(this.item.getAttribute("data-rotation-z")) : 0;
    this.axisInside = this.item.getAttribute("data-axis")!== null? this.item.getAttribute("data-axis") : this.axis;

    const TRANSLATE = CSS.getTranslate(this.item);
    this.x = TRANSLATE.x;
    this.y = TRANSLATE.y;
    this.z = this.item.style.zIndex || 0;
    this.width = this.item.offsetWidth;
    this.height = this.item.offsetHeight;
  }

  loop(__position, __progress, __progressZero) {
    let X,Y;

    if(this.axisInside === this.axis) {
      X = this.axis === "x"? (this.offset + __position.x) * this.speed : this.x;
      Y = this.axis === "y"? (this.offset + __position.y) * this.speed : this.y;
    } else if (this.axisInside === "x" ) {
      X = (this.offset + __position.y) * this.speed;
      Y = this.y;
    }

    this.position = {x:X, y:Y, z:this.z}

    if(this.rotation) {
      const ROT = __position.y * this.rotation
      this.item.style[CSS.transform] = CSS.rotate3D(this._rotX,this._rotY,this._rotZ, ROT);
    } else {
      this.item.style[CSS.transform] = CSS.translate3D(X,Y,this.z);
    }
  }

  dispose(){};

  resize(__size) {
    this.offset = 0;
    this.width = this.item.offsetWidth;
    this.height = this.item.offsetHeight;
  }
}

Scroll._registerInsider(VInsider);

