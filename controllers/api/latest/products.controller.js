const { getProductFromRequest } = require('../../../services/product.service');

const createProduct = (req, res) => {
    const product = getProductFromRequest(req);
    if (product) {
        return res.status(201).json({ id: 1, ...product });
    }
    return res.status(500).json({ message: 'Server error' });
};

const readProducts = (req, res) => {
    return res.json([{ id: 1 }]);
};

const readProduct = (req, res) => {
    return res.json({ id: 1 });
};

const updateProduct = (req, res) => {};

const deleteProduct = (req, res) => {};

const uploadProductImage = (req, res) => {};

module.exports = {
    createProduct,
    readProduct,
    readProducts,
    updateProduct,
    deleteProduct,
    uploadProductImage,
};
