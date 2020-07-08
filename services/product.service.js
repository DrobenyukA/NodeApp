const fs = require('fs');
const path = require('path');

const ProductModel = require('../models/product.model');
const ROUTES = require('../constants/routes');
const { PUBLIC } = require('../constants/path');

function getProductsById(id) {
    return ProductModel.findById(id);
}

function getProductFromRequest(req) {
    const { title, price, description, imageSrc: src, imageAlt: alt } = req.body;
    const { _id: userId } = req.user || { _id: '5e2fd91def4d353e656bf013' };

    return {
        title,
        price,
        description,
        image: {
            src,
            alt,
        },
        userId,
    };
}

function countPages(quantity, itemsPerPage) {
    return Math.ceil(quantity / itemsPerPage);
}

function getProductsPage(page, productsPerPage) {
    const offset = (page - 1) * productsPerPage;
    return ProductModel.find()
        .countDocuments()
        .then((count) =>
            ProductModel.find()
                .skip(offset)
                .limit(productsPerPage)
                .then((products) => [products, count]),
        )
        .then(([products, count]) => [products, countPages(count, productsPerPage)]);
}

function saveProduct(product) {
    return new ProductModel(product).save().then((result) => result);
}

const getProductImageSrc = (file) => `${ROUTES.IMAGES.PRODUCTS}/${file.filename}`;

function updateProduct(product) {
    return ProductModel.findById(product.id).then((result) => {
        if (result) {
            result.title = product.title;
            result.price = product.price;
            result.description = product.description;
            result.image.alt = product.imageAlt;
            result.updatedAt = new Date().toISOString();
            if (result.image.src !== product.imageSrc) {
                fs.promises.unlink(path.join(PUBLIC, result.image.src));
                result.image.src = product.imageSrc;
            }
            return result.save();
        }
        return undefined;
    });
}

function removeProduct(id) {
    return ProductModel.findById(id).then((product) => {
        if (product) {
            return fs.promises.unlink(path.join(PUBLIC, product.image.src)).then(() => product.remove());
        }
        const error = new Error('Product not found.');
        error.statusCode = 404;
        throw error;
    });
}

module.exports = {
    getProductsById,
    getProductFromRequest,
    getProductsPage,
    getProductImageSrc,
    saveProduct,
    updateProduct,
    removeProduct,
};
