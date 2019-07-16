const express = require('express');

const ROUTES = require('../constants/routes');
const AuthController = require('../controllers/auth.controller');
const router = express.Router();

router.get(ROUTES.AUTH.LOGIN, AuthController.renderLoginForm);
router.post(ROUTES.AUTH.LOGIN, AuthController.authenticate);
router.post(ROUTES.AUTH.LOGOUT, AuthController.logout);

module.exports = router;
