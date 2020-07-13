const io = require('socket.io');
const logger = require('./logger');

let webSockets;

function init(server) {
    webSockets = io(server);
    webSockets.on('connection', (socket) => logger.logInfo(`[WS]: connection establish with user ${socket.client.id}`));
    return webSockets;
}

function getInstance() {
    if (webSockets) {
        return webSockets;
    }
    throw new Error('Web sockets are not installed');
}

module.exports = {
    init,
    getInstance,
};
