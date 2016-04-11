'use strict';

const Nedb = require('nedb');

const setupConfigDb = () => {
    const db = new Nedb({
        'filename': '.data-config',
        'autoload': true
    });
    db.ensureIndex({
        'fieldName': 'key',
        'unique': true
    });
    return db;
};

const setupServicesDb = () => {
    const db = new Nedb({
        'filename': '.data-services',
        'autoload': true
    });
    db.ensureIndex({
        'fieldName': 'serviceName',
        'unique': true
    });
    return db;
};

exports.register = (server, options, next) => {
    server.expose('config', setupConfigDb());
    server.expose('services', setupServicesDb());
    return next();
};

exports.register.attributes = {
    'name': 'db',
    'version': '0.1.0'
};
