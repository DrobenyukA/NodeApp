const ROUTES = require('../constants/routes');
const ProductModel = require('../models/product');

const user = {
    isAdmin: false,
};

const getProductForm = (req, res) => {
    res.render('admin/product-form', {
        path: req.path,
        pageTitle: 'Add product',
        pageHeader: 'Add product',
        submitHandlerPath: ROUTES.ADMIN.ADD_PRODUCT,
        product: {},
    });
};

const storeProduct = (req, res) => {
    // TODO: add book validation
    const product = new ProductModel({
        title: req.body.title,
        price: req.body.price,
        image: {
            src: req.body.imageSrc,
            alt: req.body.imageAlt,
        },
        description: req.body.description,
    });
    return product
        .store()
        .then(() => res.redirect(ROUTES.ROOT))
        .catch(({ message }) =>
            res.render('error', {
                path: req.param,
                pageTitle: 'Error',
                pageHeader: 'Sorry, something went wrong.',
                message,
            }),
        );
};

const handleProductNotFound = (req, res) => {
    res.status(404).render('404', {
        path: req.path,
        pageTitle: 'Product not found',
        pageHeader: 'Product not found.',
    });
};

const getProducts = (req, res) => {
    ProductModel.getAll().then((books) => {
        return res.render('shop/products-list', {
            path: req.path,
            pageTitle: 'Books shop',
            pageHeader: 'My Products',
            products: books,
            user,
            actions: {
                addProduct: '',
                editProduct: '',
                deleteProduct: '',
            },
        });
    });
};

module.exports = {
    getProductForm,
    getProducts,
    handleProductNotFound,
    storeProduct,
};
