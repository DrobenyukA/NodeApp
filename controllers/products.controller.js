const { validationResult } = require('express-validator');

const ROUTES = require('../constants/routes');
const ProductModel = require('../models/product.model');
const { getErrors } = require('../utils/errors');
const { isEmpty } = require('../utils');

const renderProductForm = ({ user, ...req }, res) =>
    res.render('shop/product-form', {
        path: req.path,
        pageTitle: 'Add product',
        pageHeader: 'Add product',
        actions: { store: ROUTES.ADMIN.CREATE_PRODUCT },
        product: {},
        errors: {},
        user,
    });

const storeProduct = (req, res) => {
    const { user, body, param } = req;
    const { title, price, description, imageSrc: src, imageAlt: alt } = body;
    const { _id: userId } = user || { _id: undefined };
    const errors = getErrors(validationResult(req).array());
    const product = {
        title,
        price,
        image: {
            src,
            alt,
        },
        description,
        userId,
    };
    if (isEmpty(errors)) {
        return new ProductModel(product)
            .save()
            .then(() => res.redirect(ROUTES.ROOT))
            .catch(({ message }) => {
                return res.render('error', {
                    path: param,
                    pageTitle: 'Error',
                    pageHeader: 'Sorry, something went wrong.',
                    message,
                    user,
                });
            });
    }
    return res.render('shop/product-form', {
        path: req.path,
        pageTitle: 'Add product',
        pageHeader: 'Add product',
        actions: { store: ROUTES.ADMIN.CREATE_PRODUCT },
        product,
        errors,
        user,
    });
};

const updateProduct = (req, res) => {
    const { id: productId, title, price, description, imageSrc: src, imageAlt: alt } = req.body;
    if (productId) {
        return ProductModel.findById(productId)
            .then((product) => {
                product.title = title;
                product.price = price;
                product.description = description;
                product.image.src = src;
                product.image.alt = alt;
                product.updatedAt = new Date().toISOString();
                return product.save();
            })
            .then(() => res.redirect(ROUTES.ROOT))
            .catch();
    }
    return handleProductNotFound(req, res);
};

const handleProductNotFound = ({ user, path }, res) => {
    res.status(404).render('404', {
        path: path,
        pageTitle: 'Product not found',
        pageHeader: 'Product not found.',
        user,
    });
};

const getProducts = ({ user, path, param }, res) => {
    ProductModel.find()
        .then((products) =>
            res.render('shop/products-list', {
                path: path,
                pageTitle: 'Books shop',
                pageHeader: 'My Products',
                products,
                user,
                actions: {
                    viewProduct: ROUTES.PRODUCTS.PRODUCT,
                    addToCart: ROUTES.CART.BASE,
                    editProduct: ROUTES.ADMIN.EDIT_PRODUCT,
                    deleteProduct: ROUTES.ADMIN.DELETE_PRODUCT,
                },
            }),
        )
        .catch(({ message }) =>
            res.render('error', {
                path: param,
                pageTitle: 'Error',
                pageHeader: 'Sorry, something went wrong.',
                message,
                user,
            }),
        );
};

const getProduct = ({ user, ...req }, res) => {
    const { id } = req.params;
    ProductModel.findById(id)
        .then((product) => {
            if (product) {
                return res.render('shop/product-details', {
                    path: req.path,
                    pageTitle: `Books shop | ${product.title}`,
                    pageHeader: `Product ${product.title}`,
                    product,
                    user,
                    actions: {
                        addToCart: ROUTES.CART.BASE,
                    },
                });
            } else {
                return handleProductNotFound(req, res);
            }
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

const editProduct = ({ user, ...req }, res) => {
    const { id } = req.params;
    return ProductModel.findById(id)
        .then((product) => {
            if (product) {
                res.render('shop/product-form', {
                    path: req.path,
                    pageTitle: 'Edit product',
                    pageHeader: `Edit ${product.title}`,
                    submitHandlerPath: ROUTES.ADMIN.UPDATE_PRODUCT,
                    product,
                    user,
                });
            }
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

const deleteProduct = ({ user, ...req }, res) => {
    const { id } = req.body;
    return ProductModel.findByIdAndDelete(id)
        .then(() => res.redirect(ROUTES.PRODUCTS.BASE))
        .catch(({ message }) => {
            return res.render('error', {
                path: req.param,
                pageTitle: 'Error',
                pageHeader: 'Sorry, something went wrong.',
                message,
                user,
            });
        });
};

module.exports = {
    renderProductForm,
    editProduct,
    deleteProduct,
    getProducts,
    handleProductNotFound,
    storeProduct,
    updateProduct,
    getProduct,
};
