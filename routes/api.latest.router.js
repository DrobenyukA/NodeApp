const express = require('express');
const { check } = require('express-validator');

const { API } = require('../constants/routes');
const { validateId } = require('../middlewares/validation');
const withProductImage = require('../middlewares/withProductImage');
const authController = require('../controllers/api/latest/auth.controller');
const productsController = require('../controllers/api/latest/products.controller');
const { validateBook, validateBookImageAlt } = require('../middlewares/validation/product.validation');
const { validateRegistrationForm } = require('../middlewares/validation/user.validation');
const forAdmin = require('../middlewares/forAdmin');

const router = express.Router();
const { PRODUCTS, AUTH, CHAT } = API.LATEST;

router.get(PRODUCTS.BASE, productsController.readProducts);
router.post(PRODUCTS.BASE, forAdmin, validateBook(check), productsController.createProduct);
router.put(PRODUCTS.BASE, forAdmin, validateId(check), validateBook(check), productsController.updateProduct);
router.post(
    PRODUCTS.IMAGE,
    forAdmin,
    validateBookImageAlt(check),
    withProductImage,
    productsController.uploadProductImage,
);
router.get(PRODUCTS.PRODUCT, productsController.readProduct);
router.delete(PRODUCTS.PRODUCT, forAdmin, productsController.deleteProduct);

router.post(AUTH.LOGIN, authController.login);
router.post(AUTH.LOGOUT, authController.logout);
router.post(AUTH.REGISTER, validateRegistrationForm(check), authController.register);

module.exports = router;
