function validateBookImageAlt(check) {
    return [
        check('imageAlt')
            .custom((value, { req }) => {
                if (req.body.imageSrc) {
                    return value && value.toString().trim().length > 0;
                }
                return true;
            })
            .withMessage('Please provide an alternative text for picture.'),
    ];
}

function validateBook(check) {
    return [
        check('title')
            .isLength({
                min: 3,
                max: 255,
            })
            .withMessage('The name should consist of at least 3 and not more than 255 characters.'),
        check('imageSrc')
            .isURL({
                require_protocol: false,
                require_host: false,
                require_valid_protocol: false,
            })
            .withMessage('Please provide an image URL'),
        ...validateBookImageAlt(check),
        check('price')
            .notEmpty()
            .isDecimal(),
    ];
}

module.exports = {
    validateBook,
    validateBookImageAlt,
};
