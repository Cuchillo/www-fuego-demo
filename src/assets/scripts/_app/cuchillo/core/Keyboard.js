const Keyboard = {
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
  ESC: 27,
  HOME: 36,
  END: 35,
  AVPAG: 34,
  REPAG: 33,

  isEnable: false,
  _calls:[],
  _total:0,

  enable: function() {
    if(!Keyboard.isEnable) {
      Keyboard.isEnable = true;
      document.addEventListener('keydown', Keyboard._check);
    }
  },

  disable: function() {
    if(Keyboard.isEnable) {
      Keyboard.isEnable = false;
      document.removeEventListener('keydown', Keyboard._check);
    }
  },

  add: function(key, id, call) {
    this._total = this._calls.push({key, id, call});
  },

  remove: function(key, id) {
    for(let i = 0; i<Keyboard._total; i++) {
      if(key === Keyboard._calls[i].key && id === Keyboard._calls[i].id) {
        Keyboard._calls.splice(i, 1);
        Keyboard._total--;
      }
    }
  },

  _check: function(e) {
    for(let i = 0; i<Keyboard._total; i++) {
      if(e.key === Keyboard._calls[i].key || e.keyCode === Keyboard._calls[i].key) {
        Keyboard._calls[i].call();
      }
    }
  }
};

export { Keyboard }
