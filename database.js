const mysql = require('mysql');
const credentials = require('./credentials');

module.exports = () => {
    return mysql.createPool(credentials);
}