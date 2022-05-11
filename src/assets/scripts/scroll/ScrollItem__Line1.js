import { Scroll } from '../_app/cuchillo/scroll/Scroll';
import VScroll_Item from '../_app/cuchillo/scroll/VScroll_Item';
import { SliderScroll } from '../_app/cuchillo/components/SliderScroll';
import { Metrics } from "../_app/cuchillo//core/Metrics";
import { GetBy } from '../_app/cuchillo/core/Element';
import { Ease } from '../_app/cuchillo/utils/Ease';
import gsap, { Power4, Power2 } from 'gsap';
import { Shffl } from '../_app/cuchillo/components/Shffl';

class TextEffect {
  actual = 0;
  total = 0;

  constructor(dom) {
    this._dom = dom;
    
    this._texts = {
      from: this._dom.innerText,
      to: this._dom.getAttribute("data-text-to") || this._dom.innerText
    }

    this.total = this._texts.to.length;
  }

  play() {
    if(this.actual < this.total) {
    this._dom.textContent += this._texts.to[this.actual];
    this.actual++;
    setTimeout(()=> {this.play()}, 10)
    }
  }
}

class ScrollItem__Line1 extends VScroll_Item {
  
  _tl;

  constructor(__link, __index, __scroller) {
    super(__link, __index, __scroller);

    this.opts.offsetShow = Metrics.HEIGHT * .75;    
    this.setupAnimation();

    this.onShow = () => {
      this._tl.restart();
      if(this.sh) {
        setTimeout(()=> {this.sh.play()},1000);
      }
    };
    this.onMove = () => {}
  }

  setupAnimation() {
    this._tl = gsap.timeline();
    this._tl.pause();

    let delay = 0;
    const items = [...GetBy.selector("span", this.item)];
    items.map((item, i) => {

      const d = item.getAttribute("data-delay")? Number(item.getAttribute("data-delay")) : 0;

      this._tl.to(item, {
        y:0, 
        duration:1,
        ease: Ease.EASE_CUCHILLO_IN_OUT}, 
        d + delay + i * .15);
    });

    
    const link = [...GetBy.selector("a", this.item)][0];
    if(link) {
      this.sh = new TextEffect(link);
    }
  }

  dispose () {
    super.dispose();
  }

  resize(w,h){
    super.resize(w,h);
    this.opts.offsetShow = Metrics.HEIGHT * .75;    
  }
}



Scroll._registerClass('line1', ScrollItem__Line1);