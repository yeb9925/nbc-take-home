/**
 * /server/constants.js
 * 
 * @description Shared constants 
 */

module.exports = {
    STATION_REQUIRED_FIELDS: [
        "id", "stationName", "stAddress1", "statusValue", "availableBikes", "availableDocks", "totalDocks"
    ],
    CITIBIKE_DATA_SOURCE_URL: "https://feeds.citibikenyc.com/stations/stations.json",
    DEFAULT_CACHE_CAPACITY: 3000
};
