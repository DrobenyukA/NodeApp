const ROUTES = require('../constants/routes');
const CartModel = require('../models/cart.model');
const ProductModel = require('../models/product.model');
const ProductsController = require('../controllers/products.controller');

const user = {
    isAdmin: false,
};

function getProductId({ productId }) {
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
}

const getCart = (req, res) => {
    CartModel.getCart()
        .then((cart) =>
            ProductModel.getProductsByIds(cart.products.map(getProductId)).then((products) => ({
                products: cart.products.map(mergeQuantityWithProduct(products)),
                totalPrice: cart.totalPrice,
            })),
        )
        .then(({ products, totalPrice }) => {
            return res.render('shop/cart', {
                path: req.path,
                pageTitle: 'Cart',
                pageHeader: 'My Products',
                products,
                totalPrice,
                actions: {
                    deleteFromCart: ROUTES.CART.DELETE_ITEM,
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

    return ProductModel.getProduct(productId).then((product) => {
        if (product) {
            return CartModel.addToCart(productId, product.price, quantity)
                .then(() => {
                    res.redirect(ROUTES.PRODUCTS.BASE);
                })
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
