'use strict';

const util = require('util');

const common = require('common');

const getQuery = (name) => {
    return {
        'serviceName': name
    };
};

const getReplySuccess = (name) => {
    return {
        'deregister': 'success'
    };
};

const removeHandler = (name, reply) => {
    return (err, numRemoved) => {
        if (err) {
            console.error(err);
            return reply(common.getReplyError(err.message));
        }
        if (numRemoved === 0) {
            return reply(
                common.getReplyError(util.format('Service `%s` not found', name))
            ).code(404);
        }
        return reply(getReplySuccess());
    };
};

const handler = (server, request, reply) => {
    server.plugins.db.services.remove(
        getQuery(request.params.name), {},
        removeHandler(request.params.name, reply)
    );
};

exports.register = (server, options, next) => {
    server.route({
        'method': 'DELETE',
        'path': '/v1/services/deregister/{name}',
        'handler': handler.bind(this, server),
        'config': {
            'validate': {
                'params': {
                    'name': common.validators.service.name
                }
            },
            'description': 'Deregister (remove) a service',
            'notes': 'Removes a given service by Id',
            'tags': ['api', 'services']
        }
    });
    return next();
};

exports.register.attributes = {
    'name': 'core-services-deregister',
    'version': '1.0.0'
};
