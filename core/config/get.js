'use strict';

const util = require('util');

const common = require('common');

const getQuery = (key) => {
    return {
        'key': {
            '$regex': new RegExp(key, 'i')
        }
    };
};

const sanitizeDocs = (docs) => {
    const newDocs = [];
    docs.forEach((doc) => {
        newDocs[newDocs.length] = {
            'key': doc.key,
            'value': doc.value
        };
    });
    return newDocs;
};

const findHandler = (reply) => {
    return (err, docs) => {
        if (err) {
            console.error(err);
            return reply(common.getReplyError(err.message));
        }
        return reply(sanitizeDocs(docs));
    };
};

const handler = (server, request, reply) => {
    server.plugins.db.config.find(
        getQuery(common.formatConfigKey(request.params.key)),
        findHandler(reply)
    );
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
    'name': 'features-config-get',
    'version': '1.0.0'
};
