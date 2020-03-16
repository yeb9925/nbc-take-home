/**
 * /server/server.js
 * 
 * @description Create express server
 */

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");

const environment = process.env.NODE_ENV !== "production" ? "dev" : "combined";

/**
 * Create app
 * @returns {void}
 */
const createApp = () => {
    app.use(morgan(environment));

    // Body-parsing Middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Route to subroutes
    app.use("/", require("./api"));

    // Error Handling
    app.use((err, req, res, next) => {
        console.error(err)
        console.error(err.stack)
        res.status(err.status || 500).send(err.message || "Internal server error")
    });
};

createApp();

module.exports = app;
