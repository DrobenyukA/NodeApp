const { first } = require('lodash');

const withLocals = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.locals.error = first(req.flash('error'));
    res.locals.success = first(req.flash('success'));
    res.locals.info = first(req.flash('info'));
    next();
};

module.exports = withLocals;
