'use strict';

const util = require('util');
const common = require('common');

const handler = (server, request, reply) => {
    const key = common.formatConfigKey(request.params.key);
    const result = server.plugins.datalog.remove(key);
    if (result) {
        return reply({
            'remove': 'success',
            'data': {
                'key': key
            }
        });
    }
    return reply({
        'error': util.format('`%s` not found', key)
    }).code(404);
};

exports.register = (server, options, next) => {
    server.route({
        'method': 'DELETE',
        'path': '/v1/config/remove/{key*}',
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
    'version': '0.1.0'
};
