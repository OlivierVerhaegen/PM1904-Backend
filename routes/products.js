const logger = require('../logger');
const express = require('express');
const router = express.Router();

const SQLConnection = require('../database');

//--------------------------------------------------------------------------------------
//                                         GET REQUESTS
//--------------------------------------------------------------------------------------
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
            logger.error('Failed to get product from database.');
            res.sendStatus(500);
            return;
        }

        res.json(rows);
    });
});


//--------------------------------------------------------------------------------------
//                                         POST REQUESTS
//--------------------------------------------------------------------------------------
router.post('/create', (req, res) => {
    logger.log('Creating product' + req.body.name);

    const queryString = 'INSERT INTO products (name, available, price, photoUrl, allergens, description) VALUES (?, ?, ?, ?, ?, ?)';
    SQLConnection().query(
        queryString,
        [   req.body.name,
            req.body.available,
            req.body.price,
            req.body.photoUrl,
            req.body.allergens,
            req.body.description
        ], (err, result, fields) => {
            if (err) {
                logger.error('Failed to insert new user: ' + err);
                res.sendStatus(500);
                return;
            } 

            logger.log('Inserted new product with id: ' + result.insertId)
        });
    
    res.sendStatus(201);
});


//--------------------------------------------------------------------------------------
//                                         UPDATE REQUESTS
//--------------------------------------------------------------------------------------
router.patch('/:id', (req, res) => {
    logger.log('Updating product with id: ' + req.params.id);

    const queryString = 'UPDATE products SET name = ?, available = ?, price = ? WHERE id = ?';
    SQLConnection().query(
        queryString,
        [
            req.body.name,
            req.body.available,
            req.body.price,
            req.params.id
        ],
        (err, result, fields) => {
            if (err) {
                logger.error('Failed to update product with id: ' + req.params.id);
                res.sendStatus(500);
                return;
            }

            logger.log('Updated product with id: ' + req.params.id);
        }
    );

    res.sendStatus(200);
});

//--------------------------------------------------------------------------------------
//                                         DELETE REQUESTS
//--------------------------------------------------------------------------------------
router.delete('/:id', (req, res) => {
    logger.log('Deleting product with id: ' + req.params.id);

    const queryString = 'DELETE FROM products WHERE id = ?';
    SQLConnection().query(queryString, [req.params.id], (err, result, fields) => {
        if (err) {
            logger.error('Failed to delete product with id: ' + req.params.id);
            res.sendStatus(500);
            return;
        }

        logger.log('Deleted product with id: ' + req.params.id);
    });

    res.sendStatus(200);
});

module.exports = router;