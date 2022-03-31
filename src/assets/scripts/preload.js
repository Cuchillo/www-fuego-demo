const _preload = function() {
  document.removeEventListener('DOMContentLoaded', _preload);
  let css = document.createElement( "link" );
  css.rel = "stylesheet";
  css.href = document.getElementById('__appCSS').getAttribute("href");

  let script = document.createElement('script');
  script.src = document.getElementById('__appJS').getAttribute("href");

  css.addEventListener('load', function () {
    document.body.style.opacity = "1";
    document.body.appendChild(script);
  });

  document.head.insertBefore( css, document.head.childNodes[ document.head.childNodes.length - 1 ].nextSibling );
};

if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
  _preload();
} else {
  document.addEventListener('DOMContentLoaded', _preload);
}