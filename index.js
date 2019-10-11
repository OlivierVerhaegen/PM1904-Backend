const http = require('http');
const https = require('https');
const express = require('express');
const morgan = require('morgan');
const mysql = require('mysql');
const logger = require('./logger');

const app = express();
app.use(express.static('./public'));
app.use(morgan('short'));

const mysqlConnectionConfig= {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'HAP'
}

app.get('/', (req, res) => {
    logger.warn('WARN: Someone is trying to access the root route.');
    res.status(404).send();
});

app.get('/products', (req, res) => {
    logger.log('Getting products from database...');
    
    const connection = mysql.createConnection(mysqlConnectionConfig);

    const queryString = 'SELECT * FROM products';
    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            logger.error('ERROR: Failed to get products from database.');
            res.sendStatus(500);
            return;
        }

        res.json(rows);
    });
});

app.get('/products/:id', (req, res) => {
    logger.log(`Getting product ${req.params.id} from database...`);

    const connection = mysql.createConnection(mysqlConnectionConfig);

    const queryString = 'SELECT * FROM products WHERE id = ?';
    connection.query(queryString, [req.params.id], (err, rows, fields) => {
        if (err) {
            logger.error('ERROR: Failed to get products from database.');
            res.sendStatus(500);
            return;
        }

        res.json(rows);
    });
});

http.createServer(app).listen(9000, () => {
    logger.log("Server is up an listening on http://localhost:9000");
});

// https://stackoverflow.com/questions/11744975/enabling-https-on-express-js
// https.createServer(app).listen(9443, () => {
//     logger.log("Server is up an listening on http://localhost:9000");
// });