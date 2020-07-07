const { validationResult } = require('express-validator');

const service = require('../../../services/auth.service');
const { getErrors } = require('../../../utils/errors');
const mailer = require('../../../utils/mailer');

const handleError = (res) => (error) => {
    const { statusCode = 500, message, data } = error;
    return res.status(statusCode).json({ message, data });
};

const login = (req, res) => {
    const errorsList = validationResult(req);
    const userData = service.getUserDataFromRequest(req);
    const error = new Error();
    if (errorsList.isEmpty()) {
        return service
            .getUserByEmailAndPassword(userData)
            .then((user) => {
                if (user) {
                    return res.status(201).json(user);
                }
                error.statusCode = 422;
                error.message = 'Incorrect email or password';
                throw error;
            })
            .catch(handleError(res));
    }
    error.statusCode = 422;
    error.message = 'Validation failed';
    error.data = getErrors(errorsList.array());
    return handleError(res)(error);
};

const logout = (req, res) => {
    res.status(500).json({ message: 'NOT IMPLEMENTED' });
};

const register = (req, res) => {
    const errorsList = validationResult(req);
    const userData = service.getUserDataFromRequest(req);
    const error = new Error();
    if (errorsList.isEmpty()) {
        return service
            .createUser(userData)
            .then((user) => {
                res.status(201).json({
                    name: user.name,
                    email: user.email,
                    cart: user.cart,
                });
            })
            .then(() =>
                mailer.sendMail({
                    to: userData.email,
                    from: 'andriy.drobenyuk@gmail.com',
                    subject: 'Registration succeeded.',
                    html: '<h1>You have been register successfully</h1>',
                }),
            );
    }
    error.statusCode = 422;
    error.message = 'Validation failed';
    error.data = getErrors(errorsList.array());
    return handleError(res)(error);
};

module.exports = {
    login,
    logout,
    register,
};
