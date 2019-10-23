const express = require('express');

const productRoutes = require('./products');
const orderRoutes = require('./orders');
const userRoutes = require('./user');

const router = express.Router();

router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/user', userRoutes);

module.exports = router;