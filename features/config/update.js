'use strict';

const util = require('util');
const common = require('common');

const getReplyError = (message) => {
    return {
        'error': message
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

const updateHandler = (request, reply, key) => {
    return (err, numReplaced) => {
        if (err) {
            console.error(err);
            return reply(getReplyError(err.message));
        }

        if (numReplaced === 0) {
            return reply(
                getReplyError(util.format('`%s` does not exist', key))
            ).code(404);
        }

        return reply(getReplySuccess(request, key));
    };
};

const handler = (server, request, reply) => {
    const key = common.formatConfigKey(request.params.key);
    const searchQuery = {
        'key': key
    };
    const data = {
        'key': key,
        'value': request.payload.value
    };
    server.plugins.db.config.update(
        searchQuery,
        data,
        updateHandler(request, reply, key)
    );
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
