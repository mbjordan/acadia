'use strict';

// Used to ensure a variable is set

module.exports = (variableName) => {
    if (!process.env.hasOwnProperty(variableName)) {
        throw new Error('[ENV] `' + variableName + '` not defined');
    }

    return process.env[variableName];
};
