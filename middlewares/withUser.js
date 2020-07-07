const jwt = require('jsonwebtoken');
const { isString, isUndefined } = require('lodash');

const { auth } = require('../settings');
const UserModel = require('../models/user.model');
const logger = require('../utils/logger');

function getToken(req) {
    const authHeader = req.get('Authorization');
    if (isString(authHeader)) {
        return authHeader.split(' ')[1];
    }
    return undefined;
}

const withUser = (req, res, next) => {
    const token = getToken(req);
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
    if (token) {
        return new Promise((res) => {
            res(jwt.verify(token, auth.secret));
        })
            .then((result) => {
                if (isUndefined(result)) {
                    throw new Error(`Invalid token (${token})`);
                }

                return UserModel.findById(result.userId).then((user) => {
                    if (user) {
                        return user;
                    }
                    throw new Error(`There is no user with id: ${result.userId}`);
                });
            })
            .then((user) => {
                req.user = user;
                next();
            })
            .catch((error) => {
                logger.logError(error);
                return res.status(401).json({ message: 'Authentication failed' });
            });
    }
    return next();
};

module.exports = withUser;
