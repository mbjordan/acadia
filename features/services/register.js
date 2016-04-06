'use strict';

const util = require('util');
const common = require('common');

const getLocation = (payload) => util.format('%s:%s', payload.host, payload.port);

const handler = (server, request, reply) => {
    server.plugins.datalog.upsert(
        common.formatServiceId(request.params.id),
        getLocation(request.payload)
    );
    return reply({
        'register': 'success',
        'data': {
            'id': request.params.id,
            'address': getLocation(request.payload)
        }
    });
};

exports.register = (server, options, next) => {
    server.route({
        'method': 'POST',
        'path': '/v1/services/register/{id}',
        'handler': handler.bind(this, server),
        'config': {
            'validate': {
                'params': {
                    'id': common.validators.service.id
                },
                'payload': {
                    'host': common.validators.service.host,
                    'port': common.validators.service.port
                }
            },
            'description': '(Re)register a service',
            'notes': 'Registers a given service by Id',
            'tags': ['api', 'services']
        }
    });
    return next();
};

exports.register.attributes = {
    'name': 'features-services-register',
    'version': '0.1.0'
};
