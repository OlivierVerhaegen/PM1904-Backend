const express = require('express');
const path = require('path');

const productRoutes = require('./products');
const orderRoutes = require('./orders');
const userRoutes = require('./user');

const router = express.Router();

router.use('/login', (req, res) => {
    res.sendFile('login.html', {root: path.join(__dirname, '../public')});
})

router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/user', userRoutes);

module.exports = router;