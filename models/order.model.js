const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    userId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
});

Order.associate = (models) => {
    Order.belongsTo(models.user, { constraints: true, onDelete: 'CASCADE' });
};

module.exports = Order;
