/**
 * /server/api/messages.js
 * 
 * @description Static template messages (error messages, informational messages, etc.)
 */

 /**
 * dockable messsage tag function
 * @param {string[]} strings
 * @returns {Function}
 */
function dockableMsg(strings) {
    return (function(bikesCount, stationId, reason) {
        return bikesCount + strings[1] + stationId + strings[2] + reason;
    });
};
  

module.exports = {
    dockableMsg,
    DOCKABLE_MESSAGE: dockableMsg`${"bikesCount"} bike(s) available for docking at this station (Station ID: ${"stationId"}). ${"reason"}`,
    NOT_DOCKABLE_MESSAGE: dockableMsg`${"bikesCount"} bike(s) NOT available for docking at this station (Station ID: ${"stationId"}). ${"reason"}`
};
