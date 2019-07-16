const express = require('express');

const ROUTES = require('../constants/routes');
const ProductsController = require('../controllers/products.controller');
const ShopController = require('../controllers/shop.controller');

const router = express.Router();

router.get(ROUTES.ROOT, ShopController.getIndex);

router.get(ROUTES.PRODUCTS.PRODUCT, ProductsController.getProduct);

router.get(ROUTES.PRODUCTS.BASE, ProductsController.getProducts);

router.get(ROUTES.ORDERS.BASE, ShopController.getOrders);

router.post(ROUTES.ORDERS.BASE, ShopController.createOrder);

module.exports = router;
