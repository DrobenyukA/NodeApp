const ProductModel = require('../models/product.model');
const OrderModel = require('../models/order.model');
const ROUTES = require('../constants/routes');
const OrderService = require('../services/order.service');

const handleOrderNotFound = ({ user, path }, res) =>
    res.status(404).render('404', {
        path,
        pageTitle: 'Order not found',
        pageHeader: 'Order not found.',
        user,
    });

const handleForbidden = ({ user, path }, res) =>
    res.status(403).render('403', {
        path,
        pageTitle: 'Forbidden',
        pageHeader: 'This action is not allowed for you',
        user,
    });

const handleOrderError = ({ user, path }, res, next, error) =>
    res.status(500).render('500', {
        path,
        pageTitle: 'Server Error',
        pageHeader: 'Sorry something went wrong.',
        user,
        message: error.message,
    });

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
                actions: {
                    downloadInvoice: ROUTES.ORDERS.INVOICE,
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

const checkout = ({ user, ...req }, res) => {
    res.render('shop/checkout', {
        path: req.path,
        pageTitle: 'Checkout',
        pageHeader: 'Checkout',
        user,
    });
};

const createOrder = ({ user, ...req }, res) => {
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

const downloadInvoice = (req, res, next) => {
    const { orderId } = req.params;
    if (orderId) {
        const invoiceFileName = `invoice-${orderId}.pdf`;
        return OrderModel.findById(orderId)
            .then((order) => {
                if (order) {
                    return order;
                }
                throw new Error('Order not found');
            })
            .then((order) => {
                if (order.user.toString() === req.user._id.toString()) {
                    return order;
                }
                throw new Error('Not allowed');
            })
            .then((order) => OrderService.createInvoice(order, invoiceFileName))
            .then((invoiceFileStream) => {
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `inline; filename="${invoiceFileName}"`);
                return invoiceFileStream(res);
            })
            .catch((error) => {
                if (error.message === 'Order not found') {
                    return handleOrderNotFound(req, res);
                }
                if (error.message === 'Not allowed') {
                    return handleForbidden(req, res, next, error);
                }
                return handleOrderError(req, res, next, error);
            });
    }
    return handleOrderNotFound(req, res);
};

module.exports = {
    getIndex,
    getCart,
    getOrders,
    checkout,
    createOrder,
    downloadInvoice,
};
