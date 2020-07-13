const { isEmpty } = require('lodash');
const { validationResult } = require('express-validator');

const ROUTES = require('../constants/routes');
const ProductModel = require('../models/product.model');
const ProductsController = require('../controllers/products.controller');
const { getErrors } = require('../utils/errors');

const getCart = ({ user, ...req }, res) =>
    user
        .getCart()
        .then(({ products, totalPrice }) => {
            return res.render('pages/cart', {
                path: req.path,
                pageTitle: 'Cart',
                pageHeader: 'My Products',
                products,
                totalPrice,
                actions: {
                    deleteFromCart: ROUTES.CART.DELETE_ITEM,
                    orderNow: ROUTES.ORDERS.CHECKOUT,
                },
                user,
            });
        })
        .catch(({ message }) => {
            res.render('error', {
                path: req.path,
                pageTitle: 'Cart',
                pageHeader: 'Error on getting to cart',
                message,
                user,
            });
        });

const addToCart = ({ user, ...req }, res) => {
    const { productId, quantity } = req.body;
    const errors = getErrors(validationResult(req).array());

    return new Promise((res, rej) => {
        if (isEmpty(errors)) {
            res(ProductModel.findById(productId));
        } else {
            rej(new Error(errors.productId || errors.quantity));
        }
    })
        .then((product) => {
            if (product) {
                return user.addToCart(product, +quantity).then(() => res.redirect(ROUTES.PRODUCTS.BASE));
            }
            return ProductsController.handleProductNotFound();
        })
        .catch(({ message }) => {
            res.render('error', {
                path: req.path,
                pageTitle: 'Cart',
                pageHeader: 'Error on adding to cart',
                message,
                user,
            });
        });
};

const deleteItem = ({ user, ...req }, res) => {
    const { productId, quantity } = req.body;

    return user
        .deleteFromCart(productId, quantity)
        .then(() => res.redirect(ROUTES.CART.BASE))
        .catch(({ message }) =>
            res.render('error', {
                path: req.path,
                pageTitle: 'Cart',
                pageHeader: 'Error on adding to cart',
                message,
                user,
            }),
        );
};

module.exports = {
    getCart,
    addToCart,
    deleteItem,
};
