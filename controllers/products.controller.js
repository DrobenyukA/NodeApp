const { isEmpty } = require('lodash');
const { validationResult } = require('express-validator');

const ROUTES = require('../constants/routes');
const { PRODUCTS_PER_PAGE } = require('../constants/settings');
const service = require('../services/product.service');
const { getErrors } = require('../utils/errors');

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
    res.render('pages/product-form', {
        path,
        pageTitle: 'Add product',
        pageHeader: 'Add product',
        actions: {
            store: ROUTES.API.LATEST.PRODUCTS.BASE,
            upload: ROUTES.API.LATEST.PRODUCTS.IMAGE,
        },
        product: {},
        errors,
        user,
    });
};

const renderProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    return service
        .getProductsPage(page, PRODUCTS_PER_PAGE)
        .then(([products, pages]) =>
            res.render('pages/products-list', {
                path: req.path,
                pageTitle: 'Books shop',
                pageHeader: 'My Products',
                products,
                user: req.user,
                pages,
                hasPreviousPage: page > 1,
                currentPage: page,
                hasNextPage: page < pages,
                actions: {
                    viewProduct: ROUTES.PRODUCTS.PRODUCT,
                    addToCart: ROUTES.CART.BASE,
                    editProduct: ROUTES.PRODUCTS.EDIT,
                    deleteProduct: ROUTES.API.LATEST.PRODUCTS.PRODUCT,
                },
            }),
        )
        .catch((error) => handleProductError(req, res, next, error));
};

const renderProduct = (req, res, next) => {
    const { id } = req.params;
    const errors = getErrors(validationResult(req).array());

    return new Promise((res, rej) => (isEmpty(errors) ? res(service.getProductsById(id)) : rej(new Error(errors.id))))
        .then((product) => {
            if (product) {
                return res.render('pages/product-details', {
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

const renderProductEditForm = (req, res, next) => {
    const { id } = req.params;
    const errors = getErrors(validationResult(req).array());
    return new Promise((res) => (isEmpty(errors) ? res(service.getProductsById(id)) : res(errors.id)))
        .then((product) => {
            if (product) {
                return res.render('pages/product-form', {
                    path: req.path,
                    pageTitle: 'Edit product',
                    pageHeader: `Edit ${product.title || 'product'}`,
                    actions: {
                        store: ROUTES.API.LATEST.PRODUCTS.BASE,
                        upload: ROUTES.API.LATEST.PRODUCTS.IMAGE,
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

module.exports = {
    renderProduct,
    renderProducts,
    renderProductForm,
    renderProductEditForm,
    handleProductNotFound,
};
