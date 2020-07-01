const express = require('express');
const { check } = require('express-validator');

const { API } = require('../constants/routes');
const productsController = require('../controllers/api/latest/products.controller');
const { validateId } = require('../middlewares/validation');
const { validateBook, validateBookImageAlt } = require('../middlewares/validation/product.validation');
const withProductImage = require('../middlewares/withProductImage');

const router = express.Router();

router.get(API.LATEST.PRODUCTS.BASE, productsController.readProducts);
router.post(API.LATEST.PRODUCTS.BASE, validateBook(check), productsController.createProduct);
router.put(API.LATEST.PRODUCTS.BASE, validateId(check), validateBook(check), productsController.updateProduct);

router.post(
    API.LATEST.PRODUCTS.IMAGE,
    validateBookImageAlt(check),
    withProductImage,
    productsController.uploadProductImage,
);

router.get(API.LATEST.PRODUCTS.PRODUCT, productsController.readProduct);

module.exports = router;
