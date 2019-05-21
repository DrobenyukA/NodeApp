const Sequelize = require('sequelize');

const sequelize = require('../utils/database');
const Product = require('../models/product.model');
const Order = require('../models/order.model');

const OrderItem = sequelize.define('orderItem', {
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
    orderId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Order',
            key: 'id',
        },
    },
});

Product.belongsToMany(Order, { through: OrderItem });
Order.belongsToMany(Product, { through: OrderItem });

module.exports = OrderItem;
