'use strict';

const util = require('util');
const common = require('common');

const getReplyError = (key) => {
    return {
        'error': util.format('`%s` not found', key)
    };
};

const getReplySearch = (searchResults) => {
    return {
        'searchResults': searchResults
    };
};

const getReplyRead = (key, readResults) => {
    return {
        'key': key,
        'value': readResults
    };
};

const tryKeySearch = (datalog, key, reply) => {
    const searchResults = datalog.keySearch(key, false);

    if (!searchResults) {
        return reply(getReplyError(key)).code(404);
    }
    return reply(getReplySearch(searchResults));
};

// new RegExp(key, 'i')

const handler = (server, request, reply) => {
    const key = common.formatConfigKey(request.params.key);
    const readResults = server.plugins.datalog.read(key);

    if (!readResults) {
        return tryKeySearch(server.plugins.datalog, key, reply);
    }
    return reply(getReplyRead(key, readResults));
};

exports.register = (server, options, next) => {
    server.route({
        'method': 'GET',
        'path': '/v1/config/{key*}',
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
