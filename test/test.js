var Simulado = require('../simulado.js');
var chai = require('chai').should();
var expect = require('chai').expect
var superagent = require('superagent');

describe('Simulado', function() {
    it('should start up a webserver', function(done) {
        superagent.get('http://localhost:7000/').end(function(_, res) {
            res.status.should.equal(200)
            res.text.should.equal("Simulado running..")
            done()
        });
    });

    it('should respond with a 404 on any pages which are not specifically mocked', function(done) {
        superagent.get('http://localhost:7000/not-mocked').end(function(_, res) {
            res.status.should.equal(404)
            done()
        });
    });

    it('should not error if no options are provided', function(done) {
        Simulado.mock({}, function() {
            superagent.get('http://localhost:7000/').end(function(_, res) {
                res.status.should.equal(200)
                res.text.should.equal('Simulado running..')
                done()
            });
        });
    });

    it('should send back empty json response if no response or status is provided', function(done) {
        Simulado.mock({
            path: '/test'
        }, function() {
            superagent.get('http://localhost:7000/test').end(function(_, res) {
                res.status.should.equal(200)
                res.text.should.equal('{}')
                done()
            });
        });
    });

    it('should respond with pre-set header', function(done) {
        Simulado.mock({
            path: '/test',
            headers: {'our-header': 'a value'},
        }, function() {
            superagent.get('http://localhost:7000/test').end(function(_, res) {
                res.headers['our-header'].should.equal('a value');
                done()
            });
        });
    });

    it('should respond with a status code with an empty json when only status is mocked', function(done) {
        Simulado.mock({
            path: '/test',
            status: 401
        }, function() {
            superagent.get('http://localhost:7000/test').end(function(_, res) {
                res.status.should.equal(401)
                res.text.should.equal('{}')
                done()
            });
        });
    });

    it('should respond with a fully mocked response (status & text)', function(done) {
        Simulado.mock({
            path: '/test',
            status: 401,
            response: "401 Unauthorised"
        }, function() {
            superagent.get('http://localhost:7000/test').end(function(_, res) {
                res.status.should.equal(401)
                res.text.should.equal("401 Unauthorised")
                done()
            });
        });
    });

    it('should respond to a http POST', function(done) {
        Simulado.mock({
            path: '/test',
            method: 'POST'
        }, function() {
            superagent.post('http://localhost:7000/test').end(function(_, res) {
                res.status.should.equal(200);
                done();
            });
        });
    });

    it('should respond to a http PUT', function(done) {
        Simulado.mock({
            path: '/test',
            method: 'PUT'
        }, function() {
            superagent.put('http://localhost:7000/test').end(function(_, res) {
                res.status.should.equal(200);
                done();
            });
        });
    });

    it('should respond to a http DELETE', function(done) {
        Simulado.mock({
            path: '/test',
            method: 'DELETE'
        }, function() {
            superagent.del('http://localhost:7000/test').end(function(_, res) {
                res.status.should.equal(200);
                done();
            });
        });
    });

    it('should not require a callback function', function() {
      expect(Simulado.mock).to.not.throw(TypeError)
    });
});
