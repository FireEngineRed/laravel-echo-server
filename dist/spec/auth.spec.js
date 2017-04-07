"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var private_channel_1 = require("../src/channels/private-channel");
var request = require("request");
var nock = require("nock");
describe("authorization requests", function () {
    it("replaces <tenant> w/ incoming host subdomain", function (done) {
        var tenant = Math.round(Math.random() * 1000000).toString(36);
        var socket = {
            request: {
                headers: {
                    host: tenant + '.example.com'
                }
            }
        };
        var authHost = 'https://<tenant>.test';
        var authEndpoint = '/auth/me';
        nock.disableNetConnect();
        var req = nock('https://' + tenant + '.test')
            .post('/auth/me')
            .reply(200);
        var pc = new private_channel_1.PrivateChannel({
            authHost: authHost,
            authEndpoint: authEndpoint,
        }, request);
        pc.authenticate(socket, {})
            .then(function () {
            req.done();
            done();
        })
            .catch(function (r) {
            fail(r.reason);
            done();
        });
    });
});
