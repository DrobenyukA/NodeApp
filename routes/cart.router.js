const express = require('express');

const ROUTES = require('../constants/routes');
const CartController = require('../controllers/cart.controller');
const router = express.Router();

router.get(ROUTES.CART.BASE, CartController.getCart);

router.post(ROUTES.CART.BASE, CartController.addToCart);
router.post(ROUTES.CART.DELETE_ITEM, CartController.deleteItem);

module.exports = router;
