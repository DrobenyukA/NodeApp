const UserModel = require('../models/user.model');
const logger = require('../utils/logger');

const withUser = (req, res, next) => {
    UserModel.findById('5ced5d0f1c9d4400001dbcb3')
        .then((user) => {
            req.user = new UserModel(user);
            next();
        })
        .catch((error) => {
            logger.logError(error);
            next();
        });
};

module.exports = withUser;
