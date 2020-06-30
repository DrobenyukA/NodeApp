const express = require('express');

const productsRouter = require('./products.router');
const shopRouter = require('./shop.router');
const cartRouter = require('./cart.router');
const authRouter = require('./auth.router');
const PageController = require('../controllers/page.controller');
const router = express.Router();

router.use(productsRouter);
router.use(authRouter);
router.use(shopRouter);
router.use(cartRouter);
router.use(PageController.handlePageNotFound);
router.use(PageController.handleServerError);

module.exports = router;
