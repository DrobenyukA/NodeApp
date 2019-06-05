const path = require('path');
const dotenv = require('dotenv-safe');

dotenv.load({
    allowEmptyValues: true,
    path: path.join(__dirname, '../', '.env'),
    sample: path.join(__dirname, '../', '.env.example'),
});

module.exports = {
    db: {
        password: process.env.DB_PASSWORD,
        user: process.env.DB_USER,
        name: process.env.DB_NAME,
    },
};
