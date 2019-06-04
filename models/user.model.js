const { getConnection, ObjectId } = require('../utils/database');

class User {
    constructor({ _id, name, email, isAdmin, cart, createdAt }) {
        this.id = _id;
        this.name = name;
        this.email = email;
        this.cart = cart || { items: [] };
        this.createdAt = createdAt || new Date().toISOString();
        this.isAdmin = isAdmin || false;
    }

    store() {
        if (this.id) {
            return this.update();
        }
        const db = getConnection();
        return db.collection('users').insertOne({
            name: this.name,
            email: this.email,
            cart: this.cart,
            isAdmin: false,
            createdAt: this.createdAt,
        });
    }

    update() {
        if (this.id) {
            const db = getConnection();
            return db.collection('users').updateOne(
                { _id: ObjectId(this.id) },
                {
                    $set: {
                        name: this.name,
                        email: this.email,
                        cart: this.cart,
                        updated_at: new Date().toISOString(),
                    },
                },
            );
        }
        return this.store();
    }

    addToCart(product, quantity = 1) {
        const cartProduct = this.cart.items.findIndex((item) => product.id.toString() === item.productId.toString());
        if (cartProduct >= 0) {
            this.cart.items[cartProduct].quantity += quantity;
        } else {
            this.cart.items.push({
                productId: product.id,
                quantity,
            });
        }
        return this.store();
    }

    getCart() {
        const db = getConnection();
        const productIds = this.cart.items.map(({ productId }) => ObjectId(productId));
        return db
            .collection('products')
            .find({
                _id: {
                    $in: productIds,
                },
            })
            .toArray()
            .then((products) => {
                return products.reduce(
                    (cart, product) => {
                        const cartItem = this.cart.items.find(
                            ({ productId }) => product._id.toString() === productId.toString(),
                        );
                        cart.products.push({
                            ...product,
                            quantity: +cartItem.quantity,
                        });
                        cart.totalPrice += parseFloat(product.price) * cartItem.quantity;
                        return cart;
                    },
                    { products: [], totalPrice: 0 },
                );
            });
    }
    set isAdmin(val) {}

    static findById(id) {
        const db = getConnection();
        return db.collection('users').findOne({ _id: ObjectId(id) });
    }

    deleteFromCart(id, quantity = 1) {
        const index = this.cart.items.findIndex(({ productId }) => id.toString() === productId.toString());
        if (this.cart.items[index].quantity <= quantity) {
            this.cart.items = this.cart.items.filter((item, position) => position !== index);
        } else {
            this.cart.items[index].quantity -= parseInt(quantity);
        }
        return this.update();
    }

    addOrder() {
        const db = getConnection();
        if (this.cart.items.length) {
            return this.getCart().then((cart) =>
                db
                    .collection('orders')
                    .insertOne({
                        userId: this.id,
                        items: cart.products,
                        status: 'pending',
                        createdAt: new Date().toISOString(),
                        updatedAt: null,
                    })
                    .then(() => {
                        this.cart.items = [];
                        return this.update();
                    }),
            );
        }
        return Promise.resolve();
    }

    getOrders() {
        const db = getConnection();
        return db
            .collection('orders')
            .find({ userId: this.id })
            .toArray();
    }
}

module.exports = User;
