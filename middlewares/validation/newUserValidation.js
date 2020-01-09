const User = require('../../models/user.model');

function validateNewUser(check) {
    return [
        check('name')
            .isLength({ min: 3, max: 255 })
            .withMessage('Name should have at least 3 characters and not more than 255.'),
        check('password', 'Bad password')
            .isLength({ min: 5 })
            .withMessage('Password should have at least 5 characters.'),
        check('email', 'Incorrect email address')
            .isEmail()
            .withMessage('Incorrect email address')
            .custom((email) =>
                User.findOne({ email }).then((user) => {
                    if (user) {
                        return Promise.reject('User with this email already exists.');
                    }
                    return Promise.resolve(true);
                }),
            ),
        check('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation is incorrect');
            }
            return true;
        }),
    ];
}
module.exports = validateNewUser;
