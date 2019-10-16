const mysql = require('mysql');

module.exports = () => {
    return mysql.createPool({
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        //password: 'root',
        database: 'hap'
    });
}