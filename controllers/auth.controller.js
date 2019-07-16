const ROUTES = require('../constants/routes');

const renderLoginForm = (req, res) => {
    // TODO: in case there is user, just redirect him to products page
    // if (req.user) {
    //     return res.redirect(ROUTES.PRODUCTS.BASE);
    // }
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

const authenticate = (req, res) => {
    // TODO: validate data
    // set cookie for valid user
    // redirect valid user to home page
    req.session.user = '5cf7e07cb4ea248872a3791b';
    return res.redirect('/');
    // send error for invalid user
};

const logout = (req, res) => {
    // TODO: clear session
    // redirect to login page
    req.session.destroy(() => res.redirect('/auth/login'));
};

module.exports = {
    renderLoginForm,
    authenticate,
    logout,
};
