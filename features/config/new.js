'use strict';

const util = require('util');

const common = require('common');

const getReplyError = (message) => {
    return {
        'error': message
    };
};

const getReplySuccess = (data) => {
    return {
        'new': 'success',
        'data': data
    };
};

const insertHandler = (data, reply) => {
    return (err) => {
        if (err) {
            console.error(err);
            return reply(getReplyError(err.message));
        }
        return reply(getReplySuccess(data));
    };
};

const handler = (server, request, reply) => {
    const key = common.formatConfigKey(request.params.key);
    const data = {
        'key': key,
        'value': request.payload.value
    };
    server.plugins.db.config.insert(data, insertHandler(data, reply));
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
