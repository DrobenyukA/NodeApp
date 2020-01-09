const express = require('express');
const { check } = require('express-validator');

const ROUTES = require('../constants/routes');
const ProductsController = require('../controllers/products.controller');

const router = express.Router();
const forUser = require('../middlewares/forUser');
const forAdmin = require('../middlewares/forAdmin');
const validateBook = require('../middlewares/validation/product.validation');

router.get(ROUTES.ADMIN.CREATE_PRODUCT, forUser, forAdmin, ProductsController.renderProductForm);

router.post(ROUTES.ADMIN.CREATE_PRODUCT, forUser, forAdmin, validateBook(check), ProductsController.storeProduct);

router.post(ROUTES.ADMIN.UPDATE_PRODUCT, forUser, forAdmin, validateBook(check), ProductsController.updateProduct);

router.post(ROUTES.ADMIN.DELETE_PRODUCT, forUser, forAdmin, ProductsController.deleteProduct);

router.get(ROUTES.ADMIN.EDIT_PRODUCT, forUser, forAdmin, ProductsController.editProduct);

router.use(ROUTES.ADMIN.BASE, forUser, forAdmin, ProductsController.handleProductNotFound);

module.exports = router;
