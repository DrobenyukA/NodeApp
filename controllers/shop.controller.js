const ProductModel = require('../models/product.model');
const ROUTES = require('../constants/routes');

const user = {
    isAdmin: false,
};

const getIndex = (req, res) => {
    ProductModel.getAll()
        .then((products) => {
            res.render('shop/index', {
                path: req.path,
                pageTitle: 'Home page',
                pageHeader: 'Home page',
                products,
                user,
                actions: {
                    addToCart: ROUTES.CART.BASE,
                    editProduct: ROUTES.ADMIN.EDIT_PRODUCT,
                    deleteProduct: ROUTES.ADMIN.DELETE_PRODUCT,
                },
            });
        })
        .catch(({ message }) =>
            res.render('error', {
                path: req.param,
                pageTitle: 'Error',
                pageHeader: 'Sorry, something went wrong.',
                message,
                user,
            }),
        );
};

const getCart = (req, res) => {
    res.render('shop/cart', {
        path: req.path,
        pageTitle: 'Cart',
        pageHeader: 'Cart',
        user,
    });
};

const getOrders = (req, res) => {
    res.render('shop/orders', {
        path: req.path,
        pageTitle: 'Orders',
        pageHeader: 'Orders',
        user,
    });
};

const checkout = (req, res) => {
    res.render('shop/checkout', {
        path: req.path,
        pageTitle: 'Checkout',
        pageHeader: 'Checkout',
        user,
    });
};

module.exports = {
    getIndex,
    getCart,
    getOrders,
    checkout,
};
