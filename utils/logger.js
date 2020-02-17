/* eslint-disable no-console */
const chalk = require('chalk');

const _ = require('./index');

const STYLES_MAP = {
    ['GET']: 'green',
    ['POST']: 'blue',
    ['PUT']: 'cyan',
    ['PATCH']: 'magenta',
    ['DELETE']: 'red',
    ['OPTION']: 'gray',
    PORT: 'purple',
};

// TODO: create logs files and write down all operations there
function printPort(port) {
    console.log(`Server started on ${chalk.keyword(STYLES_MAP.PORT)(`http://localhost:${port}`)}`);
    ``;
}

function printObject(object) {
    return JSON.stringify(object);
}

function logInfo(message) {
    console.info(message);
}

function logRequest({ method, path, params, query, body }, res, next) {
    const style = chalk[STYLES_MAP[method]];
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
    logError: console.error,
    logInfo,
};
