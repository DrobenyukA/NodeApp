const fs = require('fs');
const path = require('path');

const PATH = require('../constants/path');

function create(name, initialValues) {
    console.log({ name, initialValues });
    return false;
}

function read(name, condition = () => true) {
    return new Promise((res, rej) => {
        return fs.readFile(path.join(PATH.APP_ROOT, 'data', `${name}.json`), (err, data) => {
            if (err) {
                return rej(err);
            }

            const result = JSON.parse(data.toString('utf8'));

            if (result instanceof Array) {
                return res(result.filter(condition));
            }

            return res(result);
        });
    });
}

function write(name, items) {
    return new Promise((res, rej) => {
        if (!items) {
            throw new Error('There is no items to store.');
        }

        return fs.writeFile(path.join(PATH.APP_ROOT, 'data', `${name}.json`), JSON.stringify(items), 'utf8', (err) => {
            if (err) {
                return rej(err);
            }
            res(true);
        });
    });
}

function storeItem(name, item) {
    return read(name)
        .then((items) => {
            const ids = items.map((item) => parseInt(item.id.split('-')[1]));
            const id = items && items.length ? Math.max.apply(undefined, ids) + 1 : 1;
            return [items, `${name}-${id}`];
        })
        .then(([items, id]) => items.concat([{ ...item, id }]))
        .then((items) => write(name, items));
}

module.exports = {
    read,
    write,
    storeItem,
    create,
};
