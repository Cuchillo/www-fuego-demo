export default class EventDispatcher {
  static _listeners = [];

  static hasEventListener(type, listener,id) {
    let exists = false;

    for (var i = 0; i < this._listeners.length; i++) {
      if (this._listeners[i].type === type && this._listeners[i].id === id) {
        exists = true;
      }
    }
    return exists;
  }

  static addEventListener(typeStr, listenerFunc, id = "") {
    if (this.hasEventListener(typeStr, listenerFunc,id)) {
      return;
    }
    this._listeners.push({type: typeStr, listener: listenerFunc, id:id});
  }

  static removeEventListener(typeStr, id) {
    for (let i = 0; i < this._listeners.length; i++) {
      if (this._listeners[i].type === typeStr && this._listeners[i].id === id) {
        this._listeners.splice(i, 1);
      }
    }
  }

  static dispatchEvent(evt) {
    for (let i = 0; i < this._listeners.length; i++) {
      if (this._listeners[i].type === evt) {
        this._listeners[i].listener.call(this, evt);
      }
    }
  }
}
