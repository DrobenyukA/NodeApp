const fileStorage = require('../utils/fileStorage');

class Cart {
    static getCart() {
        return fileStorage.read('cart');
    }

    static addToCart(id, price, quantity = 1) {
        return fileStorage.read('cart').then(({ products, totalPrice }) => {
            const cartIndex = products.findIndex((item) => item.productId === id);

            if (cartIndex >= 0) {
                products[cartIndex].quantity += quantity;
            } else {
                products.push({ productId: id, quantity });
            }
            totalPrice += price * quantity;
            return fileStorage.write('cart', { products, totalPrice });
        });
    }

    static deleteProduct(id, price) {
        return fileStorage.read('cart').then(({ products, totalPrice }) => {
            const result = products.reduce(
                (updatedCart, item) => {
                    if (item.productId === id) {
                        updatedCart.totalPrice -= item.quantity * price;
                    } else {
                        updatedCart.products.push(item);
                    }
                    return updatedCart;
                },
                { products: [], totalPrice },
            );
            return fileStorage.write('cart', result);
        });
    }

    static storeCart(cart) {
        return fileStorage.write('cart', cart);
    }
}

module.exports = Cart;
