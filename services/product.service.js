const ProductModel = require('../models/product.model');
const ROUTES = require('../constants/routes');

function getProductsById(id) {
    return ProductModel.findById(id).catch(() => undefined);
}

function getProductFromRequest(req) {
    const { title, price, description, imageSrc: src, imageAlt: alt } = req.body;
    return {
        title,
        price,
        description,
        image: {
            src,
            alt,
        },
        userId: '5e2fd91def4d353e656bf013',
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

module.exports = {
    getProductsById,
    getProductFromRequest,
    getProductsPage,
    getProductImageSrc,
    saveProduct,
};
