'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Products', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            title: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            price: {
                allowNull: false,
                type: Sequelize.DOUBLE,
            },
            imageSrc: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            imageAlt: {
                type: Sequelize.STRING,
            },
            description: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id',
                },
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: new Date(),
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: new Date(),
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Products');
    },
};
