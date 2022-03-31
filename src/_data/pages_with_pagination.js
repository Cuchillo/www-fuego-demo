const locales = require('./locales.js');
const _all = require('./_all.js');
const type = "pages"

async function getData(){
    console.log("------ Fetching pages with pagination... ------");

    const dataFinal = {};
    const dataAll = _all;

    for (let i in locales.langs) {
        const lang = locales.langs[i].code;
        const data = dataAll[lang][type];
        dataFinal[lang] = {}

        for (let j in data) {
            const slugPagination = data[j].acf.options.pagination;

            if(slugPagination != null) {
                dataFinal[lang][slugPagination] = data[j];
            }
        }
    }

    return dataFinal;
}

module.exports = getData;