const express = require('express');
const { check } = require('express-validator');

const ROUTES = require('../constants/routes');
const AuthController = require('../controllers/auth.controller');
const router = express.Router();
const notForUsers = require('../middlewares/notForUsers');
const validateNewUser = require('../middlewares/validation/newUserValidation');

router.get(ROUTES.AUTH.LOGIN, notForUsers, AuthController.renderSignInForm);
router.get(ROUTES.AUTH.SIGNUP, notForUsers, AuthController.renderSignUpForm);
router.get(ROUTES.AUTH.RESET_PASSWORD, notForUsers, AuthController.renderResetPasswordForm);
router.get(ROUTES.AUTH.RESTORE_PASSWORD, notForUsers, AuthController.renderRestorePasswordForm);

router.post(ROUTES.AUTH.SIGNUP, validateNewUser(check), AuthController.register);
router.post(ROUTES.AUTH.LOGIN, AuthController.login);
router.post(ROUTES.AUTH.LOGOUT, AuthController.logout);
router.post(ROUTES.AUTH.RESET_PASSWORD, AuthController.resetPassword);
router.post(ROUTES.AUTH.RESTORE_PASSWORD, AuthController.restorePassword);

module.exports = router;
