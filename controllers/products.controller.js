const ROUTES = require('../constants/routes');
const ProductModel = require('../models/product.model');

const user = {
    isAdmin: true,
};

const createProduct = (req, res) => {
    res.render('admin/product-form', {
        path: req.path,
        pageTitle: 'Add product',
        pageHeader: 'Add product',
        submitHandlerPath: ROUTES.ADMIN.ADD_PRODUCT,
        product: {},
        user,
    });
};

const storeProduct = (req, res) => {
    // TODO: add book validation
    const { id, title, price, imageSrc, imageAlt, description } = req.body;
    if (!id) {
        return req.user
            .createProduct({ title, price, imageSrc, imageAlt, description })
            .then(() => res.redirect(ROUTES.ROOT))
            .catch(({ message }) =>
                res.render('error', {
                    path: req.param,
                    pageTitle: 'Error',
                    pageHeader: 'Sorry, something went wrong.',
                    message,
                    user,
                }),
            );
    }
    return ProductModel.findByPk(+id)
        .then((product) => {
            product.title = title;
            product.price = price;
            product.imageSrc = imageSrc;
            product.imageAlt = imageAlt;
            product.description = description;
            return product.save();
        })
        .then(() => res.redirect(ROUTES.ROOT))
        .catch(({ message }) =>
            res.render('error', {
                path: req.param,
                pageTitle: 'Error',
                pageHeader: 'Sorry, something went wrong.',
                message,
                user,
            }),
        );
};

const handleProductNotFound = (req, res) => {
    res.status(404).render('404', {
        path: req.path,
        pageTitle: 'Product not found',
        pageHeader: 'Product not found.',
        user,
    });
};

const getProducts = (req, res) => {
    ProductModel.findAll()
        .then((books) => {
            return res.render('shop/products-list', {
                path: req.path,
                pageTitle: 'Books shop',
                pageHeader: 'My Products',
                products: books,
                user,
                actions: {
                    viewProduct: ROUTES.PRODUCTS.PRODUCT,
                    addToCart: ROUTES.CART.BASE,
                    editProduct: ROUTES.ADMIN.EDIT_PRODUCT,
                    deleteProduct: ROUTES.ADMIN.DELETE_PRODUCT,
                },
            });
        })
        .catch(({ message }) =>
            res.render('error', {
                path: req.param,
                pageTitle: 'Error',
                pageHeader: 'Sorry, something went wrong.',
                message,
                user,
            }),
        );
};

const getProduct = (req, res) => {
    const { id } = req.params;
    ProductModel.findByPk(+id)
        .then((product) => {
            if (product) {
                return res.render('shop/product', {
                    path: req.path,
                    pageTitle: `Books shop | ${product.title}`,
                    pageHeader: `Product ${product.title}`,
                    product,
                    user,
                    actions: {
                        addToCart: ROUTES.CART.BASE,
                    },
                });
            } else {
                return handleProductNotFound(req, res);
            }
        })
        .catch(({ message }) =>
            res.render('error', {
                path: req.param,
                pageTitle: 'Error',
                pageHeader: 'Sorry, something went wrong.',
                message,
                user,
            }),
        );
};

const editProduct = (req, res) => {
    const { id } = req.params;
    const user = {
        isAdmin: true,
    };

    if (user.isAdmin) {
        return ProductModel.findByPk(+id)
            .then((product) => {
                if (product) {
                    res.render('admin/product-form', {
                        path: req.path,
                        pageTitle: 'Edit product',
                        pageHeader: `Edit ${product.title}`,
                        submitHandlerPath: ROUTES.ADMIN.UPDATE_PRODUCT,
                        product,
                        user,
                    });
                }
            })
            .catch(({ message }) =>
                res.render('error', {
                    path: req.param,
                    pageTitle: 'Error',
                    pageHeader: 'Sorry, something went wrong.',
                    message,
                    user,
                }),
            );
    }

    return req.stats(401).redirect(ROUTES.PRODUCTS.BASE);
};

const deleteProduct = (req, res) => {
    const { id } = req.body;
    return ProductModel.findByPk(+id)
        .then((product) => {
            if (product) {
                return product.destroy();
            }
            throw new Error(`Can't find product with id ${id}`);
        })
        .then(() => res.redirect(ROUTES.ROOT))
        .catch(({ message }) => {
            return res.render('error', {
                path: req.param,
                pageTitle: 'Error',
                pageHeader: 'Sorry, something went wrong.',
                message,
                user,
            });
        });
};

module.exports = {
    createProduct,
    editProduct,
    deleteProduct,
    getProducts,
    handleProductNotFound,
    storeProduct,
    getProduct,
};
