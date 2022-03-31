import { C } from './Element';
import { isDebug } from './Basics';

export const Analytics = {
  isEnabled: false,
  isGA: false,
  isGTM: false,
  code: null,

  init: function() {
    if(this.isEnabled) return;

    this.isEnabled = true;

    C.forEach("[data-cookiecategory='analytics']", (item)=>{
      if(item.getAttribute("data-src")) {
        item.setAttribute("src", item.getAttribute("data-src"));
        item.removeAttribute("data-src");
      } else {
        item.setAttribute("type", "text/javascript");

        this.isGTM = item.text.indexOf("gtm") > -1;
        this.isGA = item.text.indexOf("ga") > -1;
        this.isGTAG = item.text.indexOf("gtag") > -1;
        this.code = item.getAttribute("data-code");

        C.remove(item);
        document.head.appendChild(item);
      }
    });
  },

  sendUrl: function(__url, __title) {
    if(this.isGA) {
      ga('set', {page: __url, title: __title});
      ga('send', 'pageview');

      if(isDebug) {
        console.log('send', 'pageview', __url, __title);
      }
    }

    if(this.isGTAG) {
      gtag('config', this.code, {'page_path': __url});

      if(isDebug) {
        console.log('config', this.code, __url, __title);
      }
    }

    if(this.isGTM) {
      window.dataLayer.push({
        'event': 'Pageview',
        'pagePath': __url,
        'pageTitle': __title
      });

      if(isDebug) {
        console.log('push', 'pageview', __url, __title);
      }
    }
  },

  sendEvent: function(__data) {
    if(this.isGTAG) {
      gtag('event', __data, {
        'event_callback': function() {
          if(isDebug) {
            console.log('event', __data);
          }
        }
      });
    }

    if(this.isGA) {
      const data = __data.split(",");
      ga('send', 'event', data[0]?data[0]:'', data[1]?data[1]:'', data[2]?data[2]:1);

      if(isDebug) {
        console.log('send', 'event', data[0]?data[0]:'', data[1]?data[1]:'', data[2]?data[2]:1);
      }
    }
  }
};
