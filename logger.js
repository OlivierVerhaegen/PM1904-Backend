const colors = require('colors');

module.exports = {
    info: (message) => {
        console.log(`LOG: ${message}`.blue);
    },
    warn: (message) => {
        console.warn(`WARN: ${message}`.yellow);
    },
    error: (message) => {
        console.error(`ERROR: ${message}`.red);
    }
}