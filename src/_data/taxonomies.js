const build = require('./build.js');
const texts = require('./texts.js');
const locales = require('./locales.js');
const fetchData = require('../_helpers/fetchData.js');
const endpoint = `${build.dataUrl}/wp-json/wp/v2/`;

const types = []

async function getData(){
    const data_i18n = [];
    const data_text = await texts();

    for (let i in types) {
        const type = types[i];
        const data = await fetchData(`${type}`, `${endpoint}${type}`);

        for (let j in locales.langs) {
            const lang = locales.langs[j].code;
            const newData = [];

            data.map((item) => {
                newData.push({
                    id: item.id,
                    count: item.count,
                    name: data_text[lang][item.slug]? data_text[lang][item.slug] : slug,
                    slug: item.slug
                })
            });

            if(!data_i18n[lang]) data_i18n[lang] = {}
            data_i18n[lang][type] = newData;
        }
    }

    return data_i18n;
}

module.exports = getData;
