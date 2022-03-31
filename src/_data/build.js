const site = require('./_site.js');
const timestamp = new Date();

module.exports = {
    isDev: process.env.NODE_ENV !== 'production',
    env: process.env.NODE_ENV,
    timestamp: timestamp,
    id: timestamp.valueOf(),
    dataUrl: process.env.NODE_ENV === 'production'?
        site.dataUrl :
        site.dataUrl,
};


