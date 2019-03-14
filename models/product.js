const fileStorage = require('../utils/fileStorage');

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
        return fileStorage.storeItem('books', {
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
            // TODO: implement me;
        }
        return this.store();
    }

    static getAll() {
        return fileStorage.read('books');
    }

    static getLatest() {
        // TODO: implement me
    }
}

module.exports = Product;
