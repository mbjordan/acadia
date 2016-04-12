'use strict';

const Nedb = require('nedb');

const configDatabase = (file, indexName) => {
    const db = new Nedb({
        'filename': '.data-config',
        'timestampData': true,
        'autoload': true
    });
    db.ensureIndex({
        'fieldName': 'key',
        'unique': true
    });
    return db;
};

const servicesDatabase = (file, indexName) => {
    const db = new Nedb({
        'filename': '.data-services',
        'timestampData': true,
        'autoload': true
    });
    db.ensureIndex({
        'fieldName': 'serviceName',
        'unique': true
    });
    return db;
};

exports.register = (server, options, next) => {
    server.expose('config', configDatabase());
    server.expose('services', servicesDatabase());
    return next();
};

exports.register.attributes = {
    'name': 'db',
    'version': '0.1.0'
};
