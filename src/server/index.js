/**
 * /server/index.js
 * 
 * @description Entry point of the application
 */

const app = require("./server");
const { PORT } = require("./config");

/**
 * Start listening
 * @returns {void}
 */
const startListening = () => {
    app.listen(PORT, () => {
        console.log(`Server now listening on port: ${PORT}`)
    });
};

startListening();
