const modal = document.querySelector('#modal');

const closeModal = (e) => {
    e.preventDefault();
    modal.classList.add('hidden');
};

modal.querySelector('.modal-close-btn').addEventListener('click', closeModal);
