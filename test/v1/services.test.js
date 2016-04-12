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
    const name = 'test-service-101';
    const host = 'test-101.services.test.com';
    const port = '19282';
    const address = util.format('%s:%s', host, port);

    it('Should allow to register a service', (done) => {
        const opts = {
            'method': 'POST',
            'url': util.format('/v1/services/register/%s', name),
            'payload': {
                'host': host,
                'port': port
            }
        };

        server.inject(opts, (response) => {
            expect(response.result).to.be.an.object();

            expect(response.result).to.deep.include({
                'register': 'success'
            });

            expect(response.result).to.deep.include({
                'service': {
                    'serviceName': name,
                    'host': host,
                    'port': port,
                    'location': address
                }
            });
            done();
        });
    });

    it('Should allow to discover a service', (done) => {
        server.inject(util.format('/v1/services/discover/%s', name), (response) => {
            expect(response.result).to.be.an.array();
            expect(response.result).to.deep.include({
                'serviceName': name,
                'host': host,
                'port': port,
                'location': address
            });
            done();
        });
    });

    it('Should allow to list all services, finding the one we set', (done) => {
        server.inject('/v1/services/list', (response) => {
            expect(response.result).to.be.an.array();
            expect(response.result).to.include(name);
            done();
        });
    });

    it('Should allow to deregister a service', (done) => {
        const opts = {
            'method': 'DELETE',
            'url': util.format('/v1/services/deregister/%s', name),
        };

        server.inject(opts, (response) => {
            expect(response.result).to.be.an.object();
            expect(response.result).to.deep.equal({
                'deregister': 'success'
            });
            done();
        });
    });

    it('Should not allow to discover a service, after deregistration', (done) => {
        server.inject(util.format('/v1/services/discover/%s', name), (response) => {
            expect(response.result).to.be.an.array();
            expect(response.result).to.deep.equal([]);
            done();
        });
    });

    it('Should return an error when deregistering an unknown service', (done) => {
        const opts = {
            'method': 'DELETE',
            'url': util.format('/v1/services/deregister/%s', name),
        };

        server.inject(opts, (response) => {
            expect(response.result).to.be.an.object();
            expect(response.result).to.deep.equal({
                'error': util.format('Service `%s` not found', name)
            });
            done();
        });
    });
});
