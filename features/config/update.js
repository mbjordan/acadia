'use strict';

const util = require('util');
const common = require('common');

const getReplyError = (key) => {
    return {
        'error': util.format('Cannot update key `%s`. Does not exist.', key)
    };
};

const getReplySuccess = (request, key) => {
    return {
        'update': 'success',
        'data': {
            'key': key,
            'value': request.payload.value
        }
    };
};

const handler = (server, request, reply) => {
    const key = common.formatConfigKey(request.params.key);
    const update = server.plugins.datalog.update(key, request.payload.value);

    if (!update) {
        return reply(getReplyError(key)).code(400);
    }
    return reply(getReplySuccess(request, key));
};

exports.register = (server, options, next) => {
    server.route({
        'method': 'PUT',
        'path': '/v1/config/{key*}',
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
            'description': 'Update a key/value pair',
            'notes': 'Update a new key/value pair',
            'tags': ['api', 'config']
        }
    });
    return next();
};

exports.register.attributes = {
    'name': 'features-config-update',
    'version': '1.0.0'
};
