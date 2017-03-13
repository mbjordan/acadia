'use strict';

const util = require('util');

const common = require('common');

const getQuery = (name) => {
    return {
        'serviceName': name
    };
};

const getLocation = (payload) => util.format('%s:%s', payload.host, payload.port);

const getUpdateData = (name, payload) => {
    return {
        'serviceName': name,
        'host': payload.host,
        'port': payload.port,
        'location': getLocation(payload)
    };
};

const getUpdateOptions = () => {
    return {
        'upsert': true,
        'returnUpdatedDocs': true
    };
};

const getReplySuccess = (doc) => {
    return {
        'register': 'success',
        'service': doc
    };
};

const registerHandler = (reply) => {
    return (err, num, doc) => {
        if (err) {
            return reply(common.getReplyError(err.message));
        }
        return reply(getReplySuccess(doc));
    };
};

const handler = (server, request, reply) => {
    return server.plugins.db.services.update(
        getQuery(request.params.name),
        getUpdateData(request.params.name, request.payload),
        getUpdateOptions(),
        registerHandler(reply)
    );
};

exports.register = (server, options, next) => {
    server.route({
        'method': 'POST',
        'path': '/v1/services/register/{name}',
        'handler': handler.bind(this, server),
        'config': {
            'validate': {
                'params': {
                    'name': common.validators.service.name
                },
                'payload': {
                    'host': common.validators.service.host,
                    'port': common.validators.service.port
                }
            },
            'description': '(Re)register a service',
            'notes': 'Registers a given service by Id via upsert-like operation.',
            'tags': ['api', 'services']
        }
    });
    return next();
};

exports.register.attributes = {
    'name': 'core-services-register',
    'version': '1.0.0'
};
