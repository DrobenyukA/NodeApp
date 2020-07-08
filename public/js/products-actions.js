const deleteProduct = (e) => {
    const { productId, action } = e.target.dataset;
    const url = action.replace(':id', productId);
    const confirmed = window.confirm(`Are you sure?`);
    if (confirmed) {
        return fetch(url, { method: 'DELETE' })
            .then((resp) => {
                if (resp.status >= 400) {
                    return resp.json().then(({ message }) => {
                        throw new Error(message);
                    });
                }
                return resp.json();
            })
            .then(() => (window.location.href = '/products'))
            .catch((error) => alert(error.message));
    }
};

Array.from(document.querySelectorAll('.delete-btn')).forEach((element) =>
    element.addEventListener('click', deleteProduct),
);
