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

router.get('/:id', (req, res) => {
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
    logger.log('Creating order ' + req.body.orderNumber);

    const queryString = 'INSERT INTO orders (orderNumber, productId, studentId) VALUES (?, ?, ?)';
    SQLConnection().query(
        queryString,
        [   req.body.orderNumber,
            req.body.products,
            req.body.subtotal
        ],
        (err, result, fields) => {
            if (err) {
                logger.error('Failed to insert new order: ' + err);
                res.sendStatus(500);
                return;
            } 

            logger.log('Inserted new order with id: ' + result.insertId)
        }
    );
    
    res.sendStatus(201);
})

//--------------------------------------------------------------------------------------
//                                         UPDATE REQUESTS
//--------------------------------------------------------------------------------------
router.patch('/:id', (req, res) => {
    logger.log('Updating order with id: ' + req.params.id);

    const queryString = 'UPDATE orders SET orderNumber = ?, products = ?, subtotal = ? WHERE id = ?';
    SQLConnection().query(
      queryString,
      [
          req.body.orderNumber,
          req.body.products,
          req.body.subtotal,
          req.params.id
      ],
      (err, result, fields) => {
          if (err) {
              logger.error('Failed to update order with id: ' + req.params.id)
              res.sendStatus(500);
              return;
          }

          logger.log('Updated order with id: ' + req.params.id);
      }
    );

    res.sendStatus(200);
});


//--------------------------------------------------------------------------------------
//                                         DELETE REQUESTS
//--------------------------------------------------------------------------------------
router.delete('/:id', (req, res) => {
    logger.log('Deleting order with id: ' + req.params.id);

    const queryString = 'DELETE FROM orders WHERE id = ?';
    SQLConnection().query(queryString, [req.params.id], (err, reslut, fields) => {
        if (err) {
            logger.error('Failed to delete order with id: ' + req.params.id);
            res.sendStatus(500);
            return;
        }

        logger.log('Deleted order with id: ' + req.params.id);
    });

    res.sendStatus(200);
});

module.exports = router;