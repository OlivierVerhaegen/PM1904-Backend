const logger = require('../logger');
const express = require('express');
const router = express.Router();

const SQLConnection = require('../database');

router.get('/', (req, res) => {
    logger.log('Getting products from database...');

    const queryString = 'SELECT * FROM products';
    SQLConnection().query(queryString, (err, rows, fields) => {
        if (err) {
            logger.error('Failed to get products from database.');
            res.sendStatus(500);
            return;
        }

        res.json(rows);
    });
});

router.get('/:id', (req, res) => {
    logger.log(`Getting product ${req.params.id} from database...`);

    const queryString = 'SELECT * FROM products WHERE id = ?';
    SQLConnection().query(queryString, [req.params.id], (err, rows, fields) => {
        if (err) {
            logger.error('Failed to get products from database.');
            res.sendStatus(500);
            return;
        }

        res.json(rows);
    });
});

router.post('/create', (req, res) => {
    logger.log('Creating user' + req.body.name);

    const queryString = 'INSERT INTO products (name, available, price) VALUES (?, ?, ?)';
    SQLConnection().query(
        queryString,
        [   req.body.name,
            req.body.available,
            req.body.price
        ], (err, result, fields) => {
            if (err) {
                logger.error('Failed to insert new user: ' + err);
                res.sendStatus(500);
                return;
            }

            //TODO: Insert product into database. 

            logger.log('Inserted new product with id: ' + result.insertId)
        });
    
    res.end();
});

module.exports = router;