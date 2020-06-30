const ROUTES = require('../../constants/routes');

const handleAPINotFound = (error, req, res, next) => {
    if (error) {
        return next(error);
    }
    return res.status(404).json({ status: 'Not found', message: `${ROUTES.API.BASE}${req.path} was not found` });
};

module.exports = {
    handleAPINotFound,
};
