import { CSS } from '../utils/CSS';

export class Girarotutto {
  item;
  direction = 1;
  rotation = 0;
  modifier = 1;
  speed = 0;
  min = 1;
  max = 12;

  constructor(__item, __options = {}) {
    this.item = __item;

    this.min = __options.min || this.min;
    this.max = __options.max || this.max;
    this.modifier = __options.modifier || this.modifier;
    this.direction = __options.direction || this.direction;
  }

  loop(__speed) {
    if(__speed > 0) this.direction = -1;
    else if(__speed < 0) this.direction = 1;

    this.speed = Math.max(this.min, Math.min(this.max, Math.abs(__speed)));
    this.rotation += this.speed * this.direction;

    this.item.style.transform = CSS.rotate3D(0,0,1, this.rotation);
  }

  dispose() {

  }
}
