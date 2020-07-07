const path = require('path');
const dotenv = require('dotenv-safe');

dotenv.load({
    allowEmptyValues: true,
    path: path.join(__dirname, '../', '.env'),
    sample: path.join(__dirname, '../', '.env.example'),
});

module.exports = {
    general: {
        port: process.env.PORT,
    },
    db: {
        password: process.env.DB_PASSWORD,
        user: process.env.DB_USER,
        name: process.env.DB_NAME,
    },
    session: {
        secret: process.env.SESSION_SECRET,
    },
    email: {
        user: process.env.EMAIL_USER,
        key: process.env.EMAIL_KEY,
    },
    payments: {
        secret: process.env.STRIPE_KEY,
    },
    auth: {
        secret: process.env.AUTH_SECRET,
    },
};
