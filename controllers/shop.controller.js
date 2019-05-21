const ProductModel = require('../models/product.model');
const ROUTES = require('../constants/routes');

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
                actions: {
                    addToCart: ROUTES.CART.BASE,
                },
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

const getOrder = (req, res) => {
    res.render('shop/order', {
        path: req.path,
        pageTitle: 'Order',
        pageHeader: 'Order',
        user,
    });
};

const getOrders = (req, res) => {
    req.user
        .getOrders({ include: ['products'] })
        .then((orders) =>
            res.render('shop/orders', {
                path: req.path,
                pageTitle: 'Orders',
                pageHeader: 'Orders',
                user,
                orders,
            }),
        )
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

const createOrder = (req, res) => {
    req.user
        .getCart()
        .then((cart) => cart.getProducts().then((products) => [cart, products]))
        .then(([cart, products]) => {
            if (products.length) {
                return req.user
                    .createOrder()
                    .then((order) =>
                        order.addProducts(
                            products.map((product) => {
                                product.orderItem = {
                                    quantity: product.cartItem.quantity,
                                };
                                return product;
                            }),
                        ),
                    )
                    .then(() => cart.setProducts(null));
            }
            throw new Error('There is no products in the cart!');
        })
        .then(() => res.redirect(ROUTES.ORDERS.BASE))
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
    getOrder,
    getOrders,
    createOrder,
    checkout,
};
