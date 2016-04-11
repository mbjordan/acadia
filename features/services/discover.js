'use strict';

const util = require('util');
const common = require('common');

const getReplyError = (request) => {
    return {
        'error': util.format('`%s` not found', request.params.id)
    };
};

const getReplySuccess = (request, result) => {
    return {
        'id': request.params.id,
        'address': result
    };
};

const handler = (server, request, reply) => {
    const result = server.plugins.datalog.read(
        common.formatServiceId(request.params.id)
    );

    if (!result) {
        return reply(getReplyError(request)).code(404);
    }
    return reply(getReplySuccess(request, result));
};

exports.register = (server, options, next) => {
    server.route({
        'method': 'GET',
        'path': '/v1/services/discover/{id}',
        'handler': handler.bind(this, server),
        'config': {
            'validate': {
                'params': {
                    'id': common.validators.service.id
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
