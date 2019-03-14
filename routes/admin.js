const express = require('express');

const ROUTES = require('../constants/routes');
const ProductsController = require('../controllers/products');

const router = express.Router();

router.get(ROUTES.ADMIN.ADD_PRODUCT, ProductsController.getProductForm);

router.post(ROUTES.ADMIN.ADD_PRODUCT, ProductsController.storeProduct);

router.use(ROUTES.ADMIN.BASE, ProductsController.handleProductNotFound);

module.exports = router;
