'use strict';

const util = require('util');
const common = require('common');

const getReplyError = (key) => {
    return {
        'error': util.format('Cannot add `%s`. Already exists.', key)
    };
};

const getReplySuccess = (request, key) => {
    return {
        'new': 'success',
        'data': {
            'key': key,
            'value': request.payload.value
        }
    };
};

const handler = (server, request, reply) => {
    const key = common.formatConfigKey(request.params.key);
    const insert = server.plugins.datalog.insert(key, request.payload.value);

    if (!insert) {
        return reply(getReplyError(key)).code(400);
    }
    return reply(getReplySuccess(request, key));
};

exports.register = (server, options, next) => {
    server.route({
        'method': 'POST',
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
            'description': 'Insert a key/value pair',
            'notes': 'Inserts a new key/value pair',
            'tags': ['api', 'config']
        }
    });
    return next();
};

exports.register.attributes = {
    'name': 'features-config-new',
    'version': '1.0.0'
};
