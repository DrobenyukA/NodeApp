const { first } = require('lodash');

const withLocals = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.locals.error = first(req.flash('error'));
    next();
};

module.exports = withLocals;
