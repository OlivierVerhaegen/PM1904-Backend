const logger = require('../logger');
const express = require('express');
const router = express.Router();

const SQLConnection = require('../database');

//--------------------------------------------------------------------------------------
//                                         GET REQUESTS
//--------------------------------------------------------------------------------------
router.get('/', (req, res) => {
    logger.log('Getting orders from database...');

    const queryString = 'SELECT * FROM orders';
    SQLConnection().query(queryString, (err, rows, fields) => {
        if (err) {
            logger.error('Failed to get orders from database.');
            res.sendStatus(500);
            return;
        }

        res.json(rows);
    });
});

router.get(':id', (req, res) => {
    logger.log(`Getting order ${req.params.id} from database ...`)

    const queryString = 'SELECT * FROM orders WHERE id = ?';
    SQLConnection().query(queryString, [req.params.id], (err, rows, fields) => {
        if (err) {
            logger.error('Failed to get order from database.');
            res.sendStatus(500);
            return;
        }

        res.json(rows);
    })
});


//--------------------------------------------------------------------------------------
//                                         POST REQUESTS
//--------------------------------------------------------------------------------------
router.post('/create', (req, res) => {
    logger.log('Creating order' + req.body.orderNumber);

    const queryString = 'INSERT INTO orders (orderNumber, products, subtotal) VALUES (?, ?, ?)';
    SQLConnection().query(
        queryString,
        [   req.body.orderNumber,
            req.body.products,
            req.body.subtotal
        ], (err, result, fields) => {
            if (err) {
                logger.error('Failed to insert new user: ' + err);
                res.sendStatus(500);
                return;
            } 

            logger.log('Inserted new order with id: ' + result.insertId)
        });
    
    res.sendStatus(200);
})

//--------------------------------------------------------------------------------------
//                                         UPDATE REQUESTS
//--------------------------------------------------------------------------------------



//--------------------------------------------------------------------------------------
//                                         DELETE REQUESTS
//--------------------------------------------------------------------------------------

module.exports = router;