const mysql = require('mysql');

module.exports = () => {
    return mysql.createPool({
        connectionLimit: 10,
        host: 'vserver122.axc.eu',
        user: 'philivg122_hap',
        password: 'zenohattas123',
        database: 'philivg122_hap'
    });
}