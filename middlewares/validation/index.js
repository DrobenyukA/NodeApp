function validateId(check) {
    return [
        check('id')
            .escape()
            .isLength({ min: 24, max: 24 })
            .withMessage('Incorrect identifier'),
    ];
}

module.exports = {
    validateId,
};
