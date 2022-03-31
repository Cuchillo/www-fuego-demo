const Maths = {
  normalize: function(max, min, val) {
    return (val - min) / (max - min);
  },

  clamp: function (val, min, max) {
    return Math.min(max, Math.max(min, val));
  },

  map: function (val, x1, y1, x2, y2) {
    return ((val - x1) * (y2 - x2)) / (y1 - x1) + x2;
  },

  lerp: function (v1, v2, val) {
    return v1 * (1 - val) + v2 * val;
  },

  smoothstep: function (min, max, val) {
    if (val < min) return 0;
    if (val > max) return 1;
    return (val - min) / (max - min);
  },

  step: function (thrsh, val) {
    return val < thrsh ? 0 : 1;
  },

  precission: function(val, dec = 3) {
    dec = Math.pow(10, dec);
    return Math.round(val * dec) / dec;
  },

  getRotationDegrees: function(obj) {
    var angle = 0;
    var matrix = obj.css("-webkit-transform") ||
      obj.css("-moz-transform")    ||
      obj.css("-ms-transform")     ||
      obj.css("-o-transform")      ||
      obj.css("transform");
    if(matrix !== 'none') {
      var values = matrix.split('(')[1].split(')')[0].split(',');
      var a = values[0];
      var b = values[1];
      var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    } else { angle = 0; }
    return (angle < 0) ? angle + 360 : angle;
  },

  getColorMid: function(__c1, __c2, __ratio) {
    var r = Math.ceil(parseInt(__c1.substring(2,4), 16) * __ratio + parseInt(__c2.substring(2,4), 16) * (1-__ratio));
    var g = Math.ceil(parseInt(__c1.substring(4,6), 16) * __ratio + parseInt(__c2.substring(4,6), 16) * (1-__ratio));
    var b = Math.ceil(parseInt(__c1.substring(6,8), 16) * __ratio + parseInt(__c2.substring(6,8), 16) * (1-__ratio));

    return Number("0x" + this.toHex(r) + this.toHex(g) + this.toHex(b));
  },

  toHex: function(x) {
    x = x.toString(16);
    return (x.length == 1) ? '0' + x : x;
  },

  maxminRandom: function(__max, __min = 1) {
    return Math.floor(Math.random() * (__max - __min + 1)) + __min;
  },

  lineDistance: function( point1, point2 )    {
    var xs = 0;
    var ys = 0;

    xs = point2.x - point1.x;
    xs = xs * xs;

    ys = point2.y - point1.y;
    ys = ys * ys;

    return Math.sqrt( xs + ys );
  },
  toRadians: function(degrees) {
    return degrees * Math.PI / 180;
  },

  toRegrees: function(radians) {
    return radians * 180 / Math.PI;
  },

  angleRadians: function(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
  },

  angleDegrees: function(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
  },

  numberToString: function(__n, __separador = ".") {
    const nArray = __n.toString().split(".");
    nArray[0] = nArray[0].toString().split(".")[0].replace(/\B(?=(\d{3})+(?!\d))/g, __separador);
    return nArray.toString();
  },
};

export { Maths }
