const user = {
    isAdmin: false,
};

const getIndex = (req, res) => {
    res.render('shop/index', {
        path: req.path,
        pageTitle: 'Home page',
        pageHeader: 'Home page',
        products: [],
        user,
    });
};

const getCart = (req, res) => {
    res.render('shop/cart', {
        path: req.path,
        pageTitle: 'Cart',
        pageHeader: 'Cart',
        user,
    });
};

const getOrders = (req, res) => {
    res.render('shop/orders', {
        path: req.path,
        pageTitle: 'Orders',
        pageHeader: 'Orders',
        user,
    });
};

const checkout = (req, res) => {
    res.render('shop/checkout', {
        path: req.path,
        pageTitle: 'Checkout',
        pageHeader: 'Checkout',
        user,
    });
};

module.exports = {
    getIndex,
    getCart,
    getOrders,
    checkout,
};
