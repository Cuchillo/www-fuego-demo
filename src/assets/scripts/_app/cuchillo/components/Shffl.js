import { gsap } from 'gsap';
import { Maths } from '../utils/Maths';

class Diccionario {
  constructor(__string) {
    this._count = 0;
    //this._items = (__string + __string + __string + __string + __string).split("").sort(() => {return Math.random() - 0.5});
    this._items = ["",""];
    this._total = this._items.length;
  }

  has(__s) {
    return this._items.includes(__s)
  }

  next() {
    this._count = this._count + 1 === this._total? 0 : this._count + 1;
    return this._items[this._count];
  }
}

export class Shffl {
  static LEFT = "left";
  static RIGHT = "right";
  static RANDOM = "random";
  static _uppers = new Diccionario("abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz".toUpperCase());
  static _lowers = new Diccionario("abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz");
  static _symbols = new Diccionario("†‡∅→∏∅∞◯⅐↑→↓↔↕↖↗↘↙↺↻∂∅∏∑−√∞∫≈≠≤≥⌚①②③④⑤⑥⑦⑧⑨⑩⓪⓿▶▷◊◯❶❷❸❹❺❻❼❽❾❿⬛⬜⬤+Ç}{_-:|#$%&/()=?¿^[]/*<>");
  static _symbols = new Diccionario("†‡∅→∏∅∞◯⅐↑→↓↔↕↖↗↘↙↺↻∂∅∏∑−√∞∫≈≠≤≥⌚①②③④⑤⑥⑦⑧⑨⑩⓪⓿▶▷◊◯❶❷❸❹❺❻❼❽❾❿⬛⬜⬤+Ç}{_-:|#$%&/()=?¿^[]/*<>");
  static _symbolsFull = new Diccionario("◊◯†‡∅◊◯†‡∅◊◯†‡∅◊◯†‡∅◊◯†‡∅");
  static _numbers = new Diccionario("1234567890①②③④⑤⑥⑦⑧⑨⑩⓪");
  static _symbolsDown = new Diccionario("._¸_._¸_._¸_._¸_._¸_._¸_");
  static _symbolsMid = new Diccionario("•+*-<>~†∞≈≠+*-<>~•†∞≈≠+*-<>~†∞≈≠+*-‹<>~†");
  static _symbolsUp = new Diccionario("’“”‘˜˝˚˙˘ˇˆ´^’“”‘˜˝˚˙˘ˇˆ´^");
  static _symbolsBars= new Diccionario("|/\\|/\\|/\\|/\\|/\\");
  static _symbolsArrows= new Diccionario("←↑→↓↔↕↖↗↘↙↺↻←↑→↓↔↕↖↗↘↙↺↻");
  static _spaces = new Diccionario("      ");
  static _all = new Diccionario("abcdefghijklmnopqrstuvwxyz".toUpperCase() + "abcdefghijklmnopqrstuvwxyz");
  static _upDown = [this._symbolsFull, this._symbolsBars, this._symbolsDown, this._symbolsDown, this._symbolsDown, this._symbolsDown, this._symbolsBars, this._symbolsFull];

  isRunning = false;
  _dom;
  _options;
  _texts
  _frame = 0;
  _frameTo = 0;
  _direction = 1;
  _frameSkipCounter;
  _steps = [];
  _stepsTotal;
  _calls = {
    loop: () => this.loop(),
    end: null,
  }

  constructor(__dom, __opts = {}) {
    this._dom = __dom;
    this._options = {
      duration: __opts.duration || this._dom.getAttribute("data-duration") || .8,
      origin: __opts.origin || this._dom.getAttribute("data-origin") || Shffl.LEFT,
      frameSkip: __opts.frameSkip || this._dom.getAttribute("data-frame-skip") || 1,
      exactSize: __opts.exactSize || !!this._dom.getAttribute("data-exact-size") || false
    }

    this._texts = {
      from: __opts.textFrom || this._dom.innerText,
      to: __opts.textTo || this._dom.getAttribute("data-text-to") || this._dom.innerText
    }

    this._stepsTotal = Math.round((this._options.duration / (this._options.frameSkip + 1)) * 60);
    this._frameSkipCounter = this._options.frameSkip;

    this.setup();
  }

  setup() {
    /*** IGUALAR TAMAÑO TEXTO SI ES NECESARIO ***/
    if(this._options.exactSize) {
      let strSpaces = ""
      while (strSpaces.length < Math.abs(this._texts.to.length - this._texts.from.length)) {
        strSpaces = strSpaces + " "
      }

      if(this._texts.to.length > this._texts.from.length) {
        this._texts.from = strSpaces + this._texts.from;
      } else {
        this._texts.to = strSpaces + this._texts.to;
      }
    }


    const totalLetters = Math.max(this._texts.to.length, this._texts.from.length);
    const letters = new Array(totalLetters);

    /*** JUEGOS DE CARACTERES ***/
    for(let i=0, j=totalLetters; i<j; i++) {
      const start = this.getStartIndex(i, totalLetters);
      const end = this.getEndIndex();

      letters[i] = this.getLetterSeries(
        this._texts.from.charAt(i) || " ",
        this._texts.to.charAt(i) || " ",
        start,
        end,
        this._stepsTotal
      )
    }

    /*** ARRAY PALABRAS ***/
    for(let i = 0; i<this._stepsTotal; i++) {
      let text = "";

      for(let j = 0; j<totalLetters; j++) {
        text = text + letters[j][i];
      }

      this._steps.push(text);
    }

    console.log(this._steps)
  }

  getStartIndex(__index, __total, __mod = 1.4) {
    switch (this._options.origin) {
      case Shffl.LEFT:
        return __index/(__total*__mod);
      case Shffl.RIGHT:
        return ((__total - 1) - __index)/(__total*1.4);
      default: /*** RANDOM **/
        return Maths.maxminRandom(40,0)/100;
    }
  }

  getEndIndex() {
    switch (this._options.origin) {
      case Shffl.LEFT:
        return Maths.maxminRandom(100,80)/100;
      case Shffl.RIGHT:
        return Maths.maxminRandom(100,80)/100;
      default: /*** RANDOM **/
        return Maths.maxminRandom(100,60)/100;
    }
  }

  getLetterSeries(__l1, __l2, __start, __end, __total) {
    const letter = new Array(__total);
    const start = Math.floor((__total-1) * __start);
    const end = Math.ceil((__total-1) * __end);

    let diccionario = Shffl._uppers;
    if(Shffl._symbols.has(__l2)) {
      diccionario = Shffl._symbols;
    } else if(Shffl._lowers.has(__l2)) {
      diccionario = Shffl._lowers;
    } else if(Shffl._numbers.has(__l2)) {
      diccionario = Shffl._numbers;
    } else if(__l2 === " "){
      diccionario = this._options.exactSize? Shffl._symbols : Shffl._spaces;
    }

    let counteSpecial = 0;
    letter[0] = __l1;

    for(let i = 1; i<__total; i++) {
      if(__l2 === " " && __l2 === __l1) {
        letter[i] = " ";
      } else {
        if (i < start) {
          letter[i] = __l1;
        } else if (i >= end) {
          letter[i] = __l2;
        } else {
          if (counteSpecial < 8) {
            letter[i] = Shffl._upDown[counteSpecial].next();
            counteSpecial++;
          } else {
            letter[i] = diccionario.next();
          }
        }
      }
    }

    letter[__total-1] = __l2;
    return letter;
  }

  play(__call = null) {

    this._calls.end = __call;

    if(!this.isRunning) {
      this._frame = 0;
    }
    this._frameTo = this._stepsTotal-1;
    this._direction = 1;
    this.start();
  }

  reverse() {
    this._frameTo = 0;
    this._direction = -1;
    this.start();
  }

  start() {
    if(!this.isRunning) {
      this.isRunning = true;
      gsap.ticker.add(this._calls.loop);
    }
  }

  end() {
    gsap.ticker.remove(this._calls.loop);
    this.isRunning = false;

    if(this._calls.end) {
      this._calls.end();
    }
  }

  loop() {
    if(this._frameSkipCounter === this._options.frameSkip) {
      this._dom.innerText = this._steps[this._frame];

      if (this._frame === this._frameTo) {
        this.end();
      } else {
        this._frame = this._frame + this._direction;
        this._frameSkipCounter = 0;
      }
    } else {
      this._frameSkipCounter = this._frameSkipCounter + 1;
    }
  }

  dispose() {
    gsap.ticker.remove(this._calls.loop);
    this._dom.innerText = this._texts.from;
  }
}