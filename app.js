const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const settings = require('./constants/settings');
const myLogger = require('./utils/logger');
const appRouter = require('./routes/index');
const db = require('./utils/database');

const app = express();
const port = process.env.port || 3000;

app.set('view engine', settings.VIEW_ENGINE_NAME);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(myLogger.logRequest);
app.use(appRouter);

db.connect()
    .then(() => {
        app.listen(port, () => myLogger.printPort(port));
    })
    .catch(({ message }) => myLogger.logError(message));

// TODO: add graceful shutdown
