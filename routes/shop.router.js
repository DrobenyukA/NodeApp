const express = require('express');

const ROUTES = require('../constants/routes');
const ShopController = require('../controllers/shop.controller');

const router = express.Router();

const forUser = require('../middlewares/forUser');

router.get(ROUTES.ROOT, ShopController.getIndex);

router.get(ROUTES.ORDERS.BASE, forUser, ShopController.getOrders);

router.get(ROUTES.ORDERS.CHECKOUT_SUCCESS, forUser, ShopController.createOrder);

router.get(ROUTES.ORDERS.CHECKOUT_FAILED, forUser, ShopController.renderCheckoutPage);

router.get(ROUTES.ORDERS.CHECKOUT, forUser, ShopController.renderCheckoutPage);

router.get(ROUTES.ORDERS.INVOICE, forUser, ShopController.downloadInvoice);
// There is no need to validate this request because we will retrieve all data from the database.
router.post(ROUTES.ORDERS.BASE, forUser, ShopController.createOrder);

module.exports = router;
