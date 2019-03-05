const express = require('express');

const ROUTES = require('../constants/routes');

const router = express.Router();

router.get(ROUTES.ROOT, (req, res) => {
    res.render('shop', {
        path: req.path,
        pageTitle: 'Books shop',
        pageHeader: 'My Products',
        products: [ {
            title: 'Refactoring: Improving the Design of Existing Code',
            price: 55.87,
            image: {
                src: 'https://images-na.ssl-images-amazon.com/images/I/41LBzpPXCOL._SX379_BO1,204,203,200_.jpg',
                alt: 'Refactoring: Improving the Design of Existing Code'
            },
            description: 'Fully Revised and Updated–Includes New Refactorings and Code Examples'
        } ],
    });
});

module.exports = router;