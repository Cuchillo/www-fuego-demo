const acf_optionGetByLang = require('../_helpers/acf_optionGetByLang.js');
const type = "team";

async function getData(){
    console.log("------ Fetching team... ------ ");

    const data_i18n = await acf_optionGetByLang(type);
    return data_i18n;
}

module.exports = getData;