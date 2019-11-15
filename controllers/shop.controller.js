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
                    'eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJtY3Nzb2x1dGlvbnMiLCJleHAiOjE1NzM4NjM5NTQsInN1YiI6ImFkYkBzdW1vcmVhLmNvbSIsInRlbmFudCI6Im1jcyIsInV1aWQiOiIwYjZjZTg4YS1kNWQ3LTRiNjUtOGNiZi01YTBmZWI3OGIzMWIiLCJoYXNoIjoiL3NNcTFNN3BOK3REWGNONDZ6STg1UW1pQ3ZVUkQ3QmN6emVoL0JROVo3T1JNY3hzZUJFU3FwYUFkaTh2VHBtWCJ9.rgq5CrR_xsH2J8YIerfSfZTWo8IftSsuCPsdDLMo5ltCePKnMUWnn_C0cEs5SFp3qr8x7_4S4QqbHEsF9d4X-A',
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
