'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();

const throwErrFn = (err) => {
    if (err) {
        throw err;
    }
};

const startHandler = (err) => {
    if (err) {
        throw err;
    }
    console.log('Acadia is running!');
    console.log(JSON.stringify(server.info, null, 4));
};

server.connection({
    'port': process.env.PORT || 3000
});

// Register the lib/helpers
server.register(require('./lib'), throwErrFn);

// Register the Core
server.register(require('./core'), throwErrFn);

server.start(startHandler);

module.exports = server;
