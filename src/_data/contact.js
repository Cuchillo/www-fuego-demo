const locales = require('./locales.js');
const acf_options = require('../_helpers/acf_options.js');

async function getData(){
    console.log("Fetching contact options...");

    const data = await acf_options();
    const data_i18n = {}

    for (let i in locales.langs) {
        const lang = locales.langs[i].code;
        data_i18n[lang] = data[lang].contact;
        data_i18n[lang].address = data[lang].address ? data[lang].address : {};
        data_i18n[lang].rrss = data[lang].rrss ? data[lang].rrss : {};
    }

    return data_i18n;
}

module.exports = getData;
