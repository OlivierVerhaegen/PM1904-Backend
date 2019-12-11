const logger = require('../logger');
const express = require('express');
const session = require('express-session');
const router = express.Router();

const SQLConnection = require('../database');

const nodemailer = require('nodemailer');

const uniqid = require('uniqid');

const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: '02c321c1ea572a',
        pass: '6b43d61b29d930'
    }
});

//--------------------------------------------------------------------------------------
//                                         GET REQUESTS
//--------------------------------------------------------------------------------------
router.get('/', (req, res) => {
    if (req.session.loggedin) {
        logger.info('Getting orders from database...');

        const queryString = 'SELECT * FROM orders';
        SQLConnection().query(queryString, (err, rows, fields) => {
            if (err) {
                logger.error('Failed to get orders from database.');
                res.json({
                    error: 'Failed to get order from database.'
                });
            }
    
            res.json(rows);
        });
    }
    else {
        logger.error('User is not logged in!');
        res.status(401).json({
            error: 'You need to be logged in to access orders.'
        });
        res.end();
    }
});

router.get('/:orderId', (req, res) => {
    if (req.session.loggedin) {
        logger.info(`Getting order ${req.params.orderId} from database ...`)

        const queryString = 'SELECT * FROM orders WHERE orderId = ?';
        SQLConnection().query(queryString, [req.params.orderId], (err, rows, fields) => {
            if (err) {
                logger.error('Failed to get order with id ' + req.params.orderId + ' from database.');
                res.json({
                    error: 'Failed to get order with id ' + req.params.orderId + ' from database.'
                });
            }

            let totalPrice = 0;

            rows.forEach(product => {
                totalPrice += product.price;
            });
            
    
            const order = {
                orderId: req.params.orderId,
                totalPrice: totalPrice,
                products: rows,
            };

            res.json(order);
        });
    }
    else {
        logger.error('User is not logged in!');
        res.status(401).json({
            error: 'You need to be logged in to access orders.'
        });
        res.end();
    }
});


//--------------------------------------------------------------------------------------
//                                         POST REQUESTS
//--------------------------------------------------------------------------------------
router.post('/create', (req, res) => {
    logger.info('Creating order');

    const orderId = uniqid.time('order-');
    const productId = req.body.productId;
    const userId = req.body.userId;
    const status = req.body.status ? req.body.status : 'busy';
    const quantity = req.body.quantity;
    const price = req.body.price;

    console.log(productId);


    if (!orderId || !productId || !userId || !status || !quantity || !price) {
        res.redirect(500, '/?status=error');
        logger.error('Failed to instert new order: some fields where empty.');
        res.end();
        return;
    }

    productId.forEach(pid => {
        const queryString = 'INSERT INTO orders (orderId, productId, userId, status, quantity, price) VALUES (?, ?, ?, ?, ?, ?)';
        SQLConnection().query(
            queryString,
            [   
                orderId,
                pid,
                userId,
                status,
                quantity,
                price
            ],
            (err, result, fields) => {
                if (err) {
                    logger.error('Failed to insert new order: ' + err);
                    res.redirect(500, '/?status=error');
                    res.end();
                    return;
                } 
    
                logger.success('Inserted new order with id: ' + result.insertId);
            }
        );
    });

    res.redirect(201 ,'/?status=success');
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
            res.end();
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
                  res.end();
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
        res.end();
    }
});

router.patch('/complete/:orderId', (req, res) => {
    logger.info('Completing order with orderId: ' + req.params.orderId);

    const orderId = req.params.orderId;

    const queryString = 'UPDATE orders SET status = ? WHERE orderId = ?';
    SQLConnection().query(
      queryString,
      [
        'ready',
        orderId
      ],
      (err, result, fields) => {
        if (err) {
            logger.error('Failed to complete order with id: ' + req.params.orderId)
            res.status(500).redirect('/?status=error');
            return;
        }

        logger.success('Completed order with id: ' + req.params.orderId);

        const getUserQueryString = 'SELECT studentNumber FROM user WHERE id IN (SELECT DISTINCT userId FROM orders WHERE orderId = ?)';
        SQLConnection().query(getUserQueryString, [req.params.orderId], (err, rows, fields) => {
            if (err) {
                logger.error('Failed to get order with id ' + req.params.id + ' from database.');
                res.json({
                    error: 'Failed to get order with id ' + req.params.id + ' from database.'
                });
                return;
            }
            logger.info('Sending mail.');
            console.log(rows);
            // Send e-mail.
            const mailOptions = {
                from: '2743fdd7f3-cc499a@inbox.mailtrap.io',
                to: `${rows[0].studentNumber}@ap.be`,
                subject: `HAP bestelling: ${req.params.orderId}`,
                text: 'Uw bestelling bij HAP kan opgehaald worden.'
            }

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) console.log(err);
                console.log(info);
            });
        });

        res.status(200).redirect('/?status=success');
      }
    );
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
                res.end();
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
        res.end();
    }
});

module.exports = router;