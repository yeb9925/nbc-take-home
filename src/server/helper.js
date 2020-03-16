/**
 * /server/helper.js
 * 
 * @description Helper methods
 */

const axios = require('axios');
const { pick } = require("lodash");

const { CITIBIKE_DATA_SOURCE_URL, STATION_REQUIRED_FIELDS } = require("./constants");

const { createLog } = require("./logger/logs"); // log creator
const logger = createLog();

/**
 * Fetch citi bike data from source
 * @param {string} page
 * @returns {number}
 */
const getCitiBikeData = function(url = CITIBIKE_DATA_SOURCE_URL) {
    logger.log({
        level: "info",
        message: "Entering method: getCitiBikeData"
    });

    return axios.get(url)
    .then(res => {
        logger.log({
            level: "info",
            message: "Successfully fetched data from source"
        });

        const { stationBeanList } = res.data;
        result = stationBeanList.map(station => pick(station, STATION_REQUIRED_FIELDS));
        return result;
    })
    .catch(e => {
        throw new Error(e.message);
    });
};

module.exports = {
    getCitiBikeData
};
