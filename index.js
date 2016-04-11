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
    console.log('Acadia is running!');
    console.log(JSON.stringify(server.info, null, 4));
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
