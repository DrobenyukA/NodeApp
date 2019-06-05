const ROUTES = require('../constants/routes');
const ProductModel = require('../models/product.model');
const ProductsController = require('../controllers/products.controller');

const user = {
    isAdmin: false,
};

const getCart = (req, res) => {
    req.user
        .getCart()
        .then(({ products, totalPrice }) => {
            return res.render('shop/cart', {
                path: req.path,
                pageTitle: 'Cart',
                pageHeader: 'My Products',
                products,
                totalPrice,
                actions: {
                    deleteFromCart: ROUTES.CART.DELETE_ITEM,
                    orderNow: ROUTES.ORDERS.BASE,
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
};

const addToCart = (req, res) => {
    const { productId, quantity } = req.body;

    return ProductModel.findById(productId).then((product) => {
        if (product) {
            return req.user
                .addToCart(product, +quantity)
                .then(() => res.redirect(ROUTES.PRODUCTS.BASE))
                .catch(({ message }) => {
                    res.render('error', {
                        path: req.path,
                        pageTitle: 'Cart',
                        pageHeader: 'Error on adding to cart',
                        message,
                        user,
                    });
                });
        }
        return ProductsController.handleProductNotFound();
    });
};

const deleteItem = (req, res) => {
    const { productId, quantity } = req.body;
    return req.user
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
