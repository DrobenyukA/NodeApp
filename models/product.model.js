const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    imageSrc: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    imageAlt: Sequelize.STRING,
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

Product.associate = (models) => {
    Product.belongsTo(models.user, { constraints: true, onDelete: 'CASCADE' });
    // Product.belongsToMany(models.cart, { through: models.cartItem });
};

module.exports = Product;
