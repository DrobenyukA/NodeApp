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
    const { title, price, description, imageSrc: src, imageAlt: alt } = req.body;
    const { _id: userId } = req.user || { _id: undefined };
    // TODO: add book validation
    const product = new ProductModel({
        title,
        price,
        image: {
            src: src || 'https://cdn1.iconfinder.com/data/icons/notes-filled-line/64/note-text-empty-book-512.png',
            alt,
        },
        description,
        userId,
    });
    return product
        .save()
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

const updateProduct = (req, res) => {
    const { id: productId, title, price, description, imageSrc: src, imageAlt: alt } = req.body;
    if (productId) {
        return ProductModel.findById(productId)
            .then((product) => {
                product.title = title;
                product.price = price;
                product.description = description;
                product.image.src = src;
                product.image.alt = alt;
                product.updatedAt = new Date().toISOString();
                return product.save();
            })
            .then(() => res.redirect(ROUTES.ROOT))
            .catch();
    }
    return handleProductNotFound(req, res);
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
    ProductModel.find()
        // .select('name price, description, -image.src')
        .then((products) =>
            res.render('shop/products-list', {
                path: req.path,
                pageTitle: 'Books shop',
                pageHeader: 'My Products',
                products,
                user,
                actions: {
                    viewProduct: ROUTES.PRODUCTS.PRODUCT,
                    addToCart: ROUTES.CART.BASE,
                    editProduct: ROUTES.ADMIN.EDIT_PRODUCT,
                    deleteProduct: ROUTES.ADMIN.DELETE_PRODUCT,
                },
            }),
        )
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
    ProductModel.findById(id)
        .then((product) => {
            if (product) {
                return res.render('shop/product-details', {
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
        return ProductModel.findById(id)
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
    return ProductModel.findByIdAndDelete(id) // .then(() => req.user.deleteFromCart(id, Infinity))
        .then(() => res.redirect(ROUTES.PRODUCTS.BASE))
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
    updateProduct,
    getProduct,
};
