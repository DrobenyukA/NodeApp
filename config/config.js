const { db } = require('../settings');

module.exports = {
    development: {
        username: db.user,
        password: db.password,
        database: db.name,
        host: 'localhost',
        dialect: 'mysql',
    },
    test: {
        username: db.user,
        password: db.password,
        database: db.name,
        host: 'localhost',
        dialect: 'mysql',
    },
    production: {
        username: db.user,
        password: db.password,
        database: db.name,
        host: 'localhost',
        dialect: 'mysql',
    },
};
