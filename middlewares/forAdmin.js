const ROUTES = require('../constants/routes');

const forAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        return next();
    }
    if (req.path.includes(ROUTES.API.BASE)) {
        return res.status(403).json({ message: 'You are not allowed to view this page' });
    }
    return res.status(403).render('error', {
        path: req.param,
        pageTitle: 'Error',
        pageHeader: 'Sorry, something went wrong.',
        message: 'You are not allowed to view this page',
        user: undefined,
    });
};

module.exports = forAdmin;
