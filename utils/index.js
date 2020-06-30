const generateId = (prefix = 'uid') => `${prefix}-${(~~(Math.random() * 1e8)).toString(16)}`;

module.exports = {
    generateId,
};
