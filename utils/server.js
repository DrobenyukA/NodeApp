/* eslint-disable no-process-exit */
const logger = require('./logger');

function startServer(app, port) {
    const server = app.listen(port, () => {
        logger.logInfo(`Server started on port ${port} at ${new Date().toISOString()}`);
        logger.printPort(port);
    });
    process.on('exit', (code) => logger.log(`Exit with code ${code}`));
    ['SIGTERM', 'SIGINT', 'SIGHUP'].forEach((signal) => process.on(signal, () => stopHandler(server, port)));
    return server;
}

function stopHandler(server, port) {
    logger.logInfo(`Stopping server on port ${port}`);
    const delay = 1000;
    const timer = setTimeout(() => {
        logger.logInfo(`Server on port ${port} stop forcefully`);
        process.exit(1);
    }, delay);

    server.close(() => {
        logger.logInfo(`Server on port ${port} stopped`);
        clearTimeout(timer);
    });
}

module.exports = { stopHandler, startServer };
