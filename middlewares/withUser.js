const UserModel = require('../models/user.model');
const logger = require('../utils/logger');

const withUser = (req, res, next) => {
    UserModel.findById('5cf7e07cb4ea248872a3791b')
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((error) => {
            logger.logError(error);
            next();
        });
};

module.exports = withUser;
