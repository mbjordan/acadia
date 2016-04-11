'use strict';

const Nedb = require('nedb');

const db = {};

db.config = new Nedb({
    'filename': '.data-config',
    'autoload': true
});

db.config.ensureIndex({
    'fieldName': 'key',
    'unique': true
});

db.services = new Nedb({
    'filename': '.data-services',
    'autoload': true
});

db.services.ensureIndex({
    'fieldName': 'serviceId',
    'unique': true
});

exports.register = (server, options, next) => {
    server.expose('config', db.config);
    server.expose('services', db.services);
    return next();
};

exports.register.attributes = {
    'name': 'db',
    'version': '0.1.0'
};
