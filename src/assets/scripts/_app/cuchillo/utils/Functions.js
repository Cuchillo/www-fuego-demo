import { Basics } from '../core/Basics';

export const Functions = {
  getSizePrefix: function(__size) {
    var _prefix = "xlarge";

    if(__size == 0 || __size == undefined) __size = Metrics.WIDTH_INSIDE;

    if(__size <= 480)         _prefix = "small";
    else if(__size <= 780)    _prefix = "medium";
    else if(__size <= 1200)   _prefix = "large";
    else if(__size > 1200)    _prefix = "xlarge";

    return _prefix;
  },

//==================================================================================================================
//          DIVS
//==================================================================================================================

  getSelector: function(__item) {
    var selector = __item
      .parents()
      .map(function() { return this.tagName; })
      .get()
      .reverse()
      .concat([__item[0].nodeName])
      .join(">");

    var id = __item.attr("id");
    if (id) {
      selector += "#"+ id;
    }

    var classNames = __item.attr("class");
    if (classNames) {
      selector += "." + $.trim(classNames).replace(/\s/gi, ".");
    }

    return selector;
  },

  getId(__item) {
    if(!__item.getAttribute("id")) {
      __item.setAttribute("id", "__" + new Date().getTime());
    }

    return __item.getAttribute("id");
  },

  doMrCorrales: function() {
    if(Basics.language == "es") console.log('%cby Cuchillo', 'background: #000; color: #bada55; padding:25px 100px;');
    else console.log('%cby Cuchillo', 'background: #000; color: #bada55; padding:25px 100px;');
    console.log('⟶ http://cuchillo.studio');
    console.log('⟶ https://www.instagram.com/_cuchillo');
    console.log('⟶ https://twitter.com/somoscuchillo');
    console.log('⟶ https://twitter.com/mr__corrales');
    console.log('');
    console.log('TweenLite & TimelineLite by Greenshock');
    console.log('⟶ https://greensock.com');
    console.log('');
    console.log('ThreeJS');
    console.log('⟶ https://www.threejs.org');
    console.log('');
    console.log('Font: Univers Condensed Light');
    console.log('⟶ https://www.fonts.com/font/linotype/univers');
    console.log('');
    console.log('Font: Warnock Pro Bold Caption by Robert Slimbach');
    console.log('⟶ https://fonts.adobe.com/fonts/warnock');
    console.log('');
    console.log('Font: Pilowlava by Anton Moglia + Jérémy Landes');
    console.log('⟶ https://velvetyne.fr/');
    console.log('');
    console.log('SVGOMG');
    console.log('⟶ https://jakearchibald.github.io/svgomg/');
    console.log('');
    console.log('Favicon Generator');
    console.log('⟶ https://realfavicongenerator.net');
  },

  copyToClipboard: function(str) {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  },

  url2Id: function(__url) {
    var id = "index";

    if(__url.charAt(__url.length-1) == "/") __url = __url.slice(0, __url.length-1);

    let _n;

    if(Basics.mainLang !== Basics.language) {
      _n = __url.indexOf("/" + Basics.language + "/");
    } else {
      _n = __url.lastIndexOf("/");
    }

    if(_n >= 0) id =  __url.slice(_n, __url.length).split("/").join("").split(".").join("");
    else id = __url.split(".").join("");

    return id;
  },

  getRect: function(x0, y0, x1, y1) {
    return "rect(" + y0 + "px " + x1 + "px " + y1 + "px " + x0 + "px)"
  },

  clone: function(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
  },


  arrayRandom: function(__array) {
    return __array.sort(() => {return Math.random() - 0.5});
  },

  //COLORS
  hexToRgb: function(hex) {
    if(hex) {
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.toString().replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
      });

      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    } else {
      return null;
    }
  },

  hexToCSS: function(hex, alpha = 1) {
    const rgb = this.hexToRgb(hex);
    return "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + alpha + ")";
  },

  decToCSS: function(hex) {
    return "#" + hex.toString(16);
  },

  rgbToCSS: function(rgb, alpha = 1) {
    return "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + alpha + ")";
  },

  decimalColorToHTMLcolor: function (integer) {
    let number = (+d).toString(16).toUpperCase()
    if( (number.length % 2) > 0 ) { number= "0" + number }
    return number
  },

  getOffsetLeft: function ( elem ) {
    var top = elem.offsetTop;
    do {
      if ( !isNaN( elem.offsetTop ) ) {
        top += elem.offsetTop;
      }
    } while( elem = elem.offsetTop );
    return top;
  },

  /* IMAGES */

  getImageSrc: function (__dom) {
    const prefix = this.getSrcPrefix(__dom);

    return prefix !== ""?
      __dom.getAttribute("data-src").split("@1x.").join(prefix + ".") :
      __dom.getAttribute("data-src");
  },

  getSrcPrefix: function (__dom) {
    const width = __dom.getAttribute("data-width")? Number(__dom.getAttribute("data-width")) : Number(__dom.getAttribute("width"));
    const maxratio = __dom.getAttribute("data-maxratio")? Number(__dom.getAttribute("data-maxratio")) : 0;
    const prefix = Math.min(maxratio, Math.floor((__dom.offsetWidth * Sizes.RATIO)/width)*2);

    return prefix > 1? "@" + prefix + "x" : "";
  }

  /* SMAE DOMAIN */



};



