/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { first } = require('lodash');

const _ = require('./index');
const { LOGS_DIR } = require('../constants/path');

const STYLES_MAP = {
    ['GET']: '#17a2b8',
    ['POST']: '#28a745',
    ['PUT']: '#34dc5a',
    ['PATCH']: '#39f363',
    ['DELETE']: '#dc3545',
    ['OPTION']: '#6c757d',
    PORT: '#007bff',
};

// TODO: create logs files and write down all operations there
function printPort(port) {
    console.log(`Server started on ${chalk.hex(STYLES_MAP.PORT)(`http://localhost:${port}`)}`);
}

function printObject(object) {
    return JSON.stringify(object);
}

function logError(error) {
    const name = first(new Date().toISOString().split('T'));
    console.info(error);
    fs.promises
        .access(LOGS_DIR)
        .catch(() => fs.promises.mkdir(LOGS_DIR))
        .then(() => fs.promises.appendFile(path.join(LOGS_DIR, `${name}.log`), `\r${error}`))
        .catch((e) => console.error(e));
}

function logInfo(message) {
    console.info(message);
    const name = first(new Date().toISOString().split('T'));
    fs.promises
        .access(LOGS_DIR)
        .catch(() => fs.promises.mkdir(LOGS_DIR))
        .then(() => fs.promises.appendFile(path.join(LOGS_DIR, `${name}.log`), `\r${message}`))
        .catch((e) => console.error(e));
}

function logRequest({ method, path, params, query, body }, res, next) {
    const style = chalk.hex(STYLES_MAP[method]);
    console.log(style(`[${method}] ${path} `));
    if (!_.isEmpty(query)) {
        console.log(style(`    query: ${printObject(query)}`));
    }
    if (!_.isEmpty(params)) {
        console.log(style(`    params: ${printObject(params)}`));
    }
    if (!_.isEmpty(body)) {
        console.log(style(`    body: ${printObject(body)}`));
    }
    next();
}

module.exports = {
    logRequest,
    printPort,
    logError,
    logInfo,
};
