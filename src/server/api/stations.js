/**
 * /server/api/stations.js
 * 
 * @description List of subroutes & handlers for requests beginning with /stations
 */

const router = require("express").Router();
const { pick } = require("lodash");

const cache = require("../cache/cache");
const { DEFAULT_PAGE_LIMIT, STATION_FIELDS } = require("./constants");
const { formatStrToNum, matchString } = require("./utils");
const { getCitiBikeData } = require("../helper");
const { createRequestLog } = require("../logger/logs");

/**
 * GET all stations. Supports paging via query (eg. page=1)
 */
router.get("/", async (req, res, next) => {
    const logger = createRequestLog(req);
    logger.log({
        level: "info",
        message: "Entering GET /stations"
    });

    let err = null;

    // Validate page param
    let formattedPage;
    const { page } = req.query;
    if(page) {
        try {
            formattedPage = formatStrToNum(page); // Check if page is number
        }
        catch(e) {
            err = new Error(`[Bad Request] Page format error: ${e.message}`);
            next(err, req);
        }
    }

    let resultSet = [];
    if(!err) {
        const originalUrl = req.originalUrl;
        let stationList = cache.read(originalUrl);
        if(!stationList.length) {
            try {
                const list = await getCitiBikeData();
                if(list && list.length) {
                    cache.write(originalUrl, list); // write to cache
                }
                stationList = list;
            }
            catch(e) {
                err = new Error(e.message);
                next(err, req);
            }
        }

        if(stationList) {
            resultSet = stationList.map(station => pick(station, STATION_FIELDS));
            if(formattedPage) { // Allow page query
                resultSet = resultSet.slice((formattedPage-1)*DEFAULT_PAGE_LIMIT, formattedPage*DEFAULT_PAGE_LIMIT);
            }
        }
    }

    if(!err) {
        res.json(resultSet);
    }
});

/**
 * GET all "In Service" stations. Supports paging via query (eg. page=1)
 */
router.get("/in-service", async (req, res, next) => {
    const logger = createRequestLog(req);
    logger.log({
        level: "info",
        message: "Entering GET /stations/in-service"
    });

    let err = null;

    // Validate page param
    let formattedPage;
    const { page } = req.query;
    if(page) {
        try {
            formattedPage = formatStrToNum(page); // Check if page is number
        }
        catch(e) {
            err = new Error(`[Bad Request] Page format error: ${e.message}`);
            next(err, req);
        }
    }

    let resultSet = [];
    if(!err) {
        const originalUrl = req.originalUrl;
        const value = cache.read(originalUrl);
        if(value.length) {
            resultSet = value; // result found in the cache
        } else {
            let stationList = cache.read("/stations"); // check list already in the cache
            if(!stationList.length) {
                try {
                    const list = await getCitiBikeData();
                    if(list && list.length) {
                        cache.write(originalUrl, list); // write to cache
                    }
                    stationList = list;
                }
                catch(e) {
                    err = new Error(e.message);
                    next(err, req);
                }
            }
            
            if(stationList) {
                resultSet = stationList.filter(station => station["statusValue"] === "In Service");
                if(formattedPage) { // Allow page query
                    resultSet = resultSet.slice((formattedPage-1)*DEFAULT_PAGE_LIMIT, formattedPage*DEFAULT_PAGE_LIMIT);
                }
                resultSet = resultSet.map(station => pick(station, STATION_FIELDS));
                
                if(resultSet.length) {
                    cache.write(originalUrl, resultSet); // write to cache
                }
            }
        }
    }

    if(!err) {
        res.json(resultSet);
    }
});

/**
 * GET all "Not In Service" stations. Supports paging via query (eg. page=1)
 */
router.get("/not-in-service", async (req, res, next) => {
    const logger = createRequestLog(req);
    logger.log({
        level: "info",
        message: "Entering GET /stations/not-in-service"
    });

    let err = null;

    // Validate page param
    let formattedPage;
    const { page } = req.query;
    if(page) {
        try {
            formattedPage = formatStrToNum(page); // Check if page is number
        }
        catch(e) {
            err = new Error(`[Bad Request] Page format error: ${e.message}`);
            next(err, req);
        }
    }

    let resultSet = [];
    if(!err) {
        const originalUrl = req.originalUrl;
        const value = cache.read(originalUrl);
        if(value.length) {
            resultSet = value; // result found in the cache
        } else {
            let stationList = cache.read("/stations"); // check list already in the cache
            if(!stationList.length) {
                try {
                    const list = await getCitiBikeData();
                    if(list && list.length) {
                        cache.write(originalUrl, list); // write to cache
                    }
                    stationList = list;
                }
                catch(e) {
                    err = new Error(e.message);
                    next(err, req);
                }
            }

            if(stationList) {
                resultSet = stationList.filter(station => station["statusValue"] === "Not In Service");
                if(formattedPage) {
                    resultSet = resultSet.slice((formattedPage-1)*DEFAULT_PAGE_LIMIT, formattedPage*DEFAULT_PAGE_LIMIT); // Allow page query
                }
                resultSet = resultSet.map(station => pick(station, STATION_FIELDS));
                
                if(resultSet.length) {
                    cache.write(originalUrl, resultSet); // write to cache
                }
            }
        }
    }

    if(!err) {
        res.json(resultSet);
    }
});

/**
 * GET all stations with matching searchstring in stationName & stAddress1 
 */
router.get("/:searchstring", async (req, res, next) => {
    const logger = createRequestLog(req);
    logger.log({
        level: "info",
        message: "Entering GET /stations/:searchstring"
    });

    let err = null;
    let resultSet = [];
    if(!err) {
        const searchstring = req.params.searchstring;
        const originalUrl = req.originalUrl;
        const value = cache.read(originalUrl);
        if(value.length) {
            resultSet = value; // result found in the cache
        } else {
            let stationList = cache.read("/stations"); // check list already in the cache
            if(!stationList.length) {
                try {
                    const list = await getCitiBikeData();
                    if(list && list.length) {
                        cache.write(originalUrl, list); // write to cache
                    }
                    stationList = list;
                }
                catch(e) {
                    err = new Error(e.message);
                    next(err, req);
                }
            }

            if(stationList) {
                resultSet = stationList
                .filter(station => matchString(searchstring, station["stationName"]) || matchString(searchstring, station["stAddress1"]))
                .map(station => pick(station, STATION_FIELDS));
            
                if(resultSet.length) {
                    cache.write(originalUrl, resultSet); // write to cache
                }
            }
        }
    }

    if(!err) {
        res.json(resultSet);
    }
});

// Error Handling
router.use((err, req, res, next) => {
    const logger = createRequestLog(req);
    logger.log({
        level: "error",
        message: err.message
    });
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || "Internal server error");
});

module.exports = router;
