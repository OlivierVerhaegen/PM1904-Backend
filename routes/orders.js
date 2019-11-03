const logger = require('../logger');
const express = require('express');
const session = require('express-session');
const router = express.Router();

const SQLConnection = require('../database');

//--------------------------------------------------------------------------------------
//                                         GET REQUESTS
//--------------------------------------------------------------------------------------
function getOrders() {
    const queryString = 'SELECT * FROM orders';
    SQLConnection().query(queryString, (err, rows, fields) => {
        if (err) {
            logger.error('Failed to get orders from database.');
            return {
                error: 'Failed to get order from database.'
            };
        }

        return rows;
    });
}

router.get('/', (req, res) => {
    if (req.session.loggedin) {
        logger.log('Getting orders from database...');

        res.json(getOrders());
    }
    else {
        logger.error('User is not logged in!');
        res.json({
            error: 'You need to be logged in to access orders.'
        });
    }
});

function getOrdersById(id) {
    const queryString = 'SELECT * FROM orders WHERE id = ?';
    SQLConnection().query(queryString, [req.params.id], (err, rows, fields) => {
        if (err) {
            logger.error('Failed to get order with id ' + id + ' from database.');
            return {
                error: 'Failed to get order with id ' + id + ' from database.'
            }
        }

        return rows;
    });
}

router.get('/:id', (req, res) => {
    if (req.session.loggedin) {
        logger.log(`Getting order ${req.params.id} from database ...`)

        res.json(getOrdersById(req.params.id));
    }
    else {
        logger.error('User is not logged in!');
        res.json({
            error: 'You need to be logged in to access orders.'
        });
    }
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