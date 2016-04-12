'use strict';

const util = require('util');

const common = require('common');

const getQuery = (name) => {
    return {
        'serviceName': name
    };
};

const discoverHandler = (reply) => {
    return (err, doc) => {
        if (err) {
            return reply(common.getReplyError(err.message));
        }
        reply(doc);
    };
};

const handler = (server, request, reply) => {
    return server.plugins.db.services.find(
        getQuery(request.params.name),
        discoverHandler(reply)
    );
};

exports.register = (server, options, next) => {
    server.route({
        'method': 'GET',
        'path': '/v1/services/discover/{name}',
        'handler': handler.bind(this, server),
        'config': {
            'validate': {
                'params': {
                    'name': common.validators.service.name
                }
            },
            'description': 'Discover a service',
            'notes': 'Discover a service by Id',
            'tags': ['api', 'services']
        }
    });
    return next();
};

exports.register.attributes = {
    'name': 'features-services-discover',
    'version': '1.0.0'
};
