const express = require('express');

const apiLatestRouter = require('./api.latest.router');
const apiController = require('../controllers/api/api.controller');
const { API } = require('../constants/routes');

const router = express.Router();

router.use(apiLatestRouter);
router.use(API.BASE, apiController.handleAPINotFound);

module.exports = router;
