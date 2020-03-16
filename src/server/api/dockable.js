/**
 * /server/api/dockable.js
 * 
 * @description List of subroutes & handlers for requests beginning with /dockable
 */

const router = require("express").Router();
const { isEmpty } = require("lodash");

const cache = require("../cache/cache");
const { DOCKABLE_MESSAGE, NOT_DOCKABLE_MESSAGE } = require("./messages");
const { formatStrToNum } = require("./utils");
const { getCitiBikeData } = require("../helper");
const { createRequestLog } = require("../logger/logs");

/**
 * GET verify the bikes can be returned at the station
 */
router.get("/:stationid/:bikestoreturn", async (req, res, next) => {
    const logger = createRequestLog(req);
    logger.log({
        level: "info",
        message: "Entering GET /dockable/:stationid/:bikestoreturn"
    });

    let err = null;
    let result = {};
    if(!err) {
        const { stationid, bikestoreturn } = req.params;
        let stationId;
        let bikesCount;
        
        try {
            stationId = formatStrToNum(stationid);
            bikesCount = formatStrToNum(bikestoreturn);
        }
        catch(e) {
            err = new Error(`Station ID and/or Bike Count format error: ${e.message}`);
            next(err, req);
        }

        if(stationId && bikesCount) {
            const originalUrl = req.originalUrl;
            const value = cache.read(originalUrl);
            if(value.length) {
                result = value[0]; // result found in the cache
            } else {
                let stationList = cache.read("/stations"); // check list already in the cache
                if(!stationList.length) {
                    stationList = await getCitiBikeData()
                        .catch(e => {
                            err = new Error(e.message);
                            next(err, req);
                        });
                }
    
                const station = stationList.filter(station => station["id"] === stationId)[0]; // get station by station id
                if(station && !isEmpty(station)) {
                    const dockable = station["availableDocks"] >= bikesCount;
                    const reason = dockable
                        ? `There are total of ${station["availableDocks"]} available docks at this station.`
                        : `You can only dock ${station["availableDocks"]} bikes at this station. Please find other stations if you wish to dock all the bikes in one station or distribute them amongst multiple stations.`
                    const message = dockable
                        ? DOCKABLE_MESSAGE(bikesCount, stationId, reason)
                        : NOT_DOCKABLE_MESSAGE(bikesCount, stationId, reason);
                    result = {
                        dockable,
                        message
                    }
                }

                cache.write(originalUrl, [result]); // write to cache
                res.json(result);
            }
        }
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
