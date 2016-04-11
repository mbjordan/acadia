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
            'url': util.format('/v1/config%s', key),
            'payload': {
                'value': testObj[key]
            }
        };

        server.inject(opts, (response) => {
            expect(response.result).to.deep.equal({
                'new': 'success',
                'data': {
                    'key': key,
                    'value': testObj[key]
                }
            });
            done();
        });
    });

    it('Should allow to update a value', (done) => {
        testObj[key] = 'this is the other text we want, now';

        const opts = {
            'method': 'PUT',
            'url': util.format('/v1/config%s', key),
            'payload': {
                'value': testObj[key]
            }
        };

        server.inject(opts, (response) => {
            expect(response.result).to.deep.equal({
                'update': 'success',
                'data': {
                    'key': key,
                    'value': testObj[key]
                }
            });
            done();
        });
    });

    it('Should return an error on update (PUT) if the key does not exists', (done) => {
        const randomKey = '/v1/config/some/random/key/that/should/not/exist';
        const opts = {
            'method': 'PUT',
            'url': util.format('/v1/config%s', randomKey),
            'payload': {
                'value': testObj[key]
            }
        };

        server.inject(opts, (response) => {
            expect(response.result).to.deep.equal({
                'error': util.format('Cannot update key `%s`. Does not exist.', randomKey)
            });
            done();
        });
    });

    it('Should return an error when trying to POST the same key twice', (done) => {
        const opts = {
            'method': 'POST',
            'url': util.format('/v1/config%s', key),
            'payload': {
                'value': testObj[key]
            }
        };

        server.inject(opts, (response) => {
            expect(response.result).to.deep.equal({
                'error': util.format('Cannot add `%s`. Already exists.', key)
            });
            done();
        });
    });

    it('Should return the expected result', (done) => {
        server.inject(util.format('/v1/config%s', key), (response) => {
            expect(response.result).to.deep.equal({
                'key': key,
                'value': testObj[key]
            });
            done();
        });
    });

    it('Should return the expected result when non-explicit search', (done) => {
        server.inject('/v1/config/tsting', (response) => {
            expect(response.result).to.deep.equal({
                'searchResults': testObj
            });
            done();
        });
    });

    it('Should allow to delete a value to a key', (done) => {
        const opts = {
            'method': 'DELETE',
            'url': util.format('/v1/config%s', key)
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
            'url': util.format('/v1/config%s', key)
        };

        server.inject(opts, (response) => {
            expect(response.result).to.deep.equal({
                'error': util.format('`%s` not found', key)
            });
            done();
        });
    });

    it('Should not return the expected result, after deletion', (done) => {
        server.inject(util.format('/v1/config%s', key), (response) => {
            expect(response.result).to.deep.equal({
                'error': util.format('`%s` not found', key)
            });
            done();
        });
    });
});
