import _Wrap from '../_app/cuchillo/layout/Wrap';
import { Power3 } from "gsap";

export default class Wrap extends _Wrap {
  static options = {
    show: {
      duration: .6,
      delay: 0,
      ease: Power3.easeOut
    },
    hide: {
      duration: .3,
      delay: 0,
      ease: Power3.easeIn
    }
  }

  //static show(__call) {}
  //static hide(__call) {}
}


