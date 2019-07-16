const mongoose = require('mongoose');

const { ORDER, USER, PRODUCT } = require('../constants/models');
const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema({
    productsData: [
        {
            title: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            origin: {
                type: ObjectId,
                required: true,
                ref: PRODUCT,
            },
        },
    ],
    user: {
        type: ObjectId,
        required: true,
        ref: USER,
    },
});

const model = mongoose.model(ORDER, schema);

module.exports = model;
