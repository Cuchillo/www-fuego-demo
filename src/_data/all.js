const _all = require('./_all.js');
const build = require('./build.js');
const locales = require('./locales.js');
const fetchData = require('../_helpers/fetchData.js');
const getUrl = require('../_helpers/getUrl.js');
const getUrlLanguage = require('../_helpers/getUrlLanguage.js');
const endpoint = `${build.dataUrl}/wp-json/wp/v2/`;

const types = ["pages", "news", "legales"]

async function getData(){
    console.log("------ Fetching all... ------");

    const data_i18n = [];

    for (let i in locales.langs) {
        const lang = locales.langs[i].code;
        const dataLang = {}

        for (let j in types) {
            const type = types[j];
            const langUrl = lang !== "es"? `&lang=${lang}` : "";
            const data = await fetchData(`${type}-${lang}`, `${endpoint}${type}?per_page=100${langUrl}&cachebuster=${new Date().getTime()}`);

            data.map((item) => {
                item.language = getUrlLanguage(item.link);
                item.link = item.slug === 'home' && lang === locales.default ? '/index.html' : getUrl(item.link);
            });

            dataLang[type] = data;
        }

        _all[lang] = dataLang;

        data_i18n[lang] = dataLang;
    }



    return data_i18n;
}

module.exports = getData;
