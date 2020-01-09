function validateBook(check) {
    return [
        check('title', 'The name should consist of at least 3 and not more than 255 characters.').isLength({
            min: 3,
            max: 255,
        }),
        check('imageSrc')
            .custom((value) => {
                if (value) {
                    return value.includes('http://localhost');
                }
                return true;
            })
            .withMessage('Please provide an correct image URL'),
        check('imageAlt')
            .custom((value, { req }) => {
                if (req.body.imageSrc) {
                    return value && value.toString().trim().length > 0;
                }
                return true;
            })
            .withMessage('Please provide an alternative text for picture.'),
        check('price')
            .notEmpty()
            .isDecimal(),
    ];
}

module.exports = validateBook;
