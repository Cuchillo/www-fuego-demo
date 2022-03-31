
import { Basics, isDebug } from '../core/Basics';
import { Maths } from './Maths';
import { Interaction } from '../core/Interaction';
import { Metrics } from '../core/Metrics';
import { Keyboard } from '../core/Keyboard';

export default class Guides {
  static canvas = document.createElement('canvas');
  static ctx = this.canvas.getContext('2d');
  static _guides = []; 
  static colors = ["#00FF00", "#FF0000", "#0000FF", "#1192e8", "#fa4d56"];
  
  static getColor(index) { 
    return index < this.colors.length? this.colors[index] : this.colors[0]; 
  }

  static init(__container = document.body) {
    if(!isDebug) return;

    __container.appendChild(this.canvas);
    this.canvas.style.position = "fixed";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.zIndex = "99999";
    this.canvas.style.pointerEvents = "none";
  }

  static add(options) {
    this._guides.push({
      _cols: options.cols,
      _rows: options.rows,
      cols: 0,
      rows: 0,
      xStep: 0,
      yStep: 0,
      gap: options.gap,
      padding: options.padding || 0,
      color: options.color || this.getColor(this._guides.length),
      alpha: options.alpha || 1,
      enabled: options.enabled,
    });

    const index = this._guides.length - 1;
    Keyboard.add(`${this._guides.length}`, "Guides" + this._guides.length, ()=> {
      this._guides[index].enabled = !this._guides[index].enabled;
    });
  }

  static loop() {
    if(!isDebug) return;

    this._guides.map(item => {
      if(item.enabled) {
        const padding = Metrics.parseSize(item.padding) * window.devicePixelRatio;
        const x0 = padding;

        for(let i=0,j=item.cols; i<=j; i++) {
          if(item.gap) {
            const gap = Metrics.parseSize(item.gap) * window.devicePixelRatio;
            const x = i*item.xStep - gap + x0;

            this.ctx.clearRect(x, 0, gap * 2, this.height);

            this.ctx.beginPath();
            this.ctx.rect(x, 0, gap * 2, this.height);
            this.ctx.fillStyle = item.color;
            this.ctx.globalAlpha = .1,
            this.ctx.fill();//
          }

          this.ctx.beginPath();
          this.ctx.moveTo(i*item.xStep + x0, 0);
          this.ctx.lineTo(i*item.xStep + x0, this.height);
          this.ctx.strokeStyle = item.color;
          this.ctx.globalAlpha = item.alpha,
          this.ctx.stroke();
          this.ctx.closePath();
        }

        for(let i=0,j=item.rows; i<=j; i++) {
          this.ctx.beginPath();
          this.ctx.moveTo(0, i*item.yStep);
          this.ctx.lineTo(this.width, i*item.yStep);
          this.ctx.strokeStyle = item.color;
          this.ctx.globalAlpha = item.alpha,
          this.ctx.stroke();
          this.ctx.closePath();
        }
      }
    });
  }

  static resize() {
    if(!isDebug) return;

    this.width = window.innerWidth * window.devicePixelRatio;
    this.height = window.innerHeight * window.devicePixelRatio;
    this.canvas.setAttribute("width", this.width);
    this.canvas.setAttribute("height", this.height);

    this._guides.map(item => {
      const padding = Metrics.parseSize(item.padding) * window.devicePixelRatio;
      const width = this.width - padding * 2;

      const xStep = (width / item._cols);
      const yStep = (this.height / item._rows);

      if(item._cols != "none") {
        item.xStep = item._cols === "auto"? yStep : xStep;
        item.cols = Math.ceil(width / item.xStep);
      }

      if(item._rows != "none") {
        item.yStep = item._rows === "auto"? xStep : yStep;
        item.rows = Math.ceil(this.height / item.yStep);
      }
    });
  }
}

