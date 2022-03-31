const acf_options = require('../_helpers/acf_options.js');
const locales = require('./locales.js');
const type = "localizable_texts";

module.exports = {
    getNext: (__collection, __id, __field = "id")=> {
        let index = 0;
        for(let i in __collection) {
            if(__collection[i][__field] == __id) {
                index = i == __collection.length - 1? 0 : Number(i) + 1;
                break;
            }
        }

        return __collection[index];
    },

    get: (__collection, __id, __field = "id") => __collection.filter(item => item[__field] == __id)[0],

    getAFC: (__collection, __id, __field = "id")=> {
        for(let i in __collection) {
            if(__collection[i].acf[__field] == __id) {
                return __collection[i]
            }
        }

        return null;
    },

};