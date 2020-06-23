const renderUploadImageModal = (e) => {
    e.preventDefault();
    document.querySelector('#modal').classList.remove('hidden');
};

const handleProductImageSubmit = (e) => {
    e.preventDefault();
    const modal = document.querySelector('#modal');
    const { action, dataset } = e.target;
    const { method } = dataset;
    const headers = {
        'Content-Type': 'application/json',
    };
    // TODO: add data from form
    fetch(action, { method, headers, data: {} })
        .then((resp) => {
            if (resp.status >= 500) {
                return resp.json().then(({ message }) => {
                    throw new Error(message);
                });
            }
            return resp.json();
        })
        .then(({ imageSrc, imageAlt }) => {
            const productImage = document.querySelector('.product-image');
            productImage.src = imageSrc;
            productImage.classList.remove('hidden');

            document.querySelector('input[name="imageSrc"]').value = imageSrc;
            document.querySelector('input[name="imageAlt"]').value = imageAlt;

            modal.classList.add('hidden');
        })
        .catch(({ message }) => {
            const alert = document.createElement('div');
            alert.classList.add('alert');
            alert.textContent = message;

            modal.querySelector('.modal-container').appendChild(alert);
        });
};

const handleProductFormSubmit = (e) => {
    e.preventDefault();
    console.log('SUBMIT', { e });
    return false;
};

document.querySelector('#show-image-form-btn').addEventListener('click', renderUploadImageModal);
document.querySelector('#product-image-form').addEventListener('submit', handleProductImageSubmit);
document.querySelector('#product-form').addEventListener('submit', handleProductFormSubmit);
