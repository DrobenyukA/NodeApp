const fs = require('fs');
const path = require('path');

const { INVOICES } = require('../constants/path');

const createInvoice = (order) => {};

const getInvoiceFile = (fileName) => fs.promises.readFile(path.join(INVOICES, fileName));

const getInvoiceFileStream = (fileName) => fs.createReadStream(path.join(INVOICES, fileName));

module.exports = {
    getInvoiceFile,
    createInvoice,
    getInvoiceFileStream,
};
