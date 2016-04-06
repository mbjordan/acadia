'use strict';

const handler = (server, request, reply) => {
    return reply({
        'ok': server.plugins.datalog.read('/~/health')
    });
};

exports.register = (server, options, next) => {
    server.route({
        'method': 'GET',
        'path': '/health',
        'handler': handler.bind(this, server)
    });
    return next();
};

exports.register.attributes = {
    'name': 'features-health',
    'version': '1.0.0'
};
