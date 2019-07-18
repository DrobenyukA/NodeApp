const express = require('express');

const ROUTES = require('../constants/routes');
const CartController = require('../controllers/cart.controller');
const router = express.Router();
const forUser = require('../middlewares/forUser');

router.get(ROUTES.CART.BASE, forUser, CartController.getCart);

router.post(ROUTES.CART.BASE, forUser, CartController.addToCart);
router.post(ROUTES.CART.DELETE_ITEM, forUser, CartController.deleteItem);

module.exports = router;
