const handlePageNotFound = (req, res) => {
    res.status(404).render('404', {
        path: req.path,
        pageTitle: 'Page not found.',
        pageHeader: 'Page not found.',
        user: req.user,
    });
};

const handleServerError = (error, req, res) => {
    res.status(500).render('500', {
        path: req.path,
        pageTitle: 'Server error.',
        pageHeader: 'Sorry, something went wrong.',
        user: req.user,
        message: error.message,
    });
};

module.exports = {
    handlePageNotFound,
    handleServerError,
};
