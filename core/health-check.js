'use strict';

const handler = (request, reply) => {
    return reply({
        'ok': true
    });
};

exports.register = (server, options, next) => {
    server.route({
        'method': 'GET',
        'path': '/health',
        'handler': handler
    });
    return next();
};

exports.register.attributes = {
    'name': 'features-health',
    'version': '1.0.0'
};
