import { GetBy } from '../core/Element';
import { WinMessage } from '../windows/Message';

export default class FormSender {

  static send(__formValidator, __data, __form, __files = null) {
    let btn = GetBy.class("__submit", __form)[0];

    if (typeof Loading !== 'undefined') {
      Loading.start();
    }

    const btn_loading = btn.getAttribute("data-text-sending")===undefined? null :  btn.getAttribute("data-text-sending");
    if(btn_loading) {
      btn.classList.add("__loading");
      btn.textContent = btn.getAttribute("data-text-sending");
    }

    let data = {};

    if(__form.getAttribute("data-type") === "newsletter-subscriptions") {
      data = {
        "data": {
          "type": __form.attr("data-type"),
          "attributes": __data
        }
      };
    } else if(__form.getAttribute("data-type") === "mailforms") {
      delete __data.to;
      data = Object.keys(__data).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(__data[key])
      }).join('&');
    } else {
      data = {
        "data": {
          "subject": __form.getAttribute("data-subject"),
          "attributes": __data,
          "attachments": __files
        }
      };
    }


    var settings = {
      async: true,
      url: __form.getAttribute("data-href"),
      method: "POST",
      data: __data
    };

    const mssg_ok = __form.getAttribute("data-mssg-ok")===undefined? "El mensaje ha sido envíado, nos pondremos en contacto contigo" :  __form.getAttribute("data-mssg-ok");
    const mssg_nok = __form.getAttribute("data-mssg-nok")===undefined? "Ha ocurrido un error. Revisa los datos y vuelve a intentarlo" :  __form.getAttribute("data-mssg-nok");

    let xhr = new XMLHttpRequest();
    xhr.open("POST", __form.getAttribute("data-href"));
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = (e)=> {
      if (typeof Loading !== 'undefined') {
        Loading.stop();
      }

      if(WinMessage) {
        if(xhr.status === 204) {
          WinMessage.success(mssg_ok);
        } else {
          WinMessage.error(mssg_nok);
        }
      } else {
        if(xhr.status === 204) {
          GetBy.class("__mssg", __form)[0].textContent = mssg_ok;
        } else {
          GetBy.class("__mssg", __form)[0].textContent = mssg_nok;
        }
      }
    };
    xhr.send(data);
  }
}
