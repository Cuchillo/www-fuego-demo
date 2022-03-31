export class NextPrev {

  _container;
  _options;
  actual = 0;
  total = 0;

  constructor(__container, options = {}) {
    this._container = __container;

    this.options = {
      next: options.next || "__next",
      prev: options.prev || "__prev",
      total: options.total || 0,
      infinity: options.infinity || true,
      gap: options.gap || 1,
      onChange: options.onChange || null,
      onNext: options.onNext || null,
      onPrev: options.onPrev || null
    };


    //BUTTONS
    C.GetBy.class(this.options.next, this._container)[0].addEventListener(Basics.clickEvent, (e)=> {
      if(this.actual + 1 === this.options.total && this.options.infinity === false) {
        return;
      }

      this.actual = this.actual + 1 === this.options.total? 0 : this.actual + 1;
      if(this.options.onChange) this.options.onChange(this.actual, 1);
      if(this.options.onNext) this.options.onNext(this.actual);
    });
    C.GetBy.class(this.options.prev, this._container)[0].addEventListener(Basics.clickEvent, (e)=> {
      if(this.actual === 0 && this.options.infinity === false) {
        return;
      }

      this.actual = this.actual === 0 ? this.options.total - 1 : this.actual - 1;
      if(this.options.onChange) this.options.onChange(this.actual, -1);
      if(this.options.onPrev) this.options.onPrev(this.actual);
    });
  }
}
