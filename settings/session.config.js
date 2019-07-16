const connectDB = require('connect-mongodb-session');
const session = require('express-session');

const { url } = require('../utils/database');
const { secret } = require('./index').session;
const MongoDBStore = connectDB(session);

const store = new MongoDBStore({
    uri: url,
    collection: 'session',
});

module.exports = {
    store,
    resave: false,
    secret: secret,
    saveUninitialized: false,
};
