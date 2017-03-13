'use strict';

// The hapi router limits the use of a leading slash in the actual URL paramter,
// so this function makes sure it's there for the database to properly store.

const formatConfigKey = (key) => {
    if (!key.match(/^\//)) {
        key = '/' + key;
    }
    return key;
};

module.exports = formatConfigKey;
