export const Cookie = {
  get: function(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  },

  set: function(cname, value) {
    let now = new Date();
    let time = now.getTime();
    now.setTime(time + 999999999999);
    document.cookie = cname + "=" + value + "; expires="+now.toUTCString() +"; path=/";
  }
};

