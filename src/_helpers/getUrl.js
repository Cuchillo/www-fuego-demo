const build = require('../_data/build.js');

module.exports = function getUrl(url) {
  return "/" + url.split(build.dataUrl)[1];
}
