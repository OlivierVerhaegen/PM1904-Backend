const logger = require('../logger');
const express = require('express');
const router = express.Router();

const SQLConnection = require('../database');

//--------------------------------------------------------------------------------------
//                                         GET REQUESTS
//--------------------------------------------------------------------------------------
router.get('/', (req, res) => {
    logger.info('Getting products from database...');

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
    logger.info(`Getting product ${req.params.id} from database...`);

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
    logger.info('Creating product: ' + req.body.name);

    // Convert checkbox value to boolean.
    if (req.body.available == 'on') {
        req.body.available = true;
    } else {
        req.body.available = false;
    }

    const queryString = 'INSERT INTO products (name, price, photoUrl, allergens, description, available) VALUES (?, ?, ?, ?, ?, ?)';
    SQLConnection().query(
        queryString,
        [   req.body.name,
            req.body.price,
            req.body.photoUrl,
            req.body.allergens,
            req.body.description,
            req.body.available
        ], (err, result, fields) => {
            if (err) {
                logger.error('Failed to insert new product: ' + err);
                res.sendStatus(500);
                return;
            } 

            logger.success('Inserted new product with id: ' + result.insertId)
            res.sendStatus(201);
        });
});


//--------------------------------------------------------------------------------------
//                                         UPDATE REQUESTS
//--------------------------------------------------------------------------------------
router.patch('/:id', (req, res) => {
    logger.info('Updating product with id: ' + req.params.id);

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

            logger.success('Updated product with id: ' + req.params.id);
            res.sendStatus(200);
        }
    );
});

//--------------------------------------------------------------------------------------
//                                         DELETE REQUESTS
//--------------------------------------------------------------------------------------
router.delete('/:id', (req, res) => {
    logger.info('Deleting product with id: ' + req.params.id);

    const queryString = 'DELETE FROM products WHERE id = ?';
    SQLConnection().query(queryString, [req.params.id], (err, result, fields) => {
        if (err) {
            logger.error('Failed to delete product with id: ' + req.params.id);
            res.sendStatus(500);
            return;
        }

        logger.success('Deleted product with id: ' + req.params.id);
        res.sendStatus(200);
    });
});

module.exports = router;