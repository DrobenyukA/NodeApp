const mongoose = require('mongoose');

const { USER, PRODUCT } = require('../constants/models');
const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        validate: {
            // eslint-disable-next-line
            validator: (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
            message: (props) => `${props.value} is not a valid phone number!`,
        },
    },
    cart: {
        items: [
            {
                product: {
                    type: ObjectId,
                    required: true,
                    ref: PRODUCT,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
    isAdmin: Boolean,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: Date,
});

schema.methods.addToCart = function(product, quantity = 1) {
    const cartProduct = this.cart.items.findIndex((item) => product.id.toString() === item.product.toString());
    if (cartProduct >= 0) {
        this.cart.items[cartProduct].quantity += quantity;
    } else {
        this.cart.items.push({
            product: product._id,
            quantity,
        });
    }
    return this.save();
};

schema.methods.getCart = function() {
    return this.populate('cart.items.product', 'title price _id')
        .execPopulate()
        .then(({ cart }) =>
            cart.items.reduce(
                (result, { product, quantity }) => {
                    result.products.push({ ...product.toObject(), quantity });
                    result.totalPrice += quantity * product.price;
                    return result;
                },
                { products: [], totalPrice: 0 },
            ),
        );
};

schema.methods.deleteFromCart = function(id, quantity = 1) {
    const index = this.cart.items.findIndex(({ product }) => id.toString() === product.toString());
    if (this.cart.items[index].quantity <= quantity) {
        this.cart.items = this.cart.items.filter((item, position) => position !== index);
    } else {
        this.cart.items[index].quantity -= parseInt(quantity);
    }
    return this.save();
};

const model = mongoose.model(USER, schema);

// const { getConnection, ObjectId } = require('../utils/database');

// class User {
//     constructor({ _id, name, email, isAdmin, cart, createdAt }) {
//         this.id = _id;
//         this.name = name;
//         this.email = email;
//         this.cart = cart || { items: [] };
//         this.createdAt = createdAt || new Date().toISOString();
//         this.isAdmin = isAdmin || false;
//     }

//     store() {
//         if (this.id) {
//             return this.update();
//         }
//         const db = getConnection();
//         return db.collection('users').insertOne({
//             name: this.name,
//             email: this.email,
//             cart: this.cart,
//             isAdmin: false,
//             createdAt: this.createdAt,
//         });
//     }

//     update() {
//         if (this.id) {
//             const db = getConnection();
//             return db.collection('users').updateOne(
//                 { _id: ObjectId(this.id) },
//                 {
//                     $set: {
//                         name: this.name,
//                         email: this.email,
//                         cart: this.cart,
//                         updated_at: new Date().toISOString(),
//                     },
//                 },
//             );
//         }
//         return this.store();
//     }

//     set isAdmin(val) {}

//     static findById(id) {
//         const db = getConnection();
//         return db.collection('users').findOne({ _id: ObjectId(id) });
//     }

//     getOrders() {
//         const db = getConnection();
//         return db
//             .collection('orders')
//             .find({ userId: this.id })
//             .toArray();
//     }
// }

module.exports = model;
