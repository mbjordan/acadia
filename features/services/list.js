'use strict';

const getAllServicesKey = () => '/~/service/';

const getServicesNames = (results) => {
    var arr = [];
    for (var prop in results) {
        arr[arr.length] = prop.replace(getAllServicesKey(), '');
    }
    return arr;
};

const getReplyError = () => {
    return {
        'error': 'No registered services'
    };
};

const handler = (server, request, reply) => {
    const results = server.plugins.datalog.keySearch(getAllServicesKey(), true);
    if (!results) {
        return reply(getReplyError()).code(404);
    }
    return reply(getServicesNames(results));

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
    'name': 'features-services-list',
    'version': '1.0.0'
};
