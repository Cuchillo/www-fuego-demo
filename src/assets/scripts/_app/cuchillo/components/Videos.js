import { gsap } from 'gsap';
import { C, GetBy } from '../core/Element';
import { isTouch, isReducedMotion, Basics } from '../core/Basics';

export const Videos = {
  _observer : null,
  _options: {
    rootMargin: '0px 0px 100px 0px',
    threshold: 0
  },
  _calls: {},
  _video: null,
  _timer: null,

  init() {
    this._calls = {
      loop: () => this.loop(),
    };

    if(this._observer) {
      this._observer.disconnect();
    }

    if(!isReducedMotion) this._observer = new IntersectionObserver(this.check, this._options);
    C.forEach("[data-autoplay]", (el, i) => {
      if(isTouch || isReducedMotion) {
        const POSTER = el.getAttribute("data-poster");
        if(POSTER) {
          el.setAttribute("poster", POSTER);
        }
      } else {
        el.removeAttribute("controls");
      }

      this.setupActions(el);
      if(!isReducedMotion) this._observer.observe(el);
    });
  },

  check(entries, observer) {
    entries.forEach(entry => {
      const AUTOPLAY = entry.target.getAttribute("data-autoplay");
      const ITEM = entry.target;
      const CONTAINER = ITEM.parentNode.parentNode;

      if(AUTOPLAY !== null && !CONTAINER.classList.contains("--pause")) {
        if(entry.isIntersecting) {
          const playPromise = ITEM.play();

          if (playPromise !== undefined) {
            playPromise.then(_ => {
              if(!entry.isIntersecting) {
                ITEM.pause();
              }
            }).catch(error => {});
          }

        } else if(ITEM.currentTime > 0) {
          ITEM.pause();
        }
      }
    });
  },

  setupActions(item) {
    const container = item.parentNode.parentNode;
    const btn = GetBy.class("__pause", container)[0];
    const timeLabel = GetBy.class("__time", container)[0];
    const loopStartTime = item.getAttribute("data-loop-start");

    if(btn) {
      /* PLAY PAUSE */
      btn.addEventListener(Basics.clickEvent, () => {
        if(container.classList.contains("--pause")) {
          this._video = item;
          this._timer = timeLabel;
          this.loop();
          item.play();
          container.classList.remove("--pause");
        } else {
          this._video = item;
          this._timer = timeLabel;
          this.loop();
          item.pause();
          container.classList.add("--pause");
        }
      });

      /* HOVER LOOP */
      if(!isTouch) {
        btn.addEventListener(Basics.mouseOver, () => {
          this._video = item;
          this._timer = timeLabel;
          this.loop();
          gsap.ticker.add(this._calls.loop);
        })
        btn.addEventListener(Basics.mouseOut, () => {
          this._video = item;
          gsap.ticker.remove(this._calls.loop);
        })
      }
    }

    /* LOOP TIME */
    if(loopStartTime) {
      item.removeAttribute("loop");
      item.addEventListener('ended', (event) => {
        item.currentTime = loopStartTime;
        item.play();
      });
    }
  },

  loop() {
    const time = this._video.duration - this._video.currentTime;
    const timeRendered = this.secondsToPlayerTime(isNaN(time)? 0 : time);
    this._timer.textContent = timeRendered;
  },


  secondsToPlayerTime(__sec) {
    const MINS = Math.floor(__sec/60);
    const SECS = Math.floor(__sec - MINS * 60);
    const CENTS = Math.floor((__sec - SECS - MINS * 60) * 100);

    const sMINS = MINS<10? "0" + MINS : MINS.toString();
    const sSECS = SECS<10? "0" + SECS : SECS.toString();
    const sCENTS = CENTS<10? "0" + CENTS : CENTS.toString();

    return sMINS + ":" + sSECS + ":" + sCENTS
  }
};
