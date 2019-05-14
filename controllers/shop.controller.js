const ProductModel = require('../models/product.model');

const user = {
    isAdmin: false,
};

const getIndex = (req, res) => {
    ProductModel.findAll({
        order: [['createdAt', 'DESC']],
        limit: 8,
    })
        .then((products) =>
            res.render('shop/index', {
                path: req.path,
                pageTitle: 'Home page',
                pageHeader: 'Home page',
                products,
                user,
            }),
        )
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
    getOrders,
    checkout,
};
