function closeNotification(e) {
    e.target.parentNode.remove();
}

window.addEventListener('load', () => {
    const notifications = document.querySelector('#notifications-container');
    if ('io' in window) {
        window.io(window.location.origin);
    }
    notifications.querySelectorAll('.alert-close').forEach((e) => e.addEventListener('click', closeNotification));
});
