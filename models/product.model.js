const mongoose = require('mongoose');

const { USER, PRODUCT } = require('../constants/models');
const { logInfo } = require('../utils/logger');
const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 1,
    },
    image: {
        src: String,
        alt: String,
    },
    userId: {
        type: ObjectId,
        required: true,
        ref: USER,
    },
    description: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: Date,
});

const model = mongoose.model(PRODUCT, schema);
model.watch().on('change', (data) => logInfo(`Product changed at ${new Date().toISOString()}:${JSON.stringify(data)}`));

module.exports = model;
