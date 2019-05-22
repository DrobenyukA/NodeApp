const mongodb = require('mongodb');

const { db } = require('../settings');

const options = { useNewUrlParser: true };

let connection;

const connect = () =>
    mongodb.MongoClient.connect(
        `mongodb+srv://${db.user}:${db.password}@cluster0-th0fc.gcp.mongodb.net/shop?retryWrites=true`,
        options,
    ).then((client) => {
        connection = client.db();
        return client;
    });

const getConnection = () => {
    if (connection) {
        return connection;
    }
    throw new Error('There is nod db connection.');
};

module.exports = {
    connect,
    getConnection,
    ObjectId: mongodb.ObjectId,
};
