const express = require('express');
const { check } = require('express-validator');

const ROUTES = require('../constants/routes');
const CartController = require('../controllers/cart.controller');
const forUser = require('../middlewares/forUser');
const { validateProduct } = require('../middlewares/validation/cart.validation');

const router = express.Router();

router.get(ROUTES.CART.BASE, forUser, CartController.getCart);

router.post(ROUTES.CART.BASE, forUser, validateProduct(check), CartController.addToCart);
router.post(ROUTES.CART.DELETE_ITEM, forUser, validateProduct(check), CartController.deleteItem);

module.exports = router;
