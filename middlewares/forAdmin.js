const forAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        return next();
    }
    return res.status(599).render('error', {
        path: req.param,
        pageTitle: 'Error',
        pageHeader: 'Sorry, something went wrong.',
        message: 'You are not allowed to view this page',
        user: undefined,
    });
};

module.exports = forAdmin;
