const logger = require('../logger');
const express = require('express');
const session = require('express-session');
const router = express.Router();

const SQLConnection = require('../database');

//--------------------------------------------------------------------------------------
//                                         GET REQUESTS
//--------------------------------------------------------------------------------------
function getProducts() {
    const queryString = 'SELECT * FROM products';
    SQLConnection().query(queryString, (err, rows, fields) => {
        if (err) {
            logger.error('Failed to get products from database. ' + err);
            return {
                error: 'Failed to get products from database. ' + err
            };
        }

        return rows;
    });
}

router.get('/', (req, res) => {
    if (req.session.loggedin) {
        logger.info('Getting products from database...');

        res.json(getProducts());
    }
    else {
        logger.error('User is not logged in!');
        res.json({
            error: 'You need to be logged in to access products.'
        });
    }
});

function getProductById(id) {
    const queryString = 'SELECT * FROM products WHERE id = ?';
    SQLConnection().query(queryString, [id], (err, rows, fields) => {
        if (err) {
            logger.error('Failed to get product with id: ' + id + ' from database.');
            return {
                error: 'Failed to get product with id: ' + id + ' from database.'
            };
        }

        return rows;
    });
}

router.get('/:id', (req, res) => {
    if (req.session.loggedin) {
        logger.info(`Getting product ${req.params.id} from database...`);

        res.json(getProductById(req.params.id));
    }
    else {
        logger.error('User is not logged in!');
    }
});


//--------------------------------------------------------------------------------------
//                                         POST REQUESTS
//--------------------------------------------------------------------------------------
router.post('/create', (req, res) => {
    if (req.session.loggedin) {
        // Convert checkbox value to boolean.
        if (req.body.available == 'on') {
            req.body.available = true;
        } else {
            req.body.available = false;
        }

        const name = req.body.name;
        const price = req.body.price;
        const photoUrl = req.body.photoUrl;
        const allergens = req.body.allergens;
        const description = req.body.description;
        const available = req.body.available;

        if (!name || !price || !photoUrl || !description) {
            res.redirect('/?status=error');
            logger.error('Failed to instert new product: some fields where empty.');
            return;
        }

        logger.info('Creating product: ' + req.body.name);

        const queryString = 'INSERT INTO products (name, price, photoUrl, allergens, description, available) VALUES (?, ?, ?, ?, ?, ?)';
        SQLConnection().query(
            queryString,
            [
                name,
                price,
                photoUrl,
                allergens,
                description,
                available
            ], (err, result, fields) => {
                if (err) {
                    logger.error('Failed to insert new product: ' + err);
                    res.status(500).redirect('/?status=error');
                    return;
                }

                logger.success('Inserted new product with id: ' + result.insertId)
                res.status(201).redirect('/?status=success');
            });
    }
    else {
        logger.error('User is not logged in!');
        res.end();
        return;
    }
});


//--------------------------------------------------------------------------------------
//                                         UPDATE REQUESTS
//--------------------------------------------------------------------------------------
router.patch('/:id', (req, res) => {
    if (req.session.loggedin) {
        // Convert checkbox value to boolean.
        if (req.body.available == 'on') {
            req.body.available = true;
        } else {
            req.body.available = false;
        }

        const name = req.body.name;
        const price = req.body.price;
        const photoUrl = req.body.photoUrl;
        const allergens = req.body.allergens;
        const description = req.body.description;
        const available = req.body.available;

        if (!name || !price || !photoUrl || !description) {
            res.redirect('/?status=error');
            logger.error('Failed to instert new product: some fields where empty.');
            return;
        }

        logger.info('Updating product with id: ' + req.params.id);

        const queryString = 'UPDATE products SET name = ?, price = ?, photoUrl = ?, allergens = ?, description = ?, available = ? WHERE id = ?';
        SQLConnection().query(
            queryString,
            [
                name,
                price,
                photoUrl,
                allergens,
                description,
                available
            ],
            (err, result, fields) => {
                if (err) {
                    logger.error('Failed to update product with id: ' + req.params.id);
                    res.status(500).redirect('/?status=error');
                    return;
                }

                logger.success('Updated product with id: ' + req.params.id);
                res.status(200).redirect('/?status=success');
            }
        );
    }
    else {
        logger.error('User is not logged in!');
    }
});

//--------------------------------------------------------------------------------------
//                                         DELETE REQUESTS
//--------------------------------------------------------------------------------------
router.delete('/:id', (req, res) => {
    if (req.session.loggedin) {
        logger.info('Deleting product with id: ' + req.params.id);

        const queryString = 'DELETE FROM products WHERE id = ?';
        SQLConnection().query(queryString, [req.params.id], (err, result, fields) => {
            if (err) {
                logger.error('Failed to delete product with id: ' + req.params.id);
                res.status(500).redirect('/?status=error');
                return;
            }

            logger.success('Deleted product with id: ' + req.params.id);
            res.status(200).redirect('/?status=success');
        });
    }
    else {
        logger.error('User is not logged in!');
    }
});

module.exports = router;