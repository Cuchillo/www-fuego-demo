import { Metrics } from './Metrics';
import { Basics, isTouch } from './Basics';
import { ControllerPage } from '../pages/ControllerPage';
import { ControllerWindow } from '../windows/ControllerWindow';
import { GetBy, C } from './Element';
import { Analytics } from './Analytics';
import { Scroll } from '../scroll/Scroll';

const Interaction = {
  _idTimer:0,

  positions:{
    old: {x:0,y:0},
    mouse: {x:0,y:0},
    click: {x:0,y:0},
    up: {x:0,y:0},
  },
  isDragging:false,
  isDragged:false,
  options:{},

  init: function(options = {}){
    this.setOptions(options);
    this._click();

    //if(this.options.drag) {
      this._down();
      this._up();
    //}
    if(this.options.drag || this.options.ajax) {
      this._move();
    }

    this.positions.mouse.x = Metrics.CENTER_X;
    this.positions.mouse.y = Metrics.CENTER_Y;
  },

  setOptions(options = {}) {
    this.options = {
      ajax: options.ajax || false,
      drag: options.drag || false,
      dragIntensity: options.dragIntensity || .1,
      dragCheckTime: options.dragCheckTime * 1000 || 100,
      maxDrag: 4 || Metrics.WIDTH,
      pixelsCheck: options.pixelsCheck || 5,
      onMove: options.onMove || function(n) { Scroll.isScrolling = true; Scroll.move(n) },
      onMouseDown: options.onMouseDown || null,
      onMouseUp: options.onMouseUp || null,
      onDragStart: options.onDragStart || null,
      onDragEnd: options.onDragEnd || null
    };
  },

  _doDragMove(__lastMove = false) {
    let axis = Scroll.axis.toLowerCase();
    
    this.positions.mouse.distance = this.positions.mouse[axis] - this.positions.old[axis];

    this.positions.mouse.speed = Math.min(this.options.maxDrag, Math.max(1, (Math.abs(this.positions.mouse.distance) * this.options.dragIntensity)));

    if(Math.abs(this.positions.mouse[axis] - this.positions.click[axis]) > this.options.pixelsCheck && !__lastMove) {
      this.isDragged = true;
    }

    this.options.onMove(this.positions.mouse.distance*this.positions.mouse.speed);
  },

  _move: function() {
    document.addEventListener(Basics.moveEvent, (e)=> {
      this.positions.mouse = {
        x: isTouch? e.touches[0].screenX : e.clientX,
        y: isTouch? e.touches[0].screenY : e.clientY,
      };

      if(this.isDragging) {
        this._doDragMove()
      } else {
        switch (e.target.tagName.toLowerCase()) {
          case "a":
            //NOT ANCHOR

            if (this.options.ajax &&
              e.target.getAttribute("href").slice(0, 1) !== "#" &&
              e.target.getAttribute("href").indexOf("mailto") < 0 &&
              e.target.getAttribute("href").indexOf("tel") < 0 &&
              e.target.getAttribute("target") !== '_blank' &&
              e.target.getAttribute("data-internal") == null) {

              const href = e.target.getAttribute("href");

              if(ControllerPage.isUrlSameHost(href)) {
                e.preventDefault();
                ControllerPage.preloadPage(e.target.getAttribute("href"));
              }
            }

            break;
        }
      }

      if (this.positions.old.y < this.positions.mouse.y) {
        document.body.classList.add('__mouse-down');
        document.body.classList.remove('__mouse-up');
      } else if (this.positions.old.y > this.positions.mouse.y) {
        document.body.classList.remove('__mouse-down');
        document.body.classList.add('__mouse-up');
      }

      if (this.positions.old.x < this.positions.mouse.x) {
        document.body.classList.add('__mouse-right');
        document.body.classList.remove('__mouse-left');
      } else if (this.positions.old.x > this.positions.mouse.x) {
        document.body.classList.remove('__mouse-right');
        document.body.classList.add('__mouse-left');
      }

      this.positions.old = this.positions.mouse;
    });
  },

  _down: function() {
    document.addEventListener(Basics.downEvent, (e) => {
      this.positions.click = {
        x: isTouch? e.touches[0].screenX : e.clientX,
        y: isTouch? e.touches[0].screenY : e.clientY,
      };

      if(this.options.drag) {
        this._idTimer = setTimeout(() => {
          this.positions.mouse = this.positions.old = this.positions.click;
          this.isDragging = true;          
          if(this.options.onDragStart) this.options.onDragStart();
        }, this.options.dragCheckTime);
      }

      if(this.options.onMouseDown) {
        this.options.onMouseDown();
      }
    });
  },

  _up: function() {
    document.addEventListener(Basics.upEvent, (e) => {
      clearInterval(this._idTimer);

      this.positions.up = {
        x: isTouch? e.changedTouches[0].screenX : e.clientX,
        y: isTouch? e.changedTouches[0].screenY : e.clientY,
      };

      if(this.isDragging) {
        this.isDragging = false;
        if(this.options.onDragEnd) this.options.onDragEnd();
        setTimeout(()=> { this.isDragged = false; },100);
      }

      if(this.options.onMouseUp) {
        this.options.onMouseUp();
      }
    });
  },

  _click: function() {
    document.addEventListener(Basics.clickEvent, (e) => {
      if(this.isDragged) {
        e.preventDefault();

      } else {

        switch (e.target.tagName.toLowerCase()) {
          case "a":
            //GMT
            if(e.target.getAttribute("data-gtm-event")) {
              // dataLayer.push({'event': e.target.getAttribute("data-gtm-event")});
            }
            //GA
            if(e.target.getAttribute("data-ga-event")) {
              Analytics.sendEvent(e.target.getAttribute("data-ga-event"));
            }
            //
            if(e.target.getAttribute("data-temp-value")) {
              Basics.tempValue = e.target.getAttribute("data-temp-value");
            }
            //TOGGLE SIDEMENU
            if(e.target.getAttribute("data-toggle-sidemenu") !== null) {
              Sidemenu.toogleState();
            }

            //ANCHOR
            if (e.target.getAttribute("href").slice(0, 1) === "#") {
              e.preventDefault();
              Scroll.gotoAnchor(e.target.getAttribute("href").substring(1));

            // BACK
            } else if(e.target.getAttribute("data-back") !== null) {
              e.preventDefault();
              ControllerPage.back(e.target.getAttribute("data-href") || e.target.getAttribute("href"));
            } else if (this.options.ajax && e.target.getAttribute("data-temp-value")) {
              Basics.tempValue = e.target.getAttribute("data-temp-value");

              e.preventDefault();
              ControllerPage.changePage(e.target.getAttribute("href"));
            } else if (this.options.ajax &&
              e.target.getAttribute("target") !== '_blank' &&
              e.target.getAttribute("href").indexOf("mailto") < 0 &&
              e.target.getAttribute("href").indexOf("tel") < 0 &&
              e.target.getAttribute("data-internal") == null) {

              const href = e.target.getAttribute("href");

              if(ControllerPage.isUrlSameHost(href)) {
                e.preventDefault();
                C.forEach("[aria-current='page']", (item)=> {
                  item.removeAttribute("aria-current")
                })
                e.target.setAttribute("aria-current", "page");

                const historyType = e.target.getAttribute("data-history") || "push";
                ControllerPage.changePage(href, historyType);
              }
            }
            break;

          case "button":
            //GMT
            if(e.target.getAttribute("data-gtm-event")) {
              // dataLayer.push({'event': e.target.getAttribute("data-gtm-event")});
            }

            //GA
            if(e.target.getAttribute("data-ga-event")) {
              Analytics.sendEvent(e.target.getAttribute("data-ga-event"));
            }

            if(e.target.getAttribute("data-toggle-sidemenu") !== null) {
              e.preventDefault();
              Sidemenu.toogleState();

            } else if(e.target.getAttribute("data-toggle-window") !== null) {
              ControllerWindow.toggle(e.target.getAttribute("data-toggle-window"), e.target);

            } else if(e.target.getAttribute("data-back") !== null) {
              e.preventDefault();

              ControllerPage.back(e.target.getAttribute("data-href"));
            }

            break;
        }
      }
    });
  }
};

class MrInteraction {
  _idTimer = 0;
  container;
  positions={
    old: {x:0,y:0},
    mouse: {x:0,y:0},
    click: {x:0,y:0},
    up: {x:0,y:0},
  };
  isDragging = false;
  isDragged = false;
  options = {};

  constructor(__container, __options) {
    this.container = __container;
    this.setOptions(__options);
    //this._click();

    if(this.options.drag) {
      this._down();
      this._up();
    }
    if(this.options.drag || this.options.ajax) {
      this._move();
    }
  }

  setOptions(options = {}) {
    this.options = {
      drag: options.drag || false,
      dragIntensity: options.dragIntensity || .1,
      dragCheckTime: options.dragCheckTime * 1000 || 100,
      maxDrag: 4 || Metrics.WIDTH,
      pixelsCheck: options.pixelsCheck || 5,
      onMove: options.onMove || null,
      onMouseDown: options.onMouseDown || null,
      onMouseUp: options.onMouseUp || null,
      onDragStart: options.onDragStart || null,
      onDragEnd: options.onDragEnd || null,
      axis: options.axis || "X"
    };
  }

  dispose() {}

  _doDragMove(__lastMove = false) {
    let axis = this.options.axis;
    this.positions.mouse.distance = this.positions.mouse[axis] - this.positions.old[axis];

    this.positions.mouse.speed = Math.min(this.options.maxDrag, Math.max(1, (Math.abs(this.positions.mouse.distance) * this.options.dragIntensity)));

    if(Math.abs(this.positions.mouse[axis] - this.positions.click[axis]) > this.options.pixelsCheck && !__lastMove) {
      this.isDragged = true;
    }

    this.options.onMove(this.positions.mouse.distance*this.positions.mouse.speed);
  }

  _move() {
    this.container.addEventListener(Basics.moveEvent, (e)=> {
      this.positions.mouse = {
        x: isTouch? e.touches[0].screenX : e.clientX,
        y: isTouch? e.touches[0].screenY : e.clientY,
      };

      if(this.isDragging) {
        this._doDragMove()
      } else {
        switch (e.target.tagName.toLowerCase()) {
          case "a":
            //NOT ANCHOR
            if (this.options.ajax &&
              e.target.getAttribute("href").slice(0, 1) !== "#" &&
              e.target.getAttribute("target") !== '_blank' &&
              e.target.getAttribute("data-internal") == null) {

              e.preventDefault();
              ControllerPage.preloadPage(e.target.getAttribute("href"));
            }

            break;
        }
      }

      this.positions.old = this.positions.mouse;
    });
  }

  _down() {
    this.container.addEventListener(Basics.downEvent, (e) => {
      this.positions.click = {
        x: isTouch? e.touches[0].screenX : e.clientX,
        y: isTouch? e.touches[0].screenY : e.clientY,
      };

      if(this.options.drag) {
        this._idTimer = setTimeout(() => {
          this.positions.mouse = this.positions.old = this.positions.click;
          this.isDragging = true;
          if(this.options.onDragStart) this.options.onDragStart();
        }, this.options.dragCheckTime);
      }

      if(this.options.onMouseDown) {
        this.options.onMouseDown();
      }
    });
  }

  _up() {
    this.container.addEventListener(Basics.upEvent, (e) => {
      clearInterval(this._idTimer);

      this.positions.up = {
        x: isTouch? e.changedTouches[0].screenX : e.clientX,
        y: isTouch? e.changedTouches[0].screenY : e.clientY,
      };

      if(this.isDragging) {
        this.isDragging = false;
        if(this.options.onDragEnd) this.options.onDragEnd();
        setTimeout(()=> { this.isDragged = false; },100);
      }

      if(this.options.onMouseUp) {
        this.options.onMouseUp();
      }
    });
  }

  _click() {
    this.container.addEventListener(Basics.clickEvent, (e) => {
      if(this.isDragged) {
        e.preventDefault();
      } else {

      }
    });
  }
}

export { Interaction, MrInteraction }
