const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

const ROUTES = require('../constants/routes');
const { PUBLIC } = require('../constants/path');
const ProductModel = require('../models/product.model');
const { getErrors } = require('../utils/errors');
const { isEmpty } = require('../utils');

const getProductImageSrc = (file) => `${ROUTES.IMAGES.PRODUCTS}/${file.filename}`;

const handleProductNotFound = ({ user, path }, res) =>
    res.status(404).render('404', {
        path,
        pageTitle: 'Product not found',
        pageHeader: 'Product not found.',
        user,
    });

const handleProductError = ({ user, path }, res, next, error) =>
    res.status(500).render('500', {
        path,
        pageTitle: 'Server Error',
        pageHeader: 'Sorry something went wrong.',
        user,
        message: error.message,
    });

const renderProductForm = ({ user, path }, res, next, errors = {}) => {
    res.render('shop/product-form', {
        path,
        pageTitle: 'Add product',
        pageHeader: 'Add product',
        actions: { store: ROUTES.PRODUCTS.CREATE },
        product: {},
        errors,
        user,
    });
};

const getProductFromRequest = ({ user, body, file }, errors) => {
    const { title, price, description, imageAlt: alt } = body;
    const { _id: userId } = user || { _id: undefined };
    if (file) {
        return {
            title,
            price,
            image: {
                src: getProductImageSrc(file),
                alt,
            },
            description,
            userId,
        };
    }
    errors.image = 'Invalid file';
    return {};
};

const storeProduct = (req, res, next) => {
    let errors = getErrors(validationResult(req).array());
    const product = getProductFromRequest(req, errors);

    if (isEmpty(errors)) {
        return new ProductModel(product)
            .save()
            .then(() => res.redirect(ROUTES.ROOT))
            .catch((error) => handleProductError(req, res, next, error));
    }

    return res.render('shop/product-form', {
        path: req.path,
        pageTitle: 'Add product',
        pageHeader: 'Add product',
        actions: { store: ROUTES.PRODUCTS.CREATE },
        product,
        errors,
        user: req.user,
    });
};

const updateProduct = (req, res, next) => {
    const errors = getErrors(validationResult(req).array());
    const productId = req.body.id;
    // In this case we ignore errors with uploaded file
    const updatedProduct = getProductFromRequest(req, {});

    if (isEmpty(errors) && productId) {
        return ProductModel.findById(productId)
            .then((product) => {
                if (product) {
                    product.title = updatedProduct.title;
                    product.price = updatedProduct.price;
                    product.description = updatedProduct.description;
                    product.image.alt = updatedProduct.alt;
                    product.updatedAt = new Date().toISOString();
                    if (req.file) {
                        fs.promises.unlink(path.join(PUBLIC, product.image.src));
                        product.image.src = getProductImageSrc(req.file);
                    }
                    return product.save();
                }
                return handleProductNotFound(req, res);
            })
            .then(() => res.redirect(ROUTES.ROOT))
            .catch((error) => handleProductError(req, res, next, error));
    }
    return handleProductNotFound(req, res);
};

const getProducts = (req, res, next) =>
    ProductModel.find()
        .then((products) =>
            res.render('shop/products-list', {
                path: req.path,
                pageTitle: 'Books shop',
                pageHeader: 'My Products',
                products,
                user: req.user,
                actions: {
                    viewProduct: ROUTES.PRODUCTS.PRODUCT,
                    addToCart: ROUTES.CART.BASE,
                    editProduct: ROUTES.PRODUCTS.EDIT,
                    deleteProduct: ROUTES.PRODUCTS.DELETE,
                },
            }),
        )
        .catch((error) => handleProductError(req, res, next, error));

const getProduct = (req, res, next) => {
    const { id } = req.params;
    const errors = getErrors(validationResult(req).array());

    return new Promise((res, rej) => (isEmpty(errors) ? res(ProductModel.findById(id)) : rej(new Error(errors.id))))
        .then((product) => {
            if (product) {
                return res.render('shop/product-details', {
                    path: req.path,
                    pageTitle: `Books shop | ${product.title}`,
                    pageHeader: `Product ${product.title}`,
                    product,
                    user: req.user,
                    actions: {
                        addToCart: ROUTES.CART.BASE,
                    },
                });
            } else {
                return handleProductNotFound(req, res);
            }
        })
        .catch((error) => handleProductError(req, res, next, error));
};

const editProduct = (req, res, next) => {
    const { id } = req.params;
    const errors = getErrors(validationResult(req).array());
    return new Promise((res) => (isEmpty(errors) ? res(ProductModel.findById(id)) : res({})))
        .then((product) => {
            if (product) {
                return res.render('shop/product-form', {
                    path: req.path,
                    pageTitle: 'Edit product',
                    pageHeader: `Edit ${product.title || 'product'}`,
                    actions: {
                        store: ROUTES.PRODUCTS.UPDATE,
                    },
                    product,
                    user: req.user,
                    errors: errors,
                });
            } else {
                return handleProductNotFound(req, res);
            }
        })
        .catch((error) => handleProductError(req, res, next, error));
};

const deleteProduct = (req, res, next) => {
    const { id } = req.body;
    const errors = getErrors(validationResult(req).array());

    return new Promise((res, rej) => (isEmpty(errors) ? res(ProductModel.findById(id)) : rej(new Error(errors.id))))
        .then((product) => {
            if (product) {
                fs.promises.unlink(path.join(PUBLIC, product.image.src));
                return product.remove();
            }
            throw new Error('Product not found');
        })
        .then(() => res.redirect(ROUTES.PRODUCTS.BASE))
        .catch((error) => handleProductError(req, res, next, error));
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
