const mongoose = require('mongoose');
const { db } = require('../settings');

const url = `mongodb+srv://${db.user}:${db.password}@cluster0-th0fc.gcp.mongodb.net/${db.name}`;
const options = { useNewUrlParser: true };

module.exports = {
    url,
    connect: () => mongoose.connect(url, options),
};
