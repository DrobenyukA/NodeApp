const express = require('express');

const ROUTES = require('../constants/routes');
const apiLatestRouter = require('./api.latest.router');
const apiController = require('../controllers/api/api.controller');

const router = express.Router();

router.use(ROUTES.API.LATEST.BASE, apiLatestRouter);
router.use(ROUTES.API.BASE, apiController.handleAPINotFound);

module.exports = router;
