const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');

const logger = require('./utils/logger');
const appRouter = require('./routes/index');
const db = require('./utils/database');
const withUser = require('./middlewares/withUser');
const withLocals = require('./middlewares/withLocals');
const withProductImage = require('./middlewares/withProductImage');
const configs = require('./settings/configs');
const settings = require('./settings');
const { PUBLIC } = require('./constants/path');
const { startServer } = require('./utils/server');

const app = express();

app.set('view engine', configs.viewEngine);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(PUBLIC));
app.use(session(configs.session));
app.use(withProductImage);
app.use(csrf());
app.use(flash());
app.use(logger.logRequest);
app.use(withUser);
app.use(withLocals);
app.use(appRouter);

db.connect()
    .then(() => startServer(app, settings.general.port))
    .catch(({ message }) => logger.logError(message));
