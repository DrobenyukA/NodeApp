const ROUTES = require('../constants/routes');
const ProductModel = require('../models/product.model');

const user = {
    isAdmin: false,
};

const getCart = (req, res) => {
    req.user
        .getCart()
        .then((cart) => {
            if (cart) {
                return cart.getProducts();
            }
            throw new Error('There is no cat for this user');
        })
        .then((products) => {
            return res.render('shop/cart', {
                path: req.path,
                pageTitle: 'Cart',
                pageHeader: 'My Products',
                products,
                // TODO: calculate quantity from products
                totalPrice: 101,
                actions: {
                    deleteFromCart: ROUTES.CART.DELETE_ITEM,
                    orderNow: ROUTES.ORDERS.BASE,
                },
                user,
            });
        })
        .catch(({ message }) =>
            res.render('error', {
                path: req.path,
                pageTitle: 'Cart',
                pageHeader: 'Error on getting to cart',
                message,
                user,
            }),
        );
};

const addToCart = (req, res) => {
    const { productId, quantity } = req.body;
    return req.user
        .getCart()
        .then((cart) => {
            if (cart) {
                return cart.getProducts({ where: { id: productId } }).then((products) => [cart, products]);
            }
            throw new Error('There is no cart for this user');
        })
        .then(([cart, products]) => {
            if (products.length) {
                return [cart, +quantity + products[0].cartItem.quantity];
            }
            return [cart, quantity];
        })
        .then(([cart, newQuantity]) => ProductModel.findByPk(productId).then((product) => [cart, product, newQuantity]))
        .then(([cart, product, itemQuantity]) => {
            if (product) {
                return cart.addProduct(product, { through: { quantity: itemQuantity } });
            }
            throw new Error(`There is no such product: ${productId}`);
        })
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

const deleteItem = (req, res) => {
    const { productId } = req.body;
    return req.user
        .getCart()
        .then((cart) => cart.getProducts({ where: { id: productId } }))
        .then((products) => {
            if (products.length) {
                return products[0];
            }
            throw new Error(`There is no such product: ${productId}`);
        })
        .then((product) => product.cartItem.destroy())
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
