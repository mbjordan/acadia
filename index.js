'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();

const logErr = (err) => {
    if (err) {
        throw err;
    }
};

const startHandler = (err) => {
    if (err) {
        throw err;
    }
    console.log('Running! %s', server.info.uri);
};

server.connection({
    'port': process.env.PORT || 3000
});

// Register Services
server.register(require('./services'), logErr);

// Register Features
server.register(require('./features'), logErr);

server.start(startHandler);

module.exports = server;