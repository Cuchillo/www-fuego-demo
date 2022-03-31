import { GetBy } from '../core/Element';
import VScroll from '../scroll/VScroll';
import VScroll_Item from '../scroll/VScroll_Item';
import Scrollbar from '../scroll/Scrollbar';
import { MrInteraction } from '../core/Interaction';
import { gsap } from "gsap";


export class SliderScroll {
  _container;
  _holder;
  _scroll;
  _scrollBar;
  _interaction;
  _step;
  _call;

  get size() {
    return this._container.offsetWidth + this._scroll.size;
  }

  get sizeOffScreen() {
    return this._scroll.size - this._container.offsetWidth;
  }

  get progress() {
    return this._scroll.progress;
  }

  set progress (progress) {
    this._scroll.goto_percetage(progress, true);
  }

  get total() {
    return this._scroll.total_items;
  }

  get actual() {
    return Math.round(this.progress / this._step);
  }

  constructor(__container, options = {}) {
    this._container = __container;
    this._holder = GetBy.class("__holder", __container)[0];

    this._scroll = new VScroll( {
      container:__container,
      axis:"X",
      wheel:false,
      itemClass: options.itemClass || SliderScroll__Item,
      easing: options.easing,
      smooth: options.smooth,
      hasLimits: options.hasLimits
    });

    if(options.hasScrollbar) {
      this._scrollBar = new Scrollbar(GetBy.class("scrollbar", this._container)[0]);
      this._scroll.setScrollbar(this._scrollBar);
      this._scrollBar.update(0);
    }
    this._scroll.addAll("[scroll-slider-item]");
    this._scroll.resize();
    this._scroll.start();

    this._step = (1/(this.total - 1));

    if(!options.interaction === false) {

      this._interaction = new MrInteraction(this._holder, {
        drag: true,
        axis: "x",
        dragCheckTime: .05,
        onMove: (n) => {
          if (options.onMove) options.onMove();
          this._scroll.move(n)
        },
        onDragStart: () => {
          if (options.onDragStart) options.onDragStart();
          for (let i = 0; i < this._scroll.total_items; i++) {
            this._scroll._items[i].mouseDown();
          }
        },
        onDragEnd: () => {
          if (options.onDragEnd) options.onDragEnd();
          for (let i = 0; i < this._scroll.total_items; i++) {
            this._scroll._items[i].mouseUp();
          }
        }
      });
    }

    /* CONTROLS */
    const NEXT = GetBy.selector("[scroll-slider-next]", __container)[0];
    const PREV = GetBy.selector("[scroll-slider-prev]", __container)[0];

    if(NEXT) {
      NEXT.addEventListener(Basics.clickEvent, (e)=> {
        this.next();
      });
    }

    if(PREV) {
      PREV.addEventListener(Basics.clickEvent, (e)=> {
        this.prev();
      });
    }

    this._call = () => this.loop();
  }

  start() {
    gsap.ticker.add(this._call);
  }

  stop() {
    gsap.ticker.remove(this._call);
  }

  next() {
    this.goto_percetage(Math.min(this.actual + 1, this.total - 1) * this._step);
  }

  prev() {
    this.goto_percetage(Math.max(this.actual - 1, 0) * this._step);
  }

  goto_percetage(__p) {
    this._scroll.goto_percetage(__p);
  }

  loop() {
    this._scroll.loop();
  }

  resize() {
    this._scroll.resize();
  }

  dispose() {
    this._scroll.dispose();
    if(this._interaction) {
      this._interaction.dispose();
    }
    if(this._scrollBar) {
      this._scrollBar.dispose();
    }
  }
}

class SliderScroll__Item extends VScroll_Item {

//==================================================================================================================
//          CONSTRUCTOR
//==================================================================================================================

  constructor(__link, __index, __scroller) {
    super(__link, __index, __scroller);
  }

//==================================================================================================================
//          PUBLIC
//==================================================================================================================

  mouseOver() {}
  mouseDown() {}
  mouseUp() {}

  show() {
    super.show();
  }

  hide() {
    super.hide();
  }
}
