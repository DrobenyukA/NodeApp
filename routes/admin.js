const express = require('express');

const ROUTES = require('../constants/routes');
const router = express.Router();

router.get(ROUTES.ADMIN.ADD_PRODUCT, (req, res) => {
    res.render('add-product', {
        path: req.path,
        pageTitle: 'Add product',
        pageHeader: 'Add product',
        submitHandlerPath: ROUTES.ADMIN.ADD_PRODUCT,
    });
});

router.post(ROUTES.ADMIN.ADD_PRODUCT, (req, res) => {
    res.redirect(ROUTES.ROOT);
});

router.use(ROUTES.ADMIN.ROOT, (req, res) => {
    res.status(404).render('404', {
        path: req.path,
        pageTitle: 'Product not found',
        pageHeader: 'Product not found.',
    });
});

module.exports = router;
