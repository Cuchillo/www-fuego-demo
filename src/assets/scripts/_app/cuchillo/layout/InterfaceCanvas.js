import { Sizes } from '../core/Sizes';

export default class InterfaceCanvas {
  static canvas = document.createElement('canvas');
  static ctx = this.canvas.getContext('2d');
  static width;
  static height;

  static init(__container = document.body, __id = "Interface__Canvas") {
    this.canvas.id = __id;
    __container.appendChild(this.canvas);

    this.resize();
  }

  static loop() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  static resize() {
    this.width = this.canvas.offsetWidth * Sizes.RATIO;
    this.height = this.canvas.offsetHeight * Sizes.RATIO;
    this.canvas.setAttribute("width", this.width);
    this.canvas.setAttribute("height", this.height);
  }
}

