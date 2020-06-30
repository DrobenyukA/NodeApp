const { validationResult } = require('express-validator');

const { getErrors } = require('../../../utils/errors');
const { PRODUCTS_PER_PAGE } = require('../../../constants/settings');
const service = require('../../../services/product.service');

const handleError = (res) => (error) => {
    const { statusCode = 500, message, data } = error;
    return res.status(statusCode).json({ message, data });
};

const createProduct = (req, res) => {
    const errorsList = validationResult(req);
    const product = service.getProductFromRequest(req);
    const error = new Error();
    if (product && errorsList.isEmpty()) {
        return service
            .saveProduct(product)
            .then((result) => res.status(201).json(result))
            .catch(handleError(res));
    }
    error.statusCode = 422;
    error.message = 'Validation failed';
    error.data = getErrors(errorsList.array());
    return handleError(res)(error);
};

const readProducts = (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) || 1 : 1;
    return service
        .getProductsPage(page, PRODUCTS_PER_PAGE)
        .then(([products, pages]) => res.json({ products, pages }))
        .catch(handleError(res));
};

const readProduct = (req, res) => {
    const { id } = req.params;
    const errorsList = validationResult(req);
    const error = new Error();
    if (errorsList.isEmpty()) {
        return service
            .getProductsById(id)
            .then((result) => {
                if (result) {
                    return res.json(result);
                }
                error.statusCode = 404;
                error.message = 'Product not found';
                throw error;
            })
            .catch(handleError(res));
    }
    error.statusCode = 422;
    error.message = 'Validation failed';
    error.data = getErrors(errorsList.array());
    return handleError(res)(error);
};

const updateProduct = (req, res, next) => {
    return next(new Error('Not implemented'));
};

const deleteProduct = (req, res) => {};

const uploadProductImage = (req, res) => {
    const errorsList = validationResult(req);
    const error = new Error();
    if (req.file && errorsList.isEmpty()) {
        return res.status(201).json({
            imageSrc: service.getProductImageSrc(req.file),
            imageAlt: req.body.imageAlt,
        });
    }
    error.statusCode = 422;
    error.message = 'Validation failed';
    error.data = getErrors(errorsList.array());
    return handleError(res)(error);
};

module.exports = {
    createProduct,
    readProduct,
    readProducts,
    updateProduct,
    deleteProduct,
    uploadProductImage,
};
