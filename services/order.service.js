const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const { INVOICES } = require('../constants/path');

const createInvoice = (order, fileName) => {
    const doc = new PDFDocument();
    let totalPrice = 0;
    doc.pipe(fs.createWriteStream(path.join(INVOICES, fileName)));
    doc.font('Times-Roman')
        .fontSize(26)
        .text(`Invoice ${new Date().toISOString()}`, {
            align: 'center',
        });
    doc.fontSize(15).text(`Number | Name | Quantity | Price | Sum`);
    doc.text();
    order.productsData.forEach((product, index) => {
        const productTotal = product.quantity * product.price;
        totalPrice += productTotal;
        doc.fontSize(15).text(
            `      ${index + 1}.     |    ${product.title} |       ${product.quantity}       |   $${
                product.price
            }   |  $${productTotal}  `,
        );
    });
    doc.fontSize(15).text('----------------------------------------------------------------------', {
        align: 'center',
    });
    doc.fontSize(15).text(`Total: $${totalPrice}`, { align: 'right' });
    return (res) => {
        doc.pipe(res);
        doc.end();
    };
};

const getInvoiceFile = (fileName) => fs.promises.readFile(path.join(INVOICES, fileName));

const getInvoiceFileStream = (fileName) => fs.createReadStream(path.join(INVOICES, fileName));

module.exports = {
    getInvoiceFile,
    createInvoice,
    getInvoiceFileStream,
};
