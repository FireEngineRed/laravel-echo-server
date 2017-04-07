
import {PrivateChannel} from "../src/channels/private-channel";
import request = require('request');
import nock = require('nock');

describe("authorization requests", function() {

    it("replaces <tenant> w/ incoming host subdomain", function(done) {

        // random tenant name
        let tenant = Math.round(Math.random() * 1000000).toString(36);

        let socket = {
            request: {
                headers: {
                    host: tenant + '.example.com'
                }
            }
        };

        let authHost = 'https://<tenant>.test';
        let authEndpoint = '/auth/me';

        nock.disableNetConnect();

        let req = nock('https://' + tenant + '.test')
            .post('/auth/me')
            .reply(200);

        let pc = new PrivateChannel({
            authHost: authHost,
            authEndpoint: authEndpoint,
        }, request);

        pc.authenticate(socket, {})
            .then(() => {
                req.done();
                done();
            })
            .catch((r) => {
            fail(r.reason);
            done();
        });
    });
});