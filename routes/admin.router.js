const express = require('express');

const ROUTES = require('../constants/routes');
const ProductsController = require('../controllers/products.controller');

const router = express.Router();
const forUser = require('../middlewares/forUser');
const forAdmin = require('../middlewares/forAdmin');

router.get(ROUTES.ADMIN.CREATE_PRODUCT, forUser, forAdmin, ProductsController.createProduct);

router.post(ROUTES.ADMIN.CREATE_PRODUCT, forUser, forAdmin, ProductsController.storeProduct);

router.post(ROUTES.ADMIN.UPDATE_PRODUCT, forUser, forAdmin, ProductsController.updateProduct);

router.post(ROUTES.ADMIN.DELETE_PRODUCT, forUser, forAdmin, ProductsController.deleteProduct);

router.get(ROUTES.ADMIN.EDIT_PRODUCT, forUser, forAdmin, ProductsController.editProduct);

router.use(ROUTES.ADMIN.BASE, forUser, forAdmin, ProductsController.handleProductNotFound);

module.exports = router;
