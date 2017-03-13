'use strict';

const util = require('util');

const common = require('common');

const getQuery = (name) => {
    return {
        'serviceName': name
    };
};

const sanitizeResponse = (doc) => {
    return {
        'serviceName': doc.serviceName,
        'host': doc.host,
        'port': doc.port,
        'location': doc.location,
        'lastSeen': doc.updatedAt
    };
};

const validateLastCheckIn = (doc) => {
    // 1h15m check in interval.
    if ((doc.updatedAt.getTime() + 4500000) <= new Date().getTime()) {
        return false;
    }
    return doc;
};

const show404 = (reply, name) => {
    return reply(
        common.getReplyError(util.format('Service `%s` not found', name))
    ).code(404);
};

const showInvalid = (reply, name) => {
    return reply(
        common.getReplyError(util.format('Service `%s` has not checked in', name))
    );
};

const discoverHandler = (name, reply) => {
    return (err, doc) => {
        if (err) {
            return reply(common.getReplyError(err.message));
        }
        if (!doc) {
            return show404(reply, name);
        }
        if (!validateLastCheckIn(doc)) {
            return showInvalid(reply, name);
        }
        return reply(sanitizeResponse(doc));
    };
};

const handler = (server, request, reply) => {
    return server.plugins.db.services.findOne(
        getQuery(request.params.name),
        discoverHandler(request.params.name, reply)
    );
};

exports.register = (server, options, next) => {
    server.route({
        'method': 'GET',
        'path': '/v1/services/discover/{name}',
        'handler': handler.bind(this, server),
        'config': {
            'validate': {
                'params': {
                    'name': common.validators.service.name
                }
            },
            'description': 'Discover a service',
            'notes': 'Discover a service by Id',
            'tags': ['api', 'services']
        }
    });
    return next();
};

exports.register.attributes = {
    'name': 'core-services-discover',
    'version': '1.0.0'
};
