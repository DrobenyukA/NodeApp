const express = require('express');

const adminRouter = require('./admin.router');
const shopRouter = require('./shop.router');
const cartRouter = require('./cart.router');
const authRouter = require('./auth.router');
const PageController = require('../controllers/page.controller');
const router = express.Router();

router.use(adminRouter);
router.use(authRouter);
router.use(shopRouter);
router.use(cartRouter);
router.use(PageController.handlePageNotFound);

module.exports = router;
