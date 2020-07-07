const { isNotRegisteredEmail } = require('../../services/auth.service');

function validateLoginForm(check) {
    return [
        check('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Incorrect email address'),
        check('password')
            .not()
            .isEmpty()
            .trim()
            .escape()
            .withMessage('Please fill password fields'),
    ];
}

function validateRegistrationForm(check) {
    return [
        check('name')
            .isLength({ min: 3, max: 255 })
            .withMessage('Name should have at least 3 characters and not more than 255.'),
        check('password', 'Bad password')
            .isLength({ min: 5 })
            .withMessage('Password should have at least 5 characters.'),
        check('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Incorrect email address')
            .custom(isNotRegisteredEmail)
            .normalizeEmail(),
        check('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation is incorrect');
            }
            return true;
        }),
    ];
}

function validateResetPasswordForm(check) {
    return [
        check('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Incorrect email address'),
    ];
}

function validateRestoreForm(check) {
    return [
        check('password', 'Bad password')
            .isLength({ min: 5 })
            .withMessage('Password should have at least 5 characters.'),
        check('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation is incorrect');
            }
            return true;
        }),
    ];
}

module.exports = {
    validateLoginForm,
    validateRegistrationForm,
    validateResetPasswordForm,
    validateRestoreForm,
};
