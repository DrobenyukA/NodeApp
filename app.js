const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const settings = require('./constants/settings');
const myLogger = require('./utils/logger');
const sequelize = require('./utils/database');
const appRouter = require('./routes/index');
const Product = require('./models/product.model');
const User = require('./models/user.model');
const Cart = require('./models/cart.model');
const { withUser } = require('./middlewares/user.middleware');

const app = express();
const port = process.env.port || 3000;

app.set('view engine', settings.VIEW_ENGINE_NAME);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(withUser);
app.use(myLogger.logRequest);
app.use(appRouter);

User.hasMany(Product);
User.hasOne(Cart);

sequelize
    // .sync({ force: true })
    .authenticate()
    .then(() => app.listen(port, () => myLogger.printPort(port)))
    .catch(({ message }) => myLogger.logError(`Unable to connect to the database: ${message}`));
