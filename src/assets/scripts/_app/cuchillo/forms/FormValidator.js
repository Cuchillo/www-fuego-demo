import { GetBy, C } from '../core/Element';
import { WinMessage } from '../windows/Message';
import FormSender from './FormSender';

export default class Forms {
  static init() {
    C.forEach(".__form", (e) => { new FormValidator(e); })
  }
}

class FormValidator {
  _form;
  _fields = [];
  _dataSend = {};
  _files = null;

  constructor(__form) {
    this._form = __form;
    this._form.classList.remove("__form");
    this._form.addEventListener("submit", (e)=> {this.prepareSubmit(e)});

    const items = [...GetBy.selector("input"), ...GetBy.selector("select"), ...GetBy.selector("textarea")];
    C.forEach(items, (e)=> {
      this._fields.push(e);
      this.setupFocus(e);
    });
  }

  setupFocus (__item) {
    __item.addEventListener('input', (e) => { this.isInputOK(e.target) });
    __item.addEventListener('focus', (e) => { this.isInputOK(e.target) });
    __item.addEventListener('blur', (e) => {});
  }

  isInputOK(__input) {


    if(!__input) return false;



    let isOk = true;

    switch(__input.getAttribute("type")) {
      case "text":
        if(__input.value.split(" ").join("") === "" && __input.getAttribute("data-form-required") === "true") {
          isOk = false;
          __input.parentNode.classList.add("--error");
          __input.parentNode.classList.remove("--success");
        } else {
          isOk = true;
          __input.parentNode.classList.remove("--error");
          __input.parentNode.classList.add("--success");
        }
        break;

      case "email":
        var filter = /^([a-zA-Z0-9_\.\ñ\Ñ\-])+\@(([a-zA-Z0-9\-\ñ\Ñ])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if(__input.value === "" && __input.getAttribute("data-form-required") === "true") {
          isOk = false;
          __input.parentNode.classList.add("--error");
          __input.parentNode.classList.remove("--success");
        } else if (!filter.test(__input.value)) {
          isOk = false;
          __input.parentNode.classList.add("--error");
          __input.parentNode.classList.remove("--success");
        } else {
          isOk = true;
          __input.parentNode.classList.remove("--error");
          __input.parentNode.classList.add("--success");
        }
        break;

      case "checkbox": {
        if(__input.getAttribute("data-form-required")==="true" && __input.checked) {
          __input.parentNode.classList.remove("--error");
        }
        break;
      }
    }

    console.log("isOk",isOk)

    return isOk;
  }

  check() {

    let bolContinuar = true;
    let field;

    for(var i = 0,j=this._fields.length; i<j; i++) {
      field   =   this._fields[i];

      switch(field.getAttribute("type")) {
        case "text":

          this._dataSend[field.getAttribute("name")] = "";

          if(field.value.split(" ").join("") === "" && field.getAttribute("data-form-required") === "true") {
            bolContinuar = false;
            field.parentNode.classList.add("--error");
            field.parentNode.classList.remove("--success");
          } else {
            this._dataSend[field.getAttribute("name")] = field.value;
          }

          break;

        case "email":

          this._dataSend[field.getAttribute("name")] = "";

          var filter = /^([a-zA-Z0-9_\.\ñ\Ñ\-])+\@(([a-zA-Z0-9\-\ñ\Ñ])+\.)+([a-zA-Z0-9]{2,4})+$/;

          if(field.value.split(" ").join("") === "" && field.getAttribute("data-form-required") === "true") {
            bolContinuar    =   false;
            field.parentNode.classList.add("--error");
            field.parentNode.classList.remove("--success");
          } else if (!filter.test(field.value)) {
            bolContinuar    =   false;
            field.parentNode.classList.add("--error");
            field.parentNode.classList.remove("--success");
          } else {
            this._dataSend[field.getAttribute("name")] = field.value;
          }

          break;

        case "tel":

          this._dataSend[field.getAttribute("name")] = "";

          var filter  =  /^([0-9]+){9}$/;//<--- con esto vamos a validar el numero

          if(field.value.split(" ").join("") === "" && field.getAttribute("data-form-required") === "true") {
            bolContinuar = false;
            field.parentNode.classList.add("--error");
            field.parentNode.classList.remove("--success");
          } else if (!filter.test(field.value.split(" ").join("")) && field.getAttribute("data-form-required")) {
            bolContinuar    =   false;
            field.parentNode.classList.add("--error");
            field.parentNode.classList.remove("--success");
          } else {
            this._dataSend[field.getAttribute("name")] = field.value;
          }
          break;

        case "file": {
          if(field.getAttribute("data-form-required")==="true" && field.prop('files').length < 1) {
            bolContinuar = false;
            field.parentNode.classList.add("--error");
            field.parentNode.classList.remove("--success");
          }

          break;
        }

        case "checkbox": {
          if(field.getAttribute("data-form-required")==="true" && !field.checked) {
            bolContinuar = false;
            field.parentNode.classList.add("--error");
            field.parentNode.classList.remove("--success");
          }

          break;
        }

        case "radio": {
          if(field.checked) {
            this._dataSend[field.getAttribute("name")] = field.value;
          }

          break;
        }

        default:

          this._dataSend[field.getAttribute("name")] = "";

          if(field.value.split(" ").join("") === "" && field.getAttribute("data-form-required") === "true") {
            bolContinuar = false;
            field.parentNode.classList.add("--error");
            field.parentNode.classList.remove("--success");
          } else {
            this._dataSend[field.getAttribute("name")] = field.value;
          }

          break;
      }
    }

    return bolContinuar;
  }

  prepareSubmit(e) {
    e.preventDefault();
    if(this.check())  {
      this.parseToSend();
    } else if(WinMessage) {
      const MSSG = this._form.getAttribute("data-inputs-nok")===undefined? "ERROR" :  this._form.getAttribute("data-inputs-nok");
      WinMessage.error(MSSG);
    }
  }

  parseToSend() {
    this._dataSend["token"] = this._form.getAttribute("data-token");
    if(this._form.getAttribute("data-to")!==undefined) this._dataSend["to"] = this._form.getAttribute("data-to");
    FormSender.send(this, this._dataSend, this._form, this._files);
  }

  reset() {
    this._dataSend = {};
    for(let i = 0,j=this._fields.length; i<j; i++) {
      this._fields[i].val("");
    }
  }

  dispose() {

  }
}
