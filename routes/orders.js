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
            logger.error('Failed to get orders from database.');
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

    const id = req.body.orderId;
    const productId = req.body.productId;
    const userId = req.body.userId;
    const status = req.body.status ? req.body.status : 'busy';
    const quantity = req.body.quantity;
    const price = req.body.price;


    if (!id || !productId || ! userId || !status || !quantity || !price) {
        res.redirect('/?status=error');
        logger.error('Failed to instert new order: some fields where empty.');
        return;
    }

    const queryString = 'INSERT INTO orders (id, productId, userId, status, quantity, price) VALUES (?, ?, ?, ?, ?, ?)';
    SQLConnection().query(
        queryString,
        [   
            id,
            productId,
            userId,
            status,
            quantity,
            price
        ],
        (err, result, fields) => {
            if (err) {
                logger.error('Failed to insert new order: ' + err);
                res.status(500).redirect('/?status=error');
                return;
            } 

            logger.success('Inserted new order with id: ' + result.insertId);
            res.status(201).redirect('/?status=success');
        }
    );
})

//--------------------------------------------------------------------------------------
//                                         UPDATE REQUESTS
//--------------------------------------------------------------------------------------
router.patch('/:id', (req, res) => {
    logger.log('Updating order with id: ' + req.params.id);

    const id = req.body.orderId;
    const status = req.body.status ? req.body.status : 'busy';
    const quantity = req.body.quantity;
    const price = req.body.price;


    if (!id || !status || !quantity || !price) {
        res.redirect('/?status=error');
        logger.error('Failed to instert new order: some fields where empty.');
        return;
    }

    const queryString = 'UPDATE orders status = ?, quantity = ?, price = ? WHERE id = ?';
    SQLConnection().query(
      queryString,
      [
        status,
        quantity,
        price,
        id
      ],
      (err, result, fields) => {
          if (err) {
              logger.error('Failed to update order with id: ' + req.params.id)
              res.status(500).redirect('/?status=error');
              return;
          }

          logger.success('Updated order with id: ' + req.params.id);
          res.status(200).redirect('/?status=success');
      }
    );
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
            res.status(500).redirect('/?status=error');
            return;
        }

        logger.success('Deleted order with id: ' + req.params.id);
        res.status(200).redirect('/?status=success');
    });
});

module.exports = router;