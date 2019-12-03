const logger = require('../logger');
const express = require('express');
const session = require('express-session');
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
            logger.error('Failed to get products from database. ' + err);
            res.json({
                error: 'Failed to get products from database. ' + err
            });
        }
        res.json(rows);
    });
});

router.get('/:id', (req, res) => {
    logger.info(`Getting product ${req.params.id} from database...`);

    const queryString = 'SELECT * FROM products WHERE id = ?';
    SQLConnection().query(queryString, [req.params.id], (err, rows, fields) => {
        if (err) {
            logger.error('Failed to get product with id: ' + req.params.id + ' from database.');
            res.json({
                error: 'Failed to get product with id: ' + req.params.id + ' from database.'
            });
        }

        res.json(rows);
    });
});


//--------------------------------------------------------------------------------------
//                                         POST REQUESTS
//--------------------------------------------------------------------------------------
router.post('/create', (req, res) => {
    if (req.session.loggedin) {
        const name = req.body.name;
        const price = req.body.price;
        const photoUrl = req.body.photoUrl;
        const allergens = req.body.allergens;
        const description = req.body.description;
        const available = req.body.available;

        if (!name || !price || !photoUrl || !description) {
            res.redirect(500, '/?status=error');
            logger.error('Failed to instert new product: some fields where empty.');
            res.end();
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
                    res.redirect(500, '/?status=error');
                    return;
                }

                logger.success('Inserted new product with id: ' + result.insertId)
                res.redirect(201, '/?status=success');
            });
    }
    else {
        logger.error('User is not logged in!');
        res.status(401).json({
            error: 'You need to be logged in to access products.'
        });
        res.end();
    }
});


//--------------------------------------------------------------------------------------
//                                         UPDATE REQUESTS
//--------------------------------------------------------------------------------------
router.patch('/:id', (req, res) => {
    if (req.session.loggedin) {
        console.log(req.body);
        const name = req.body.name;
        const price = req.body.price;
        const photoUrl = req.body.photoUrl;
        const allergens = req.body.allergens;
        const description = req.body.description;
        const available = req.body.available;

        if (!name || !price || !photoUrl || !description) {
            res.redirect('/?status=error');
            logger.error('Failed to instert new product: some fields where empty.');
            res.end();
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
                available,
                req.params.id
            ],
            (err, result, fields) => {
                if (err) {
                    logger.error('Failed to update product with id: ' + req.params.id);
                    logger.error(err);
                    res.redirect(500, '/?status=error');
                    return;
                }

                logger.success('Updated product with id: ' + req.params.id);
                res.redirect(201, '/?status=success');
            }
        );
    }
    else {
        logger.error('User is not logged in!');
        res.status(401).json({
            error: 'You need to be logged in to access products.'
        });
        res.end();
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
                logger.error(err);
                res.redirect(500, '/?status=error');
                return;
            }

            logger.success('Deleted product with id: ' + req.params.id);
            res.redirect(200, '/?status=success');
        });
    }
    else {
        logger.error('User is not logged in!');
        res.status(401).json({
            error: 'You need to be logged in to access products.'
        });
        res.end();
    }
});





module.exports = router;