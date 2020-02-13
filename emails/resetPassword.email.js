const ROUTES = require('../constants/routes');

module.exports = (email, token) => ({
    to: email,
    from: 'andriy.drobenyuk@gmail.com',
    subject: 'Password reset',
    html: `
        <h1>You are going to reset password</h1>
        <p>
            Please click on this
            <a href="http://localhost:3000${ROUTES.AUTH.RESTORE_PASSWORD.replace(':token', token)}"> 
                link
            </a>
            to reset the password
        </p>
        <p>If it wasn't you please contact our support</p>
    `,
});
