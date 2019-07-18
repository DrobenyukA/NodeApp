const bcrypt = require('bcryptjs');
const ROUTES = require('../constants/routes');
const RULES = require('../constants/rules');
const User = require('../models/user.model');

const renderLoginForm = (req, res) => {
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
        user: undefined,
    });
};

const renderSighupForm = (req, res) => {
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
        error: undefined,
    });
};

const register = (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    let error = undefined;
    if (!RULES.EMAIL.test(email)) {
        error = 'Invalid email address';
    }
    if (password !== confirmPassword) {
        error = 'Passwords are not equal';
    }
    if (error) {
        return res.render('auth/signup-form', {
            path: req.path,
            pageTitle: 'Signup',
            pageHeader: 'Please fill in form to signup',
            actions: {
                signup: ROUTES.AUTH.SIGNUP,
            },
            user: undefined,
            userData: { name, email },
            error,
        });
    }
    return User.findOne({ email })
        .then((user) => {
            if (user) {
                throw new Error('User with this email already exists.');
            }
            return bcrypt.hash(password, 12);
        })
        .then((password) =>
            new User({
                email,
                name,
                password,
                cart: { items: [] },
                isAdmin: false,
            }).save(),
        )
        .then(() => res.redirect('/auth/login'))
        .catch(({ message }) =>
            res.render('auth/signup-form', {
                path: req.path,
                pageTitle: 'Signup',
                pageHeader: 'Please fill in form to signup',
                actions: {
                    signup: ROUTES.AUTH.SIGNUP,
                },
                user: undefined,
                userData: { name, email },
                error: message,
            }),
        );
};

const authenticate = (req, res) => {
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
        .catch(({ message }) =>
            res.render('error', {
                path: req.param,
                pageTitle: 'Error',
                pageHeader: 'Sorry, something went wrong.',
                message,
                user: undefined,
            }),
        );
};

const logout = (req, res) => req.session.destroy(() => res.redirect('/auth/login'));

module.exports = {
    renderSighupForm,
    renderLoginForm,
    authenticate,
    register,
    logout,
};
