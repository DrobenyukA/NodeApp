const renderUploadImageModal = (e) => {
    e.preventDefault();
    document.querySelector('#modal').classList.remove('hidden');
};

const handleProductImageSubmit = (e) => {
    e.preventDefault();
    const modal = document.querySelector('#modal');
    const { action } = e.target;
    const body = new FormData(e.target);
    fetch(action, { method: 'POST', body })
        .then((resp) => {
            if (resp.status >= 400) {
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
    const { action, dataset, elements } = e.target;
    const { method } = dataset;
    const headers = {
        'Content-Type': 'application/json',
    };
    const body = JSON.stringify({
        id: elements.id ? elements.id.value : undefined,
        title: elements.title.value,
        imageSrc: elements.imageSrc.value,
        imageAlt: elements.imageAlt.value,
        price: elements.price.value,
        description: elements.description.value,
    });
    fetch(action, { method, headers, body })
        .then((resp) => {
            if (resp.status >= 400) {
                return resp.json().then(({ message }) => {
                    throw new Error(message);
                });
            }
            return resp.json();
        })
        .then(() => {
            const image = document.querySelector('.product-image');
            image.classList.add('hidden');
            image.src = '';
            document.querySelector('#product-form').reset();
        })
        .catch(({ message }) => alert(message));
};

document.querySelector('#show-image-form-btn').addEventListener('click', renderUploadImageModal);
document.querySelector('#product-image-form').addEventListener('submit', handleProductImageSubmit);
document.querySelector('#product-form').addEventListener('submit', handleProductFormSubmit);
