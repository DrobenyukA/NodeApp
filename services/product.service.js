function getProductFromRequest(req) {
    const { title, price, description } = req.body;
    return {
        title,
        price,
        description,
    };
}

module.exports = {
    getProductFromRequest,
};
