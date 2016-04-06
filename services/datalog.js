'use strict';

const fs = require('fs');

// in memory, baby
let datalog;

const getFilename = () => {
    return '.data';
};

const saveToDisc = () => {
    console.time('[DATALOG] data saved to disk');

    const json = JSON.stringify(datalog, null, 1) + '\n';
    const saveHandler = (err) => {
        if (err) {
            throw err;
        }
        console.timeEnd('[DATALOG] data saved to disk');
    };

    fs.writeFile(getFilename(), json, 'utf8', saveHandler);
};

const keySearchResultOrFalse = (result) => {
    return (Object.keys(result).length > 0) ? result : false;
};

const remove = (key) => {
    console.log('[DATALOG] Remove %s', key);
    delete datalog[key];
    saveToDisc();
    return true;
};

const read = (key) => {
    return datalog[key] || false;
};

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

const upsert = (key, value) => {
    datalog[key] = value;
    saveToDisc();
    console.log('[DATALOG] Upsert %s', key);
    return value;
};

const shouldRemove = (key) => {
    if (datalog.hasOwnProperty(key)) {
        return remove(key);
    }
    return false;
};

exports.register = (server, options, next) => {
    datalog = JSON.parse(fs.readFileSync(getFilename(), 'utf8'));
    server.expose('read', read);
    server.expose('keySearch', keySearch);
    server.expose('upsert', upsert);
    server.expose('remove', shouldRemove);
    return next();
};

exports.register.attributes = {
    'name': 'datalog',
    'version': '0.1.0'
};
