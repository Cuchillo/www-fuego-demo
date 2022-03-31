const acf_options = require('../_helpers/acf_options.js');
const locales = require('./locales.js');
const type = "localizable_texts";

async function getData(){
    console.log("------ Fetching texts... ------ ");
    const data = await acf_options();
    const data_i18n = {}

    for (let i in locales.langs) {
        const lang = locales.langs[i].code;
        data_i18n[lang] = {}

        if(data[lang][type]) {
            data[lang][type].map(item => {
                data_i18n[lang][item.name] = item.value;
            })
        }
    }

    return data_i18n;
}

module.exports = getData;