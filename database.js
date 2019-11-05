const mysql = require('mysql');
const credentials = require('./credentials');
const testCredentials = require('./credentials.test');

module.exports = () => {
    if (credentials) {
        return mysql.createPool(credentials);
    } else {
        return mysql.createPool(testCredentials);
    }
}