'use strict';

const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');

const Pack = require('../package');

const throwErrFn = (err) => {
    if (err) {
        throw err;
    }
};

const swagger = {
    'register': HapiSwagger,
    'options': {
        'info': {
            'title': Pack.name + ' API',
            'version': Pack.version
        }
    }
};

exports.register = (server, options, next) => {
    server.register([Inert, Vision, swagger], throwErrFn);
    next();
};

exports.register.attributes = {
    'name': 'services-swagger',
    'version': '0.1.0'
};
