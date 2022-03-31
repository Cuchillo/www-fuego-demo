const locales = require('../_data/locales.js');

module.exports = function getUrlLanguage(url) {
  let lang = locales.default;

  for (let i in locales.langs) {
    const code = locales.langs[i].code;
    if(url.indexOf(`/${code}/`) > 0) {
      lang = code;
      break;
    }
  }

  return lang;
}
