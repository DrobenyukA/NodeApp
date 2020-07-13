function closeNotification(e) {
    e.target.parentNode.remove();
}

function createProductAlert(product) {
    const closeButton = document.createElement('button');
    closeButton.classList.add('alert-close');
    closeButton.appendChild(document.createTextNode(String.fromCharCode(215)));
    closeButton.addEventListener('click', closeNotification);

    const title = document.createElement('h4');
    title.classList.add('alert-title');
    title.appendChild(document.createTextNode('New book available!'));

    const link = document.createElement('a');
    link.classList.add('alert-link');
    link.appendChild(document.createTextNode('link'));
    link.href = `${window.origin}/products/${product._id}`;

    const text = document.createElement('p');
    text.appendChild(document.createTextNode('You cal see it by this '));
    text.appendChild(link);

    const alert = document.createElement('div');
    alert.classList.add('alert', 'alert-info');
    alert.appendChild(closeButton);
    alert.appendChild(title);
    alert.appendChild(text);

    return alert;
}

window.addEventListener('load', () => {
    const notifications = document.querySelector('#notifications-container');
    if ('io' in window) {
        const socket = window.io(window.location.origin);
        socket.on('product', (data) => {
            const alert = createProductAlert(data.product);
            notifications.appendChild(alert);
        });
    }
    notifications.querySelectorAll('.alert-close').forEach((e) => e.addEventListener('click', closeNotification));
});
