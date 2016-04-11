'use strict';

const fs = require('fs');

// in memory, baby
let datalog;

const getFilename = () => '.data';

const saveToDisc = () => {
    const json = JSON.stringify(datalog, null, 1) + '\n';
    const saveHandler = (err) => {
        if (err) {
            throw err;
        }
    };
    fs.writeFile(getFilename(), json, 'utf8', saveHandler);
};

const keySearchResultOrFalse = (result) => {
    return (Object.keys(result).length > 0) ? result : false;
};

const removeAction = (key) => {
    delete datalog[key];
    saveToDisc();
    return true;
};

const upsert = (key, value) => {
    datalog[key] = value;
    saveToDisc();
    return value;
};

const insert = (key, value) => {
    return (!datalog.hasOwnProperty(key)) ? upsert(key, value) : false;
};

const update = (key, value) => {
    return (datalog.hasOwnProperty(key)) ? upsert(key, value) : false;
};

const read = (key) => datalog[key] || false;

const keySearch = (key, includePrivate) => {
    const keyRegexp = new RegExp(key, 'i');
    let result = {};
    for (let keyName in datalog) {
        if (!includePrivate && keyName.match(/\~/g)) {
            continue;
        }
        if (keyName.match(keyRegexp)) {
            result[keyName] = datalog[keyName];
        }
    }
    return keySearchResultOrFalse(result);
};

const remove = (key) => {
    return (datalog.hasOwnProperty(key)) ? removeAction(key) : false;
};

exports.register = (server, options, next) => {
    datalog = JSON.parse(fs.readFileSync(getFilename(), 'utf8'));
    server.expose('upsert', upsert);
    server.expose('insert', insert);
    server.expose('update', update);
    server.expose('read', read);
    server.expose('keySearch', keySearch);
    server.expose('remove', remove);
    return next();
};

exports.register.attributes = {
    'name': 'datalog',
    'version': '0.1.0'
};
