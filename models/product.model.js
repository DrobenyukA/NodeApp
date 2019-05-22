const fileStorage = require('../utils/fileStorage');
const { getConnection, ObjectId } = require('../utils/database');
// const CartModel = require('./cart.model');

class Product {
    constructor(product) {
        this.id = product.id;
        this.title = product.title || '';
        this.price = product.price || 0;
        this.image = product.image || {
            src: 'https://images-na.ssl-images-amazon.com/images/I/41LBzpPXCOL._SX379_BO1,204,203,200_.jpg',
            alt: 'Refactoring: Improving the Design of Existing Code',
        };
        this.description = product.description || '';
        this.created_at = new Date().toISOString();
        this.updated_at = undefined;
    }

    store() {
        if (this.id) {
            return this.update();
        }
        const db = getConnection();
        return db.collection('products').insertOne({
            title: this.title,
            price: this.price,
            image: this.image,
            description: this.description,
            created_at: this.created_at,
            updated_at: this.updated_at,
        });
    }

    update() {
        if (this.id) {
            const db = getConnection();
            return db.collection('products').updateOne(
                { _id: ObjectId(this.id) },
                {
                    $set: {
                        title: this.title,
                        price: this.price,
                        image: this.image,
                        description: this.description,
                        updated_at: new Date().toISOString(),
                    },
                },
            );
        }
        return this.store();
    }

    static getAll() {
        const db = getConnection();
        return db
            .collection('products')
            .find()
            .toArray();
    }

    static getLatest() {
        // TODO: implement me
    }

    static getProduct(id) {
        const db = getConnection();
        return db
            .collection('products')
            .find({ _id: ObjectId(id) })
            .next();
        // return fileStorage.read('books').then((books) => books.find((book) => book.id === id));
    }

    static delete(id) {
        const db = getConnection();
        return db.collection('products').deleteOne({ _id: ObjectId(id) });
    }

    static getProductsByIds(ids) {
        return fileStorage.read('books').then((books) => books.filter((book) => !!ids.find((id) => id === book.id)));
    }

    toObject() {
        return {
            id: this.id,
            title: this.title,
            price: this.price,
            image: this.image,
            description: this.description,
            created_at: this.created_at,
            updated_at: new Date().toISOString(),
        };
    }
}

module.exports = Product;
