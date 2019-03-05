const express = require('express');

const adminRouter = require('./admin');
const shopRouter = require('./shop');
const router = express.Router();

router.use(adminRouter);
router.use(shopRouter);
router.use((req, res) => {
    res.status(404).render('404', {
        path: req.path,
        pageTitle: 'Page not found.',
        pageHeader: 'Page not found.'
    });
})

module.exports = router;