const express = require('express');

const adminRouter = require('./admin');
const shopRouter = require('./shop');
const PageController = require('../controllers/page');
const router = express.Router();

router.use(adminRouter);
router.use(shopRouter);
router.use(PageController.handlePageNotFound);

module.exports = router;
