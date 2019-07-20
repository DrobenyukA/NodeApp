const nodeMailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const { email } = require('../settings');

const options = {
    auth: {
        api_key: email.key,
    },
};

const transporter = nodeMailer.createTransport(sendGridTransport(options));

module.exports = transporter;
