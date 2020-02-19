const { validationResult } = require('express-validator');

const ROUTES = require('../constants/routes');
const ProductModel = require('../models/product.model');
const { getErrors } = require('../utils/errors');
const { isEmpty } = require('../utils');

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

const getProductFromRequest = ({ user, body }) => {
    const { title, price, description, imageSrc: src, imageAlt: alt } = body;
    const { _id: userId } = user || { _id: undefined };

    return {
        title,
        price,
        image: {
            src,
            alt,
        },
        description,
        userId,
    };
};

const storeProduct = (req, res, next) => {
    const errors = getErrors(validationResult(req).array());
    const product = getProductFromRequest(req);

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
        actions: { store: ROUTES.ADMIN.CREATE_PRODUCT },
        product,
        errors,
        user: req.user,
    });
};

const updateProduct = (req, res, next) => {
    const { id: productId, title, price, description, imageSrc: src, imageAlt: alt } = req.body;
    if (productId) {
        return ProductModel.findById(productId)
            .then((product) => {
                if (product) {
                    product.title = title;
                    product.price = price;
                    product.description = description;
                    product.image.src = src;
                    product.image.alt = alt;
                    product.updatedAt = new Date().toISOString();
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
    console.log('editProduct');
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

    return new Promise((res, rej) =>
        isEmpty(errors) ? res(ProductModel.findByIdAndDelete(id)) : rej(new Error(errors.id)),
    )
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
