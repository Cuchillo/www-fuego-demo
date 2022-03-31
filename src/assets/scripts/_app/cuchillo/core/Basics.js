import { Sizes } from './Sizes';

const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
const isSafari = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
const isPortrait = window.innerHeight > window.innerWidth;
const isSmartphone = isMobile && window.innerWidth <= Sizes.SMARTPHONE;
const isDebug = document.body.classList.contains("__debug");

// REDUCED MOTION
const _mediaMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
// RELOAD IF CHANGES
try {
  _mediaMotionQuery.addEventListener('change', () => {
    location.reload();
  });
} catch (e1) {
  try {
    // Safari
    _mediaMotionQuery.addListener((e) => {
      location.reload();
    });
  } catch (e2) {
    console.error(e2);
  }
}

const isReducedMotion = _mediaMotionQuery.matches;

const Basics = {
  id: "",
  cdn: "",
  language: document.documentElement.lang,
  mainLang: "es",
  isDebug: false,
  idProject: null,
  hasCookies: true,
  cookiesAccepted: false,
  clickEvent: false,
  downEvent: false,
  upEvent: false,
  moveEvent: false,
  mouseOver: false,
  mouseOut: false,
  velocidad: 0,
  velocidadAux: 0,
};


if (!isTouch) {
  document.body.classList.add("__cursor");
  Basics.clickEvent = "click";
  Basics.downEvent = "mousedown";
  Basics.upEvent = "mouseup";
  Basics.moveEvent = "mousemove";
  Basics.mouseOver = "mouseover";
  Basics.mouseOut = "mouseout";
} else {
  document.body.classList.add("__touch");
  Basics.clickEvent = "click";
  Basics.downEvent = "touchstart";
  Basics.upEvent = "touchend";
  Basics.moveEvent = "touchmove";
  Basics.mouseOver = "touchstart";
  Basics.mouseOut = "touchend";
}

if (isMobile) document.body.classList.add("__mobile");

export { Basics, isMobile, isSafari, isTouch, isDarkMode, isPortrait, isSmartphone, isDebug, isReducedMotion }
