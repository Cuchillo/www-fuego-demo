import { ControllerPage } from '../_app/cuchillo/pages/ControllerPage';
import Default from './Default';

export default class Legal extends Default {
  id;
  isWrapAutoRemove = true;

//==================================================================================================================
//          CONSTRUCTOR
//==================================================================================================================

  constructor() {
    super();

    document.body.classList.add("body-legal");
  }

  afterHide() {
    document.body.classList.remove("body-legal");

    super.afterHide();
  }
}

ControllerPage._addPage("legal", Legal)
