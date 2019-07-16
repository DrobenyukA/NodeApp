const UserModel = require('../models/user.model');
const logger = require('../utils/logger');

const withUser = (req, res, next) => {
    if (req.session.user) {
        return UserModel.findById(req.session.user)
            .then((user) => {
                req.user = user;
                next();
            })
            .catch((error) => {
                logger.logError(error);
                next();
            });
    }
    return next();
};

module.exports = withUser;
