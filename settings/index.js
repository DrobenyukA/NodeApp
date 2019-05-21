const path = require('path');
const dotenv = require('dotenv-safe');

dotenv.load({
    allowEmptyValues: true,
    path: path.join(__dirname, '../', '.env'),
    sample: path.join(__dirname, '../', '.env.example'),
});

module.exports = {
    db: {
        name: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
    },
};
