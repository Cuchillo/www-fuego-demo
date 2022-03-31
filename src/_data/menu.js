const build = require('./build.js');
const locales = require('./locales.js');
const getUrl = require('../_helpers/getUrl.js');
const fetchData = require('../_helpers/fetchData.js');
const type = "menu"
const endpoint = `${build.dataUrl}/wp-json/wp/v2/${type}`;

async function getData(){
    console.log("Fetching menu...");
    const dataMenu_i18n = {}

    for (let i in locales.langs) {
        const lang = locales.langs[i].code;
        const data = await fetchData(`${type}-${lang}`, `${endpoint}?lang=${lang}`);
        const dataMenu = [];

        if (data.length > 0) {
            data.filter(item => parseInt(item.menu_item_parent) === 0)
              .map(item => {
                  const newItem = {
                      id: item.ID,
                      slug: item.title,
                      title: item.title,
                      url: item.url ? getUrl(item.url) : "",
                      items: []
                  };

                  dataMenu.push(newItem);
              });

            data.filter(item => parseInt(item.menu_item_parent) !== 0)
              .map(item => {
                  const newItem = {
                      id: item.ID,
                      slug: item.title,
                      title: item.title,
                      url: item.url ? getUrl(item.url) : "",
                      items: []
                  };

                  const parent = dataMenu
                    .find(parentItem => parentItem.id === parseInt(item.menu_item_parent));
                  if (parent) parent.items.push(newItem);
              });
        }

        dataMenu_i18n[lang] = dataMenu;
    }

    return dataMenu_i18n;
}

module.exports = getData;
