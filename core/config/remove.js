'use strict';

const util = require('util');

const common = require('common');

const getQuery = (key) => {
    return {
        'key': key
    };
};

const getReplySuccess = (key) => {
    return {
        'remove': 'success',
        'data': {
            'key': key
        }
    };
};

const removeHandler = (reply, key) => {
    return (err, numRemoved) => {
        if (err) {
            console.error(err);
            return reply(common.getReplyError(err.message));
        }
        if (numRemoved === 0) {
            return reply(
                common.getReplyError(util.format('key `%s` not found', key))
            ).code(404);
        }
        return reply(getReplySuccess(key));
    };
};

const handler = (server, request, reply) => {
    const key = common.formatConfigKey(request.params.key);
    server.plugins.db.config.remove(getQuery(key), {}, removeHandler(reply, key));
};

exports.register = (server, options, next) => {
    server.route({
        'method': 'DELETE',
        'path': '/v1/config/{key*}',
        'handler': handler.bind(this, server),
        'config': {
            'validate': {
                'params': {
                    'key': common.validators.config.key
                }
            },
            'description': 'Remove a key/value pair',
            'notes': 'Removes the specified key from the datastore',
            'tags': ['api', 'config']
        }
    });
    return next();
};

exports.register.attributes = {
    'name': 'core-config-remove',
    'version': '1.0.0'
};
