module.exports = {
    ROOT: '/',
    PRODUCTS: {
        BASE: '/products',
        PRODUCT: '/products/:id',
        CREATE: '/products/create',
        UPDATE: '/products/update',
        EDIT: '/products/edit/:id',
        DELETE: '/products/delete',
    },
    CART: {
        BASE: '/cart',
        DELETE_ITEM: '/cart/item/delete',
    },
    ORDERS: {
        BASE: '/orders',
        INVOICE: '/orders/invoice/:orderId',
        CHECKOUT: '/orders/checkout',
        CHECKOUT_SUCCESS: '/orders/checkout/success',
        CHECKOUT_FAILED: '/orders/checkout/failed',
    },
    AUTH: {
        BASE: '/auth',
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REGISTRATION: '/auth/registration',
        RESET_PASSWORD: '/auth/reset-password',
        RESTORE_PASSWORD: '/auth/restore-password/:token',
    },
    IMAGES: {
        BASE: '/images',
        PRODUCTS: '/images/products',
    },
};
