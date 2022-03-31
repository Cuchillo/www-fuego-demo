import { Scroll } from '../_app/cuchillo/scroll/Scroll';
import VScroll_Item from '../_app/cuchillo/scroll/VScroll_Item';
import { SliderScroll } from '../_app/cuchillo/components/SliderScroll';
import {Metrics} from "assets/scripts/_app/cuchillo/core/Metrics";

class ScrollItem__SliderScrollHorizontal extends VScroll_Item {
  _slider;

  //==================================================================================================================
  //          CONSTRUCTOR
  //==================================================================================================================

  constructor(__link, __index, __scroller) {
    super(__link, __index, __scroller);

    this._slider = new SliderScroll(__link,
      {
        onDragStart: () => {__link.classList.add('--dragging');},
        onDragEnd: () => {__link.classList.remove('--dragging');},
        interaction: false,
        hasLimits: false,
      });

    this.onShow = () => {};
    this.onHide = () => {};
    this.onMove = () => {
      this._slider.progress = 1 - this.progressInside;
      this._slider.loop();
    }
  }

  //==================================================================================================================
  //          PUBLIC
  //==================================================================================================================

  dispose () {
    this._slider.dispose();
    super.dispose();
  }

  resize (__w, __h) {
    super.resize(__w, __h)
    this.item.style.setProperty("--height", `${Metrics.HEIGHT + this._slider.sizeOffScreen}px`);
  }
}

Scroll._registerClass('slider-scroll-horizontal', ScrollItem__SliderScrollHorizontal);