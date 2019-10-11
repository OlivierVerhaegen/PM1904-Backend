const logger = require('../logger');
const express = require('express');
const mysql = require('mysql');
const router = express.Router();

//----------------------------------------------------
//                     SQL Connection
//----------------------------------------------------
function getSQLConnection() {
    return mysql.createPool({
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'HAP'
    });
}
//----------------------------------------------------

router.get('/', (req, res) => {
    logger.log('Getting orders from database...');

    const queryString = 'SELECT * FROM orders';
    getSQLConnection().query(queryString, (err, rows, fields) => {
        if (err) {
            logger.error('Failed to get orders from database.');
            res.sendStatus(500);
            return;
        }

        res.json(rows);
    });
});

module.exports = router;