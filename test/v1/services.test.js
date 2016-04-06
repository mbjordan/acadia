'use strict';

const util = require('util');
const Hapi = require('hapi');
const Code = require('code');
const Lab = require('lab');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

describe('/v1/services', () => {
    const server = require('../..');
    const id = 'test-service-101';
    const host = 'test-101.services.test.com';
    const port = '19282';
    const address = util.format('%s:%s', host, port);

    it('Should allow to register a service', (done) => {
        const opts = {
            'method': 'POST',
            'url': util.format('/v1/services/register/%s', id),
            'payload': {
                'host': host,
                'port': port
            }
        };

        server.inject(opts, (response) => {
            expect(response.result).to.be.an.object();
            expect(response.result).to.deep.equal({
                'register': 'success',
                'data': {
                    'id': id,
                    'address': address
                }
            });
            done();
        });
    });

    it('Should allow to discover a service', (done) => {
        server.inject(util.format('/v1/services/discover/%s', id), (response) => {
            expect(response.result).to.be.an.object();
            expect(response.result).to.deep.equal({
                'id': id,
                'address': address
            });
            done();
        });
    });

    it('Should allow to list all services, finding the one we set', (done) => {
        server.inject('/v1/services/list', (response) => {
            expect(response.result).to.be.an.array();
            expect(response.result).to.include(id);
            done();
        });
    });

    it('Should allow to deregister a service', (done) => {
        const opts = {
            'method': 'DELETE',
            'url': util.format('/v1/services/deregister/%s', id),
        };

        server.inject(opts, (response) => {
            expect(response.result).to.be.an.object();
            expect(response.result).to.deep.equal({
                'deregister': 'success',
                'data': {
                    'id': id
                }
            });
            done();
        });
    });

    it('Should not allow to discover a service, after deregistration', (done) => {
        server.inject(util.format('/v1/services/discover/%s', id), (response) => {
            expect(response.result).to.be.an.object();
            expect(response.result).to.deep.equal({
                'error': util.format('`%s` not found', id)
            });
            done();
        });
    });

    it('Should return an error when deregistering an already deregistered service', (done) => {
        const opts = {
            'method': 'DELETE',
            'url': util.format('/v1/services/deregister/%s', id),
        };

        server.inject(opts, (response) => {
            expect(response.result).to.be.an.object();
            expect(response.result).to.deep.equal({
                'error': util.format('`%s` not found', id)
            });
            done();
        });
    });
});
