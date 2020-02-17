/*
 router.get((req, res, next) => {
    ...
    next(new Error('Some error'));
 })
*/

function handleError(error, req, res, next) {
    // TODO: implement error handling middleware
}

module.exports = handleError;
