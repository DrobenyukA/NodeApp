const fs = require('fs');

const PATH = require('../constants/path');

function read(name, condition = () => true) {
    return new Promise((res, rej) => {
        return fs.readFile(`${PATH.APP_ROOT}/data/${name}.json`, (err, data) => {
            if (err) {
                return rej(err);
            }
            return res(JSON.parse(data.toString('utf8')).filter(condition));
        });
    });
}

function write(name, items) {
    return new Promise((res, rej) => {
        return fs.writeFile(`${PATH.APP_ROOT}/data/${name}.json`, JSON.stringify(items), 'utf8', (err) => {
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
            const id = Math.max.apply(undefined, ids) + 1;
            return [items, `book-${id}`];
        })
        .then(([items, id]) => items.concat([{ ...item, id }]))
        .then((items) => write(name, items));
}

module.exports = {
    read,
    write,
    storeItem,
};
