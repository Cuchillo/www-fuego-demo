import _Header from '../_app/cuchillo/layout/Header';
import { Power3 } from "gsap";

export default class Header extends _Header {
  static options = {
    show: {
      duration: .3,
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


