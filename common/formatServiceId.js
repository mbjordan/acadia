'use strict';

const util = require('util');

// The addition of the `~` ensures these values are private and cannot be read
// via the config api
module.exports = (id) => util.format('/~/service/%s', id);
