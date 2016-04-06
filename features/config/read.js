'use strict';

const util = require('util');
const common = require('common');

const tryKeySearch = (datalog, key, reply) => {
    const searchResults = datalog.keySearch(key, false);
    if (searchResults) {
        return reply({
            'searchResults': searchResults
        });
    }
    return reply({
        'error': util.format('`%s` not found', key)
    }).code(404);
};

const handler = (server, request, reply) => {
    const key = common.formatConfigKey(request.params.key);
    const datalog = server.plugins.datalog;
    const readResults = datalog.read(key);
    if (readResults) {
        return reply({
            'key': key,
            'value': readResults
        });
    }
    return tryKeySearch(datalog, key, reply);
};

exports.register = (server, options, next) => {
    server.route({
        'method': 'GET',
        'path': '/v1/config/get/{key*}',
        'handler': handler.bind(this, server),
        'config': {
            'validate': {
                'params': {
                    'key': common.validators.config.key
                }
            },
            'description': 'Search and return key/value pair(s)',
            'notes': 'Return the value(s) of the provided key. Can specify partial keys, returning multiple results, or a specific key returning one result.',
            'tags': ['api', 'config']
        }
    });
    return next();
};

exports.register.attributes = {
    'name': 'features-config-read',
    'version': '1.0.0'
};
