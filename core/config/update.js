'use strict';

const util = require('util');

const common = require('common');

const getQuery = (key) => {
    return {
        'key': key
    };
};

const getData = (key, value) => {
    return {
        'key': key,
        'value': value
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
            return reply(common.getReplyError(err.message));
        }

        if (numReplaced === 0) {
            return reply(
                common.getReplyError(util.format('`%s` does not exist', key))
            ).code(404);
        }

        return reply(getReplySuccess(request, key));
    };
};

const handler = (server, request, reply) => {
    const key = common.formatConfigKey(request.params.key);
    return server.plugins.db.config.update(
        getQuery(key),
        getData(key, request.payload.value),
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
    'name': 'core-config-update',
    'version': '1.0.0'
};
