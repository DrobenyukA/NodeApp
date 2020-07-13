const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isUndefined } = require('lodash');

const { auth } = require('../settings');
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

const getClientUser = (user) => ({
    name: user.name,
    email: user.email,
    cart: user.cart,
    roles: [user.isAdmin ? 'admin' : 'customer'],
});

const getUserByEmailAndPassword = ({ email, password }, withID = false) =>
    User.findOne({ email })
        .then((user) => {
            if (isUndefined(user)) {
                throw new Error('There is no such user');
            }
            return bcrypt.compare(password, user.password).then((hasSamePassword) => {
                if (hasSamePassword) {
                    return user;
                }
                throw new Error('Invalid credentials');
            });
        })
        .then((user) => {
            const token = jwt.sign({ userId: user._id.toString() }, auth.secret, { expiresIn: '15m' });
            if (withID) {
                return user;
            }
            return { ...getClientUser(user), token };
        });

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
    getClientUser,
    getUserDataFromRequest,
    getUserByEmailAndPassword,
    createUser,
};
