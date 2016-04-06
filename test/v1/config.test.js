'use strict';

const util = require('util');
const Hapi = require('hapi');
const Code = require('code');
const Lab = require('lab');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

describe('/v1/config', () => {
    const server = require('../..');
    const key = '/test/config/tsting';
    const testObj = {};

    testObj[key] = 'this is the text we want';

    it('Should allow to set a value to a key', (done) => {
        const opts = {
            'method': 'POST',
            'url': util.format('/v1/config/upsert%s', key),
            'payload': {
                'value': testObj[key]
            }
        };

        server.inject(opts, (response) => {
            expect(response.result).to.deep.equal({
                'upsert': 'success',
                'data': {
                    'key': key,
                    'value': testObj[key]
                }
            });
            done();
        });
    });

    it('Should return the expected result', (done) => {
        server.inject(util.format('/v1/config/get%s', key), (response) => {
            expect(response.result).to.deep.equal({
                'key': key,
                'value': testObj[key]
            });
            done();
        });
    });

    it('Should return the expected result when non-explicit search', (done) => {
        server.inject('/v1/config/get/tsting', (response) => {
            expect(response.result).to.deep.equal({
                'searchResults': testObj
            });
            done();
        });
    });

    it('Should allow to delete a value to a key', (done) => {
        const opts = {
            'method': 'DELETE',
            'url': util.format('/v1/config/remove%s', key)
        };

        server.inject(opts, (response) => {
            expect(response.result).to.deep.equal({
                'remove': 'success',
                'data': {
                    'key': key
                }
            });
            done();
        });
    });

    it('Should return an error when attempting to delete a non-existant key', (done) => {
        const opts = {
            'method': 'DELETE',
            'url': util.format('/v1/config/remove%s', key)
        };

        server.inject(opts, (response) => {
            expect(response.result).to.deep.equal({
                'error': util.format('`%s` not found', key)
            });
            done();
        });
    });

    it('Should not return the expected result, after deletion', (done) => {
        server.inject(util.format('/v1/config/get%s', key), (response) => {
            expect(response.result).to.deep.equal({
                'error': util.format('`%s` not found', key)
            });
            done();
        });
    });
});
