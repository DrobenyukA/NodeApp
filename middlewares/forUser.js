const ROUTES = require('../constants/routes');

const forUser = (req, res, next) => {
    if (req.user) {
        return next();
    }

    return res.redirect(ROUTES.AUTH.LOGIN);
};

module.exports = forUser;
