'use strict';

const util = require('util');
const common = require('common');

const handler = (server, request, reply) => {
    const result = server.plugins.datalog.remove(
        common.formatServiceId(request.params.id)
    );
    if (result) {
        return reply({
            'deregister': 'success',
            'data': {
                'id': request.params.id
            }
        });
    }
    return reply({
        'error': util.format('`%s` not found', request.params.id)
    }).code(404);
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
