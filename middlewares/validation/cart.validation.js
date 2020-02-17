function validateProduct(check) {
    return [
        check('productId')
            .escape()
            .isLength(24)
            .withMessage('Incorrect product identifier'),
        check('quantity')
            .isInt()
            .withMessage('Incorrect quantity value'),
    ];
}

module.exports = {
    validateProduct,
};
