function validateProduct(check) {
    return [
        check('productId')
            .escape()
            .isLength(24)
            .withMessage('Incorrect identifier'),
    ];
}

module.exports = {
    validateProduct,
};
