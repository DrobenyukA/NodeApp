const express = require('express');

const ROUTES = require('../constants/routes');
const ProductsController = require('../controllers/products');
const ShopController = require('../controllers/shop');

const router = express.Router();

router.get(ROUTES.ROOT, ShopController.getIndex);

router.get(ROUTES.CART.BASE, ShopController.getCart);

router.get(ROUTES.ORDERS.BASE, ShopController.getOrders);

router.get(ROUTES.CHECKOUT.BASE, ShopController.checkout);

router.get(ROUTES.PRODUCTS.BASE, ProductsController.getProducts);

module.exports = router;
