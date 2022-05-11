import { Scroll } from '../_app/cuchillo/scroll/Scroll';
import Scrollbar from '../_app/cuchillo/scroll/Scrollbar';
import Page from '../_app/cuchillo/pages/Page';
import { ControllerPage } from '../_app/cuchillo/pages/ControllerPage';
import Wrap from '../layout/Wrap';
import { isMobile } from '../_app/cuchillo/core/Basics';
import { Videos } from '../_app/cuchillo/components/Videos';
import { Acordions } from '../_app/cuchillo/components/Acordions';
import ShffleLinks from '../_app/cuchillo/components/ShffleLinks';

export default class Default extends Page {

  constructor() {
    super();

    Videos.init();
    Acordions.init();
  }

  //SHOW
  beforeShow() {
    Scroll.init(Scroll.AXIS_Y, {domResize:this.container, smooth:!isMobile, multiplicator:1});
    Scroll.setScrollbar(new Scrollbar());
    Scroll.start();
  }

  show__effect(__call) {
    Wrap.show(()=> { this.afterShow()} );
  }

  afterShow() {
    super.afterShow();
  }

  //HIDE
  beforeHide() {}
  hide__effect() {
    Scroll.hide();
    Wrap.hide(() => {this.afterHide();});
  }

  afterHide() {
    Scroll.dispose();
    super.afterHide();
  }

  //RESIZE
  resize() {
    super.resize();
    Acordions.resize();
  }

  //LOOP
  loop() {
    if(this._isActive) {
      super.loop();
    }
  }
}

ControllerPage._addPage("default", Default)
