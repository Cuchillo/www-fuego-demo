import { GetBy } from '../core/Element';
import { gsap } from 'gsap';

export default class _Wrap {
  static mainholder = GetBy.id("Main");
  static options = {
    show: {
      duration: .1,
      delay: 0,
      ease: ""
    },
    hide: {
      duration: .1,
      delay: 0,
      ease: ""
    }
  }


  static show(__call) {
    gsap.to(this.mainholder, {
      alpha: 1,
      duration: this.options.show.duration,
      delay: this.options.show.delay,
      ease: this.options.show.ease,
      onComplete:() => {
        if(__call) __call();
      }
    });
  }

  static hide(__call) {
    gsap.to(this.mainholder, {
        alpha: 0,
        duration: this.options.hide.duration,
        delay: this.options.hide.delay,
        ease: this.options.hide.ease,
        onComplete:() => {
          if(__call) __call();
        }
    });
  }

  static directShow() {
    this.mainholder.style.opacity = "1";
  }

  static directHide() {
    this.mainholder.style.opacity = "0";
  }
}


