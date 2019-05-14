const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Cart = sequelize.define('cart', {
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

Cart.associate = (models) => {
    Cart.belongsTo(models.user, { constraints: true, onDelete: 'CASCADE' });
    // Cart.belongsToMany(models.product, { through: models.cartItem });
};

module.exports = Cart;
