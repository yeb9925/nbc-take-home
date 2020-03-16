/**
 * /server/api/index.js
 * 
 * @description Index file for base routing. All requests routed to corresponding routes
 */

const router = require('express').Router();

// Subroutes and handlers
router.use("/dockable", require("./dockable"));
router.use("/stations", require("./stations"));

module.exports = router;
