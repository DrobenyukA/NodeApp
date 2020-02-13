const ProductModel = require('../models/product.model');
const OrderModel = require('../models/order.model');
const ROUTES = require('../constants/routes');

const getIndex = ({ user, ...req }, res) => {
    ProductModel.find()
        .then((products) => {
            res.render('shop/index', {
                path: req.path,
                pageTitle: 'Home page',
                pageHeader: 'Home page',
                products,
                user,
                actions: {
                    addToCart: ROUTES.CART.BASE,
                    viewProduct: ROUTES.PRODUCTS.PRODUCT,
                    editProduct: ROUTES.PRODUCTS.EDIT,
                    deleteProduct: ROUTES.PRODUCTS.DELETE,
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

const getCart = ({ user, ...req }, res) => {
    res.render('shop/cart', {
        path: req.path,
        pageTitle: 'Cart',
        pageHeader: 'Cart',
        user,
    });
};

const getOrders = ({ user, ...req }, res) => {
    OrderModel.find()
        .then((orders) => {
            return res.render('shop/orders', {
                path: req.path,
                pageTitle: 'Orders',
                pageHeader: 'Orders',
                orders,
                user,
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

const checkout = ({ user, ...req }, res) => {
    res.render('shop/checkout', {
        path: req.path,
        pageTitle: 'Checkout',
        pageHeader: 'Checkout',
        user,
    });
};

const createOrder = ({ user, ...req }, res) => {
    if (!user) {
        return res.redirect(ROUTES.AUTH.LOGIN);
    }
    return user
        .getCart()
        .then(({ products }) => {
            user.cart.items = [];
            return user.save().then(() => products);
        })
        .then((products) => {
            const order = new OrderModel({
                user: user._id,
                productsData: products.map(({ title, price, _id: origin, quantity }) => ({
                    title,
                    price,
                    quantity,
                    origin,
                })),
            });
            return order.save();
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

module.exports = {
    getIndex,
    getCart,
    getOrders,
    checkout,
    createOrder,
};
