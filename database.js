const fs = require('fs');
const mysql = require('mysql');

let credentials;

try {
    if (fs.existsSync('./credentials')) {
        credentials = require('./credentials');
    } else {
        credentials = require('./credentials.test');
    }
} catch(err) {
    console.log(err);
    credentials = require('./credentials.test');
}

module.exports = () => {
    return mysql.createPool(credentials);
}