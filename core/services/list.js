'use strict';

const common = require('common');

const onlyServiceNames = (docsArray) => {
    let newDocs = [];
    for (let idx = 0; idx < docsArray.length; idx++) {
        newDocs[newDocs.length] = docsArray[idx].serviceName;
    }
    return newDocs;
};

const listHander = (reply) => {
    return (err, docs) => {
        if (err) {
            return reply(common.getReplyError(err.message));
        }
        return reply(onlyServiceNames(docs));
    };
};

const handler = (server, request, reply) => {
    return server.plugins.db.services.find({}, listHander(reply));
};

exports.register = (server, options, next) => {
    server.route({
        'method': 'GET',
        'path': '/v1/services/list',
        'handler': handler.bind(this, server),
        'config': {
            'description': 'List all services',
            'notes': 'Lists all services registered',
            'tags': ['api', 'services']
        }
    });
    return next();
};

exports.register.attributes = {
    'name': 'core-services-list',
    'version': '1.0.0'
};
