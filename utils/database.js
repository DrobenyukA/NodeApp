const Sequelize = require('sequelize');

const { db } = require('../settings');

const options = {
    dialect: 'mysql',
    host: db.host,
};

const sequelize = new Sequelize(db.name, db.user, db.password, options);

module.exports = sequelize;
