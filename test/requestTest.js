var Simulado = require('../simulado.js');
var chai = require('chai').should();
var expect = require('chai').expect
var superagent = require('superagent');

describe('Simulado requests', function() {
    describe('http GET Requests', function() {
        it('should return headers for request made to the mocked path', function(done) {
            Simulado.mock({
                path:'/myPath',
            }, function(){
                superagent.get('http://localhost:7000/myPath')
                .set('my-header', 'my-value')
                .end(function(_, res) {
                    Simulado.lastRequest("GET", "/myPath").headers.should.include({'my-header':'my-value'});
                    done()
                });
            });
        });
 
        it('should return an empty body of a request made to the mocked path', function(done) {
            Simulado.mock({
                path:'/myPath'
            }, function(){
                superagent.get('http://localhost:7000/myPath')
                .end(function(_, res) {
                    Simulado.lastRequest("GET", "/myPath").body.should.deep.equal({});
                    done()
                });
            });
        });
 
        it('should return params for a request made to the mocked path', function(done) {
            Simulado.mock({
                path:'/myPath'
            }, function(){
                superagent.get('http://localhost:7000/myPath')
                .query({query:"a-query"})
                .end(function(_, res) {
                    Simulado.lastRequest("GET", "/myPath").params.should.deep.equal({query:"a-query"});
                    done()
                });
            });
        });
    });

    describe('http POST requests', function() {
        it('should return headers for request made to the mocked path', function(done) {
            Simulado.mock({
                path:'/myPath',
                method: 'POST'
            }, function(){
                superagent.post('http://localhost:7000/myPath')
                .set('my-header', 'my-value')
                .end(function(_, res) {
                    Simulado.lastRequest("POST", "/myPath").headers.should.include({'my-header':'my-value'});
                    done()
                });
            });
        });
 
        it('should return the body of a request made to the mocked path', function(done) {
            Simulado.mock({
                path:'/myPath',
                method: 'POST'
            }, function(){
                superagent.post('http://localhost:7000/myPath')
                .accept('json')
                .type('json')
                .send({some: 'json'})
                .end(function(_, res) {
                    Simulado.lastRequest("POST", "/myPath").body.should.deep.equal({some: 'json'});
                    done()
                });
            });
        });
 
        it('should return params for a request made to the mocked path', function(done) {
            Simulado.mock({
                path:'/myPath',
                method: 'POST'
            }, function(){
                superagent.post('http://localhost:7000/myPath')
                .query({query:"a-query"})
                .end(function(_, res) {
                    Simulado.lastRequest("POST", "/myPath").params.should.deep.equal({query:"a-query"});
                    done()
                });
            });
        });
    });
 
    describe('http PUT requests', function() {
        it('should return headers for request made to the mocked path', function(done) {
            Simulado.mock({
                path:'/myPath',
                method: 'PUT'
            }, function(){
                superagent.put('http://localhost:7000/myPath')
                .set('my-header', 'my-value')
                .end(function(_, res) {
                    Simulado.lastRequest("PUT", "/myPath").headers.should.include({'my-header':'my-value'});
                    done()
                });
            });
        });
 
        it('should return the body of a request made to the mocked path', function(done) {
            Simulado.mock({
                path:'/myPath',
                method: 'PUT'
            }, function(){
                superagent.put('http://localhost:7000/myPath')
                .accept('json')
                .type('json')
                .send({some: 'json'})
                .end(function(_, res) {
                    Simulado.lastRequest("PUT", "/myPath").body.should.deep.equal({some: 'json'});
                    done()
                });
            });
        });
 
        it('should return params for a request made to the mocked path', function(done) {
            Simulado.mock({
                path:'/myPath',
                method: 'PUT'
            }, function(){
                superagent.put('http://localhost:7000/myPath')
                .query({query:"a-query"})
                .end(function(_, res) {
                    Simulado.lastRequest("PUT", "/myPath").params.should.deep.equal({query:"a-query"});
                    done()
                });
            });
        });
    });

    describe('http DELETE requests', function() {
        it('should return headers for request made to the mocked path', function(done) {
            Simulado.mock({
                path:'/myPath',
                method: 'DELETE'
            }, function(){
                superagent.del('http://localhost:7000/myPath')
                .set('my-header', 'my-value')
                .end(function(_, res) {
                    Simulado.lastRequest("DELETE", "/myPath").headers.should.include({'my-header':'my-value'});
                    done()
                });
            });
        });
 
        it('should return the body of a request made to the mocked path', function(done) {
            Simulado.mock({
                path:'/myPath',
                method: 'DELETE'
            }, function(){
                superagent.del('http://localhost:7000/myPath')
                .accept('json')
                .type('json')
                .send({some: 'json'})
                .end(function(_, res) {
                    Simulado.lastRequest("DELETE", "/myPath").body.should.deep.equal({some: 'json'});
                    done()
                });
            });
        });
 
        it('should return params for a request made to the mocked path', function(done) {
            Simulado.mock({
                path:'/myPath',
                method: 'DELETE'
            }, function(){
                superagent.del('http://localhost:7000/myPath')
                .query({query:"a-query"})
                .end(function(_, res) {
                    Simulado.lastRequest("DELETE", "/myPath").params.should.deep.equal({query:"a-query"});
                    done()
                });
            });
        });
    });
 
});
