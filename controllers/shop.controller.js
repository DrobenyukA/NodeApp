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
                token:
                    'eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJtY3Nzb2x1dGlvbnMiLCJleHAiOjE1NzgwODM1MTksInN1YiI6ImFkYkBzdW1vcmVhLmNvbSIsInRlbmFudCI6Im1jcyIsInV1aWQiOiI0MzM5YTU0NC0zZWU3LTQ4YzktOTgzOC0wODM1YmRkZDFjMTMiLCJoYXNoIjoiZDhSMFQ5VXlwYmNtYStabGFOcXk2WFIyU3Zrby9WS29YMGs3TnBtVHFrSWhZc2wrdVcvQ3FjazkyalQvYTRILyJ9.vsi91xC_Apctm7OySLsnPQYFgfZnaazQQIk-1w6eWgt9ayd5BohCPvBB2cgeBxIkgVbhDc1QTSo3lTUtYoSK9w',
                user,
                actions: {
                    addToCart: ROUTES.CART.BASE,
                    viewProduct: ROUTES.PRODUCTS.PRODUCT,
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
