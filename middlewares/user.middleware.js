const User = require('../models/user.model');
const myLogger = require('../utils/logger');

function withUser(req, res, next) {
    User.findByPk(1)
        .then((user) => {
            req.user = user;
            return user.getCart();
        })
        .then((cart) => {
            if (cart === null) {
                req.user.createCart();
            }
            next();
        })
        .catch(myLogger.logError);
}

module.exports = {
    withUser,
};
