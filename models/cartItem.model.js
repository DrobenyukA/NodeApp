const Sequelize = require('sequelize');

const sequelize = require('../utils/database');
const Products = require('../models/product.model');
const Cart = require('../models/cart.model');

const CartItem = sequelize.define('cartItem', {
    id: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    quantity: {
        type: Sequelize.INTEGER(11),
        defaultValue: 1,
    },
    cartId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Cart',
            key: 'id',
        },
    },
});

Products.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Products, { through: CartItem });

module.exports = CartItem;
