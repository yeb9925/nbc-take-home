/**
 * /server/api/utils.js
 * 
 * @description Utils file for api folder
 */

const { pickBy } = require("lodash");

 /**
 * Check string is valid
 * @param {string} str
 * @returns {bool}
 */
const isNumeric = function(str) {
    if(isNaN(str) || !str.length) {
        return false;
    }
    return /^\d+$/.test(str); // Return false if str negative or float
};

/**
 * Format string to number
 * @param {string} str
 * @returns {number}
 */
const formatStrToNum = function(str) {
    let number;
    if(isNumeric(str)) {
        number = parseInt(str, 10);
    } else {
        throw new Error("Not a whole number");
    }

    return number;
};

/**
 * Check firstStr is substring of the secondStr
 * @param {string} firstStr
 * @param {string} secondStr
 * @returns {bool}
 */
const matchString = function(firstStr, secondStr) {
    if(!firstStr.length) {
        return true;
    }
    return secondStr.includes(firstStr);
};

/**
 * Detect any unsupported params
 * @param {string[]} supportedParams
 * @param {Object} queryParams
 * @returns {void}
 */
const detectUnsupportedParams = function(supportedParams, queryParams) {
    const unsupported = Object.keys(pickBy(queryParams, (val, key) => !supportedParams.includes(key)));
    if(unsupported.length) {
        throw new Error(`Unsupported parameter(s): ${unsupported.join(", ")}`);
    }
};

module.exports = {
    detectUnsupportedParams,
    formatStrToNum,
    isNumeric,
    matchString
};
