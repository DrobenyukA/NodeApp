const path = require('path');

const APP_ROOT = path.dirname(process.mainModule.filename);
const LOGS_DIR = path.join(APP_ROOT, 'logs');
const DATA = path.join(APP_ROOT, 'data');
const INVOICES = path.join(APP_ROOT, 'data', 'invoices');

module.exports = {
    APP_ROOT,
    LOGS_DIR,
    DATA,
    INVOICES,
};
