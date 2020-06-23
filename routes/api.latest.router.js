const express = require('express');

const { API } = require('../constants/routes');
const productsController = require('../controllers/api/latest/products.controller');

const router = express.Router();

router.get(API.LATEST.PRODUCTS.BASE, productsController.readProducts);
router.post(API.LATEST.PRODUCTS.BASE, productsController.createProduct);

router.post(API.LATEST.PRODUCTS.IMAGE, productsController.uploadProductImage);
router.put(API.LATEST.PRODUCTS.IMAGE, productsController.updateProductImage);

module.exports = router;
