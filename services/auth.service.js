const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const SALT = 12;

const isNotRegisteredEmail = (email) =>
    User.findOne({ email }).then((user) => {
        if (user) {
            return Promise.reject('User with this email already exists.');
        }
        return Promise.resolve(true);
    });

const isSameUser = (user, password) =>
    bcrypt.compare(user.password, password).then((result) => (result ? user : undefined));

const getUserDataFromRequest = ({ body }) => {
    const { name, email, password } = body;
    return { name, email, password };
};

const getUserByEmailAndPassword = ({ email, password }) =>
    User.findOne({ email }).then((user) =>
        user ? bcrypt.compare(password, user.password).then((result) => (result ? user : undefined)) : undefined,
    );

const createUser = (user) =>
    bcrypt.hash(user.password, SALT).then((hashedPassword) =>
        new User({
            email: user.email,
            name: user.name,
            password: hashedPassword,
            cart: { items: [] },
            isAdmin: false,
        }).save(),
    );

module.exports = {
    isNotRegisteredEmail,
    isSameUser,
    getUserDataFromRequest,
    getUserByEmailAndPassword,
    createUser,
};
