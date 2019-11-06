const fs = require('fs');
const mysql = require('mysql');

let credentials;

try {
    if (fs.existsSync('./credentials.js')) {
        credentials = require('./credentials');
    } else {
        credentials = require('./credentials.test');
    }
} catch(err) {
    console.log(err);
    credentials = require('./credentials.test');
}

module.exports = () => {
    console.log(credentials);
    return mysql.createPool(credentials);
}