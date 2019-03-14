const getIndex = (req, res) => {
    res.render('shop/index', {
        path: req.path,
        pageTitle: 'Home page',
        pageHeader: 'Home page',
        products: [],
    });
};

const getCart = (req, res) => {
    res.render('shop/cart', {
        path: req.path,
        pageTitle: 'Cart',
        pageHeader: 'Cart',
    });
};

const getOrders = (req, res) => {
    res.render('shop/orders', {
        path: req.path,
        pageTitle: 'Orders',
        pageHeader: 'Orders',
    });
};

const checkout = (req, res) => {
    res.render('shop/checkout', {
        path: req.path,
        pageTitle: 'Checkout',
        pageHeader: 'Checkout',
    });
};

module.exports = {
    getIndex,
    getCart,
    getOrders,
    checkout,
};
