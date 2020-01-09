const isEmpty = (obj) => (obj ? Object.keys(obj).length === 0 : true);

module.exports = { isEmpty };
