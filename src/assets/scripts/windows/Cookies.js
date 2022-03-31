import _Cookies from '../_app/cuchillo/layout/Cookies';

export default class Cookies extends _Cookies {
    static show__effect(__d = 0) {
        this.container.style.opacity = "1";
    }

    static hide__effect(__d = 0) {
        this.container.style.display = "none";
        super.dispose();
    }
}


