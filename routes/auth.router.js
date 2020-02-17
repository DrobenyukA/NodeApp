const express = require('express');
const { check } = require('express-validator');

const ROUTES = require('../constants/routes');
const AuthController = require('../controllers/auth.controller');
const notForUsers = require('../middlewares/notForUsers');
const {
    validateLoginForm,
    validateRegistrationForm,
    validateResetPasswordForm,
    validateRestoreForm,
} = require('../middlewares/validation/user.validation');

const router = express.Router();

router.get(ROUTES.AUTH.LOGIN, notForUsers, AuthController.renderSignInForm);
router.get(ROUTES.AUTH.REGISTRATION, notForUsers, AuthController.renderRegistrationForm);
router.get(ROUTES.AUTH.RESET_PASSWORD, notForUsers, AuthController.renderResetPasswordForm);
router.get(ROUTES.AUTH.RESTORE_PASSWORD, notForUsers, AuthController.renderRestorePasswordForm);

router.post(ROUTES.AUTH.REGISTRATION, validateRegistrationForm(check), AuthController.register);
router.post(ROUTES.AUTH.LOGIN, validateLoginForm(check), AuthController.login);
router.post(ROUTES.AUTH.LOGOUT, AuthController.logout);
router.post(ROUTES.AUTH.RESET_PASSWORD, validateResetPasswordForm(check), AuthController.resetPassword);
router.post(ROUTES.AUTH.RESTORE_PASSWORD, validateRestoreForm(check), AuthController.restorePassword);

module.exports = router;
