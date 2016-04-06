'use strict';

const Hapi = require('hapi');
const Code = require('code');
const Lab = require('lab');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

describe('/health', () => {
    const server = require('..');

    it('Should return ok mapped to true', (done) => {
        server.inject('/health', (response) => {
            expect(response.result).to.deep.equal({
                'ok': true
            });
            done();
        });
    });
});
