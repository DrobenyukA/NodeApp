const express = require('express');

const ROUTES = require('../constants/routes');
const router = express.Router();

const fileStorage = require('../utils/fileStorage');

router.get(ROUTES.ADMIN.ADD_PRODUCT, (req, res) => {
    res.render('add-product', {
        path: req.path,
        pageTitle: 'Add product',
        pageHeader: 'Add product',
        submitHandlerPath: ROUTES.ADMIN.ADD_PRODUCT,
    });
});

router.post(ROUTES.ADMIN.ADD_PRODUCT, (req, res) => {
    // TODO: add book validation
    return fileStorage
        .storeItem('books', req.body)
        .then(() => res.redirect(ROUTES.ROOT))
        .catch(({ message }) =>
            res.render('error', {
                path: req.param,
                pageTitle: 'Error',
                pageHeader: 'Sorry, something went wrong.',
                message,
            }),
        );
});

router.use(ROUTES.ADMIN.ROOT, (req, res) => {
    res.status(404).render('404', {
        path: req.path,
        pageTitle: 'Product not found',
        pageHeader: 'Product not found.',
    });
});

module.exports = router;
