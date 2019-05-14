const ROUTES = require('../constants/routes');
const CartModel = require('../models/cart.model');
const ProductModel = require('../models/product.model');
const CartItem = require('../models/cartItem.model');

const user = {
    isAdmin: false,
};

/* function getProductId({ productId }) {
    return productId;
}

function mergeQuantityWithProduct(products) {
    return ({ productId, quantity }) => {
        const product = products.find(({ id }) => productId === id);
        return {
            ...product,
            quantity,
        };
    };
} */

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
                totalPrice: 100,
                actions: {
                    deleteFromCart: ROUTES.CART.DELETE_ITEM,
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
    req.user
        .getCart()
        .then((cart) => {
            if (cart) {
                return cart.getProducts({ where: { id: productId } });
            }
            throw new Error('There is no cart for this user');
        })
        .then((products) => {
            console.log({ products });
        })
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
    return ProductModel.getProduct(productId)
        .then((product) => {
            if (product) {
                return CartModel.deleteProduct(product.id, product.price);
            }
            throw new Error(`Can't find product: ${productId}`);
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

module.exports = {
    getCart,
    addToCart,
    deleteItem,
};
