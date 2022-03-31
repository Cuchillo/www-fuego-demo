const flatcache = require('flat-cache');
const fetch = require("node-fetch");
const path = require('path');
const getCacheKey = require('./getCacheKey.js');

module.exports = async function fetchData(type, endPoint) {
	const cache = flatcache.load(type, path.resolve('./src/_datacache'));
	const key = getCacheKey();
	const cachedData = cache.getKey(key);

	if (!cachedData) {
        let res = await fetch(endPoint);
        const data = await res.json();

		cache.setKey(key, data);
		cache.save();

        console.log(type + " [loaded]");
		return data;
	}

    console.log(type + " [cached]");
	return cachedData;
};
