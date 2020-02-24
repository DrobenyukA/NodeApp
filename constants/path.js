const path = require('path');

const APP_ROOT = path.dirname(process.mainModule.filename);
const LOGS_DIR = path.join(APP_ROOT, 'logs');

module.exports = {
    APP_ROOT,
    LOGS_DIR,
};
