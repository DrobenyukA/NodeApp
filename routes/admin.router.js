const express = require('express');

const ROUTES = require('../constants/routes');
const ProductsController = require('../controllers/products.controller');

const router = express.Router();

router.get(ROUTES.ADMIN.CREATE_PRODUCT, ProductsController.createProduct);

router.post(ROUTES.ADMIN.CREATE_PRODUCT, ProductsController.storeProduct);

router.post(ROUTES.ADMIN.UPDATE_PRODUCT, ProductsController.storeProduct);

router.post(ROUTES.ADMIN.DELETE_PRODUCT, ProductsController.deleteProduct);

router.get(ROUTES.ADMIN.EDIT_PRODUCT, ProductsController.editProduct);

router.use(ROUTES.ADMIN.BASE, ProductsController.handleProductNotFound);

module.exports = router;
