'use strict';

const common = require('common');

const handler = (server, request, reply) => {
    const key = common.formatConfigKey(request.params.key);
    server.plugins.datalog.upsert(
        key,
        request.payload.value
    );
    return reply({
        'upsert': 'success',
        'data': {
            'key': key,
            'value': request.payload.value
        }
    });
};

exports.register = (server, options, next) => {
    server.route({
        'method': 'POST',
        'path': '/v1/config/upsert/{key*}',
        'handler': handler.bind(this, server),
        'config': {
            'validate': {
                'params': {
                    'key': common.validators.config.key
                },
                'payload': {
                    'value': common.validators.config.value
                }
            },
            'description': 'Upsert a key/value pair',
            'notes': 'Inserts a new key/value pair if the key does not already exist, or updates the value if the key does exist',
            'tags': ['api', 'config']
        }
    });
    return next();
};

exports.register.attributes = {
    'name': 'features-config-upsert',
    'version': '1.0.0'
};
