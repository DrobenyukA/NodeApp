const ROUTES = require('../../constants/routes');

const handleAPINotFound = (req, res) => {
    return res.status(404).json({ status: 'Not found', message: `${ROUTES.API.BASE}${req.path} was not found` });
};

module.exports = {
    handleAPINotFound,
};
