const handlePageNotFound = (req, res) => {
    res.status(404).render('404', {
        path: req.path,
        pageTitle: 'Page not found.',
        pageHeader: 'Page not found.',
    });
};

module.exports = {
    handlePageNotFound,
};