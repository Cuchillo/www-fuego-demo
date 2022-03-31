import { GetBy, C } from '../core/Element';
import Win from './Window';

export const ControllerWindow = {

  _windows: {},

  init() {
    C.forEach("[data-window]", (e) => {
      new Win(e, e.getAttribute("data-window"));
    })
  },

  toggle: function(__id, __btn) {
    let win = this.getWindow(__id);
    if(win != null) {
      win.actionButtonToggle(__btn);
    }
  },

  registerWindow(__id, __win) {
    this._windows[__id] = __win;
  },

  hideAll(__exception) {
    for (let a in this._windows) {
      if(a !== __exception) {
        this._windows[a].hide();
      }
    }
  },

  getWindow: function(__id) {
    return this._windows[__id];
  },

  resize() {
    for (let a in this._windows) {
        this._windows[a].resize();
    }
  }
};
