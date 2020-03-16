/**
 * /server/logs.js
 * 
 * @description Build logger and format logs
 */

const { isEmpty } = require("lodash");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, prettyPrint } = format;

/**
 * Add requestParameters field to log
 */
const requestParameters = format((info, opts) => {
    const request = opts.request;
    const argumentList = !isEmpty(request.query) ? request.query : request.params;
    const path = request.originalUrl;
    const requestParams = { arguments: argumentList, path };
    info.requestParameters = requestParams;
    return info;
});

/**
 * Create reqeust logger
 * @param {Request} request
 * @returns {Logger}
 */
const createRequestLog = function(request) {
    return createLogger({
        transports: [
            new transports.Console()
        ],
        format: combine(
            requestParameters({ request }),
            timestamp(),
            prettyPrint()
        )
    });
};

/**
 * Create generic logger
 * @returns {Logger}
 */
const createLog = function() {
    return createLogger({
        transports: [
            new transports.Console()
        ],
        format: combine(
            timestamp(),
            prettyPrint()
        )
    });
};


module.exports = {
    createLog,
    createRequestLog
};
