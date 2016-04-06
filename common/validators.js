'use strict';

const Joi = require('joi');

exports.config = {};
exports.service = {};

exports.config.key = Joi.string().regex(/^[a-z0-9\_\/]+$/i).required();
exports.config.value = Joi.string().min(2).max(256).required();

exports.service.id = Joi.string().regex(/^[a-z0-9\-]{4,}$/i).required();
exports.service.host = Joi.string().regex(/^[a-z0-9\.\-]{4,}$/i).required();
exports.service.port = Joi.string().regex(/^[0-9]{1,6}$/).required();
