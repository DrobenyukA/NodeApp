const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

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

CartItem.associate = (models) => {
    CartItem.belongsTo(models.cart, { constraints: true, onDelete: 'CASCADE' });
};

module.exports = CartItem;
