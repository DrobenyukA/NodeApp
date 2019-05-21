module.exports = {
    ROOT: '/',
    ADMIN: {
        BASE: '/admin',
        CREATE_PRODUCT: '/admin/product/create',
        DELETE_PRODUCT: '/admin/product/delete',
        UPDATE_PRODUCT: '/admin/product/update',
        EDIT_PRODUCT: '/admin/product/:id/edit',
    },
    PRODUCTS: {
        BASE: '/products',
        PRODUCT: '/products/:id',
    },
    CART: {
        BASE: '/cart',
        DELETE_ITEM: '/cart/item/delete',
    },
    ORDERS: {
        BASE: '/orders',
        ORDER: '/orders/:id',
        CHECKOUT: '/checkout',
    },
};
