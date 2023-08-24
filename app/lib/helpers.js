/*dependices*/
const crypto = require('crypto');

const helpers = {};

/* Create a string of random alphanumeric characters, of a given length */
helpers.createRandomString = (strLength) => {
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    if (strLength){
        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let str = '';
        for (let i = 1; i <= strLength; i++){
            const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            str += randomCharacter;
        }
    }
    return str;
};

/* Create a SHA256 hash */
helpers.hash = (str) => {
    if(typeof(str) === 'string' && str.length>0){
        const hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    }
    return hash;

}

/* Parse a JSON string to an object in all cases, without throwing */
helpers.parseJsonToObject = (str) => {
    try{
        const obj = JSON.parse(str);
        return obj;
    } catch(e){
        return {};
    }
};

module.exports = helpers;