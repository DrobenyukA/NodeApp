const mongoose = require('mongoose');

const { USER, PRODUCT } = require('../constants/models');
const { EMAIL } = require('../constants/rules');
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
            validator: (v) => EMAIL.test(v),
            message: (props) => `${props.value} is not a valid email!`,
        },
    },
    password: {
        type: String,
        required: true,
    },
    resetToken: String,
    resetTokenExpiration: Date,
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
    products: [
        {
            type: ObjectId,
            ref: PRODUCT,
        },
    ],
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

module.exports = model;
