const isEmpty = (obj) => (obj ? Object.keys(obj).length === 0 : true);

const generateId = (prefix = 'uid') => `${prefix}-${(~~(Math.random() * 1e8)).toString(16)}`;

module.exports = {
    isEmpty,
    generateId,
};
