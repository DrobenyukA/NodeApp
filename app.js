const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');

const myLogger = require('./utils/logger');
const appRouter = require('./routes/index');
const db = require('./utils/database');
const withUser = require('./middlewares/withUser');
const withLocals = require('./middlewares/withLocals');
const configs = require('./settings/configs');

const app = express();
const port = process.env.port || 3000;

app.set('view engine', configs.viewEngine);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(configs.session));
app.use(csrf());
app.use(flash());
app.use(myLogger.logRequest);
app.use(withUser);
app.use(withLocals);
app.use(appRouter);

db.connect()
    .then(() => {
        app.listen(port, () => myLogger.printPort(port));
    })
    .catch(({ message }) => myLogger.logError(message));

// TODO: add graceful shutdown
