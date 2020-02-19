const express = require('express');
const { check } = require('express-validator');

const ROUTES = require('../constants/routes');
const ProductsController = require('../controllers/products.controller');
const forUser = require('../middlewares/forUser');
const forAdmin = require('../middlewares/forAdmin');
const { validateId } = require('../middlewares/validation');
const { validateBook } = require('../middlewares/validation/product.validation');

const router = express.Router();

router.get(ROUTES.PRODUCTS.BASE, ProductsController.getProducts);
router.get(ROUTES.PRODUCTS.CREATE, forUser, forAdmin, ProductsController.renderProductForm);
router.get(ROUTES.PRODUCTS.EDIT, forUser, forAdmin, validateId(check), ProductsController.editProduct);
router.get(ROUTES.PRODUCTS.PRODUCT, validateId(check), ProductsController.getProduct);

router.post(ROUTES.PRODUCTS.CREATE, forUser, forAdmin, validateBook(check), ProductsController.storeProduct);
router.post(ROUTES.PRODUCTS.UPDATE, forUser, forAdmin, validateBook(check), ProductsController.updateProduct);
router.post(ROUTES.PRODUCTS.DELETE, forUser, forAdmin, validateId(check), ProductsController.deleteProduct);

module.exports = router;
