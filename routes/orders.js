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
        logger.info('Getting orders from database...');

        res.json(getOrders());
    }
    else {
        logger.error('User is not logged in!');
        res.status(401).json({
            error: 'You need to be logged in to access orders.'
        });
    }
});

function getOrdersById(id) {
    const queryString = 'SELECT * FROM orders WHERE id = ?';
    SQLConnection().query(queryString, [id], (err, rows, fields) => {
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
        logger.info(`Getting order ${req.params.id} from database ...`)

        res.json(getOrdersById(req.params.id));
    }
    else {
        logger.error('User is not logged in!');
        res.status(401).json({
            error: 'You need to be logged in to access orders.'
        });
    }
});


//--------------------------------------------------------------------------------------
//                                         POST REQUESTS
//--------------------------------------------------------------------------------------
router.post('/create', (req, res) => {
    if (req.session.loggedin) {
        logger.info('Creating order');

        const productId = req.body.productId;
        const userId = req.body.userId;
        const status = req.body.status ? req.body.status : 'busy';
        const quantity = req.body.quantity;
        const price = req.body.price;
    
    
        if (!productId || !userId || !status || !quantity || !price) {
            res.redirect(500, '/?status=error');
            logger.error('Failed to instert new order: some fields where empty.');
            return;
        }
    
        const queryString = 'INSERT INTO orders (productId, userId, status, quantity, price) VALUES (?, ?, ?, ?, ?)';
        SQLConnection().query(
            queryString,
            [   
                productId,
                userId,
                status,
                quantity,
                price
            ],
            (err, result, fields) => {
                if (err) {
                    logger.error('Failed to insert new order: ' + err);
                    res.redirect(500, '/?status=error');
                    return;
                } 
    
                logger.success('Inserted new order with id: ' + result.insertId);
                res.redirect(201 ,'/?status=success');
            }
        );
    }
    else {
        logger.error('User is not logged in!');
        res.status(401).json({
            error: 'You need to be logged in to access orders.'
        });
    }
})

//--------------------------------------------------------------------------------------
//                                         UPDATE REQUESTS
//--------------------------------------------------------------------------------------
router.patch('/:id', (req, res) => {
    if (req.session.loggedin) {
        logger.info('Updating order with id: ' + req.params.id);

        const status = req.body.status ? req.body.status : 'busy';
        const quantity = req.body.quantity;
        const price = req.body.price;
    
    
        if (!status || !quantity || !price) {
            res.redirect(500, '/?status=error');
            logger.error('Failed to instert new order: some fields where empty.');
            return;
        }
    
        const queryString = 'UPDATE orders SET status = ?, quantity = ?, price = ? WHERE id = ?';
        SQLConnection().query(
          queryString,
          [
            status,
            quantity,
            price,
            req.params.id
          ],
          (err, result, fields) => {
              if (err) {
                  logger.error('Failed to update order with id: ' + req.params.id)
                  logger.error(err);
                  res.redirect(500, '/?status=error');
                  return;
              }
    
              logger.success('Updated order with id: ' + req.params.id);
              res.redirect(201, '/?status=success');
          }
        );
    }
    else {
        logger.error('User is not logged in!');
        res.status(401).json({
            error: 'You need to be logged in to access orders.'
        });
    }
});


//--------------------------------------------------------------------------------------
//                                         DELETE REQUESTS
//--------------------------------------------------------------------------------------
router.delete('/:id', (req, res) => {
    if (req.session.loggedin) {
        logger.info('Deleting order with id: ' + req.params.id);

        const queryString = 'DELETE FROM orders WHERE id = ?';
        SQLConnection().query(queryString, [req.params.id], (err, reslut, fields) => {
            if (err) {
                logger.error('Failed to delete order with id: ' + req.params.id);
                res.redirect(500, '/?status=error');
                return;
            }
    
            logger.success('Deleted order with id: ' + req.params.id);
            res.redirect(200, '/?status=success');
        });
    }
    else {
        logger.error('User is not logged in!');
        res.status(401).json({
            error: 'You need to be logged in to access orders.'
        });
    }
});

module.exports = router;