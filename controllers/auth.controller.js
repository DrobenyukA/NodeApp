const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

const ROUTES = require('../constants/routes');
const User = require('../models/user.model');
const mailer = require('../utils/mailer');
const { getErrors } = require('../utils/errors');
const { isEmpty } = require('../utils');

const renderSignInForm = (req, res) => {
    if (req.user) {
        return res.redirect(ROUTES.PRODUCTS.BASE);
    }
    return res.render('auth/login-form', {
        path: req.path,
        pageTitle: 'Login',
        pageHeader: 'Please enter your credential to login',
        actions: {
            loginHandler: ROUTES.AUTH.LOGIN,
        },
        links: {
            resetPassword: ROUTES.AUTH.RESET_PASSWORD,
        },
        user: undefined,
        errors: {},
    });
};

const renderSignUpForm = (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    return res.render('auth/signup-form', {
        path: req.path,
        pageTitle: 'Signup',
        pageHeader: 'Please fill in form to signup',
        actions: {
            signup: ROUTES.AUTH.SIGNUP,
        },
        user: undefined,
        userData: {},
        errors: {},
    });
};

const renderResetPasswordForm = (req, res) => {
    return res.render('auth/reset-password-form', {
        path: req.path,
        pageTitle: 'Reset password',
        pageHeader: 'Please enter your email',
        actions: {
            resetHandler: ROUTES.AUTH.RESET_PASSWORD,
        },
        user: undefined,
        userData: {},
        errors: {},
    });
};

const renderRestorePasswordForm = (req, res) => {
    const { token } = req.params;
    if (!token) {
        req.flash('error', 'You do not have restore token');
        res.redirect(ROUTES.AUTH.RESET_PASSWORD);
    }
    res.render('auth/restore-password-form', {
        path: req.path,
        pageTitle: 'Reset password',
        pageHeader: 'Please enter your email',
        actions: {
            restoreHandler: ROUTES.AUTH.RESTORE_PASSWORD.replace(':token', ''),
        },
        user: undefined,
        userData: {},
        resetToken: token,
        errors: {},
    });
};

const register = (req, res) => {
    const { name, email, password } = req.body;
    const errors = getErrors(validationResult(req).array());
    if (!isEmpty(errors)) {
        return res.status(422).render('auth/signup-form', {
            path: req.path,
            pageTitle: 'Signup',
            pageHeader: 'Please fill in form to signup',
            actions: {
                signup: ROUTES.AUTH.SIGNUP,
            },
            user: undefined,
            userData: { name, email },
            errors,
        });
    }
    return bcrypt
        .hash(password, 12)
        .then((password) =>
            new User({
                email,
                name,
                password,
                cart: { items: [] },
                isAdmin: false,
            }).save(),
        )
        .then(() =>
            mailer.sendMail({
                to: email,
                from: 'andriy.drobenyuk@gmail.com',
                subject: 'Signup succeeded.',
                html: '<h1>You have been signup successfully</h1>',
            }),
        )
        .then(() => res.redirect('/auth/login'))
        .catch(({ msg }) =>
            res.status(422).render('auth/signup-form', {
                path: req.path,
                pageTitle: 'Signup',
                pageHeader: 'Please fill in form to signup',
                actions: {
                    signup: ROUTES.AUTH.SIGNUP,
                },
                user: undefined,
                userData: { name, email },
                errors: {
                    all: [{ msg }],
                },
            }),
        );
};

const login = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email })
        .then((user) => {
            if (user) {
                return user;
            }
            throw new Error('Please enter valid credentials to sign in.');
        })
        .then((user) => bcrypt.compare(password, user.password).then((isEqual) => (isEqual ? user._id : undefined)))
        .then((userId) => {
            if (userId) {
                req.session.user = userId;
                return res.redirect('/');
            }
            throw new Error('Please enter valid credentials to sign in.');
        })
        .catch(({ message }) => {
            req.flash('error', message);
            return res.redirect(ROUTES.AUTH.LOGIN);
        });
};

const logout = (req, res) => req.session.destroy(() => res.redirect('/auth/login'));

const resetPassword = (req, res) => {
    const { email } = req.body;
    crypto.randomBytes(32, (error, buffer) => {
        if (error) {
            req.flash('error', error.message);
            return res.redirect(ROUTES.AUTH.RESET_PASSWORD);
        }
        const token = buffer.toString('hex');
        User.findOne({ email })
            .then((user) => {
                if (!user) {
                    throw new Error('There is no user with this email');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(() => {
                mailer.sendMail({
                    to: email,
                    from: 'andriy.drobenyuk@gmail.com',
                    subject: 'Password reset',
                    html: `
                        <h1>You are going to reset password</h1>
                        <p>
                            Please click on this
                            <a href="http://localhost:3000${ROUTES.AUTH.RESTORE_PASSWORD.replace(':token', token)}"> 
                                link
                            </a>
                            to reset the password
                        </p>
                        <p>If it wasn't you please contact our support</p>
                    `,
                });

                req.flash('success', 'Please check you email address');
                return res.redirect(ROUTES.AUTH.RESET_PASSWORD);
            })
            .catch(({ message }) => {
                req.flash('error', message);
                return res.redirect(ROUTES.AUTH.RESET_PASSWORD);
            });
    });
};

const restorePassword = (req, res) => {
    const { resetToken, newPassword, confirmPassword } = req.body;

    if (!resetToken) {
        req.flash('error', 'You do not have restore token');
        res.redirect(ROUTES.AUTH.RESET_PASSWORD);
    }

    if (newPassword !== confirmPassword) {
        req.flash('error', 'Passwords are not equal');
        return res.redirect(ROUTES.AUTH.RESTORE_PASSWORD.replace(':token', resetToken));
    }

    User.findOne({ resetToken, resetTokenExpiration: { $gt: Date.now() } })
        .then((user) => {
            if (!user) {
                throw new Error('There is not such user or password restore period has expired');
            }
            return bcrypt.hash(newPassword, 12).then((password) => [password, user]);
        })
        .then(([password, user]) => {
            user.password = password;
            user.resetToken = undefined;
            user.resetTokenExpiration = undefined;
            return user.save();
        })
        .then(() => res.redirect(ROUTES.AUTH.LOGIN))
        .catch(({ message }) => {
            req.flash('error', message);
            return res.redirect(ROUTES.AUTH.RESTORE_PASSWORD.replace(':token', resetToken));
        });
};

module.exports = {
    renderRestorePasswordForm,
    renderResetPasswordForm,
    renderSignUpForm,
    renderSignInForm,
    restorePassword,
    resetPassword,
    login,
    register,
    logout,
};
