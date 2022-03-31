const build = require('../_data/build.js');
const locales = require('../_data/locales.js');
const fetchData = require('../_helpers/fetchData.js');
const type = "options";
const endpoint = `${build.dataUrl}/wp-json/acf/v3/options/options?cachebuster=${new Date().getTime()}`;

async function getData(){
    console.log("Fetching acf options...");
    const data_i18n = {}
    for (let i in locales.langs) {
        const lang = locales.langs[i].code;
        const data = await fetchData(`${type}-${lang}`, `${endpoint}?lang=${lang}`);

        data_i18n[lang] = data.acf;
    }

    return data_i18n;
}

module.exports = getData;
