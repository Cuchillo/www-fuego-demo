const locales = require('../_data/locales.js');
const acf_options = require('./acf_options.js');

async function acf_optionGetByLang(type){
    const data = await acf_options();
    const data_i18n = {}

    for (let i in locales.langs) {
        const lang = locales.langs[i].code;
        data_i18n[lang] = data[lang][type];
    }

    return data_i18n;
}

module.exports = acf_optionGetByLang;
