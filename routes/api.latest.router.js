const express = require('express');

const ROUTES = require('../constants/routes');
const productsController = require('../controllers/api/latest/products.controller');

const router = express.Router();
router.get(ROUTES.API.LATEST.PRODUCTS.replace(ROUTES.API.LATEST.BASE, ''), productsController.readProducts);
router.post(ROUTES.API.LATEST.PRODUCTS.replace(ROUTES.API.LATEST.BASE, ''), productsController.createProduct);

module.exports = router;
