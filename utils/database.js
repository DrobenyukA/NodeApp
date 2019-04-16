const mysql = require('mysql2');

const { db } = require('../settings');

const pool = mysql.createPool({
    host: db.host,
    user: db.user,
    database: db.name,
    password: db.password,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = {
    pool: pool.promise(),
};
