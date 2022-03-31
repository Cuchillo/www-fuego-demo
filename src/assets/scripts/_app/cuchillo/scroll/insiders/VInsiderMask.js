import { CSS } from '../../utils/CSS';
import { Scroll } from '../Scroll';
import VInsider from './VInsider';

export default class VInsiderMask extends VInsider {
  static selector = "data-scroll-insider-mask"
  static isNativeAllowed = true;

  _parentDOM;
  top = 0;
  left = 0;
  _verticalOffset = 0;
  _horizontalOffset = 0;
  _hasParent = false;

  constructor(__item, __axis, __parentDOM) {
    super(__item, __axis);
    this._parentDOM = __parentDOM;
    this._hasParent = !(__parentDOM === this.item.parentNode);
  }

  loop(__position, __progress) {
    const X = this.axis === "x"? (this.offset + __position.x) * this.speed : this.x;
    const Y = this.axis === "y"? (this.offset + __position.y) * this.speed : this.y;
    const Y0 = this.top + Y + this._verticalOffset;
    const Y1 = Y0 + this.height;
    const X0 = this.left + X + this._horizontalOffset;
    const X1 = X0 + this.width;

    if(Y0 < Metrics.HEIGHT) {
      document.body.style.setProperty('--mask-top', `${Y0}px`);
      document.body.style.setProperty('--mask-right', `${X1}px`);
      document.body.style.setProperty('--mask-bottom', `${Y1}px`);
      document.body.style.setProperty('--mask-left', `${X0}px`);
    }

    /* this._parentDOM.style.setProperty('--mask-top', `${Y0}px`);
     this._parentDOM.style.setProperty('--mask-right', `${X1}px`);
     this._parentDOM.style.setProperty('--mask-bottom', `${Y1}px`);
     this._parentDOM.style.setProperty('--mask-left', `${X0}px`);*/
    this.item.style[CSS.transform] = CSS.translate3D(X,Y,this.z);
  }

  dispose(){};

  resize(__size) {
    super.resize(__size);

    if(this._hasParent) {
      this._verticalOffset = CSS.getTranslate(this.item.parentNode).y;
      this._horizontalOffset = CSS.getTranslate(this.item.parentNode).x;
      this.top = this.item.parentNode.offsetTop;
      this.left = this.item.parentNode.offsetLeft;
    } else {
      this.top = this.item.offsetTop;
      this.left = this.item.offsetLeft;
    }
  }
}

Scroll._registerInsider(VInsiderMask);

