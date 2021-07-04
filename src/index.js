const mongoose = require('mongoose');
const app = require('./app');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
    logger.app.info({message: 'Connected to MongoDB.'});
    server = app.listen(config.port, () => {
        logger.app.info({message: `Server express started on port: ${config.port}`});
    });
});

const exitHandler = () => {
    if(server) {
        server.close(() => {
            logger.app.info({message: 'Server closed.'});
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
}

const unexpectedErrorHandler = err => {
    logger.app.error({ message: err })
    exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.app.info({message: 'Sigterm received'});
    if(server) {
        server.close();
    }
});