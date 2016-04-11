'use strict';

const util = require('util');
const common = require('common');

const getReplyError = (request) => {
    return {
        'error': util.format('`%s` not found', request.params.id)
    };
};

const getReplySuccess = (request) => {
    return {
        'deregister': 'success',
        'data': {
            'id': request.params.id
        }
    };
};

const handler = (server, request, reply) => {
    const result = server.plugins.datalog.remove(
        common.formatServiceId(request.params.id)
    );

    if (!result) {
        return reply(getReplyError(request)).code(404);
    }
    return reply(getReplySuccess(request));
};

exports.register = (server, options, next) => {
    server.route({
        'method': 'DELETE',
        'path': '/v1/services/deregister/{id}',
        'handler': handler.bind(this, server),
        'config': {
            'validate': {
                'params': {
                    'id': common.validators.service.id
                }
            },
            'description': 'Deregister (remove) a service',
            'notes': 'Removes a given service by Id',
            'tags': ['api', 'services']
        }
    });
    return next();
};

exports.register.attributes = {
    'name': 'features-services-deregister',
    'version': '1.0.0'
};
