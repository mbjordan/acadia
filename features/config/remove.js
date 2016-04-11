'use strict';

const util = require('util');
const common = require('common');

const getReplyError = (key) => {
    return {
        'error': util.format('`%s` not found', key)
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

const handler = (server, request, reply) => {
    const key = common.formatConfigKey(request.params.key);
    const result = server.plugins.datalog.remove(key);
    
    if (!result) {
        return reply(getReplyError(key)).code(404);
    }
    return reply(getReplySuccess(key));

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
    'name': 'features-config-remove',
    'version': '1.0.0'
};
