const getErrors = (errors, base = {}) =>
    errors.reduce((result, next) => {
        if (next.param) {
            result[next.param] = next.msg;
        } else {
            result.all = result.all ? result.all.concat([next]) : [next];
        }
        return result;
    }, base);

module.exports = {
    getErrors,
};
