const express = require('express');
const { check } = require('express-validator');

const ROUTES = require('../constants/routes');
const ProductsController = require('../controllers/products.controller');
const forUser = require('../middlewares/forUser');
const forAdmin = require('../middlewares/forAdmin');
const { validateId } = require('../middlewares/validation');

const router = express.Router();

router.get(ROUTES.PRODUCTS.BASE, ProductsController.renderProducts);
router.get(ROUTES.PRODUCTS.CREATE, forUser, forAdmin, ProductsController.renderProductForm);
router.get(ROUTES.PRODUCTS.EDIT, forUser, forAdmin, validateId(check), ProductsController.renderProductEditForm);
router.get(ROUTES.PRODUCTS.PRODUCT, validateId(check), ProductsController.renderProduct);

module.exports = router;
