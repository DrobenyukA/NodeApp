const User = require('../../models/user.model');

function validateNewUser(check) {
    return [
        check('password', 'Bad password')
            .isLength({ min: 5 })
            .withMessage('Password should have at least 5 characters.')
            .custom((value, { req }) => {
                if (value !== req.body.confirmPassword) {
                    throw new Error('Password confirmation is incorrect');
                }
                return true;
            }),
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
    ];
}
module.exports = validateNewUser;
