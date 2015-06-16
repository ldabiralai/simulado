var Simulado = require('../simulado.js')();
var chai = require('chai').should();
var expect = require('chai').expect
var superagent = require('superagent');

describe('Simulado inspect', function() {
  describe('HTTP GET', function() {
    it('should show mocks that have been primed', function(done) {
      Simulado.mock({
        path:'/myPath',
      }, function(){
        superagent.get('http://localhost:7000/inspect')
        .end(function(_, res) {
          res.body['GET'].should.include.key('/myPath');
          done()
        });
      });
    });

    it('should include the details of the mock', function(done) {
      Simulado.mock({
        path:'/myPath',
        status: 400,
        response: {test: "value"}
      }, function(){
        superagent.get('http://localhost:7000/inspect')
        .end(function(_, res) {
          res.body['GET']['/myPath'].should.deep.equal({
            path: '/myPath',
            headers: {},
            method: 'GET',
            status: 400,
            response: {test: 'value'}
          });
          done()
        });
      });
    });
  });

  describe('HTTP POST', function() {
    it('should show mocks that have been primed', function(done) {
      Simulado.mock({
        path:'/myPath',
        method: 'POST'
      }, function(){
        superagent.get('http://localhost:7000/inspect')
        .end(function(_, res) {
          res.body['POST'].should.include.key('/myPath');
          done()
        });
      });
    });

    it('should include the details of the mock', function(done) {
      Simulado.mock({
        path:'/myPath',
        method: 'POST',
        status: 400
      }, function(){
        superagent.get('http://localhost:7000/inspect')
        .end(function(_, res) {
          res.body['POST']['/myPath'].should.deep.equal({
            path: '/myPath',
            headers: {},
            method: 'POST',
            status: 400,
            response: {}
          });
          done()
        });
      });
    });
  });

  describe('HTTP PUT', function() {
    it('should show mocks that have been primed', function(done) {
      Simulado.mock({
        path:'/myPath',
        method: 'PUT'
      }, function(){
        superagent.get('http://localhost:7000/inspect')
        .end(function(_, res) {
          res.body['PUT'].should.include.key('/myPath');
          done()
        });
      });
    });

    it('should include the details of the mock', function(done) {
      Simulado.mock({
        path:'/myPath',
        status: 400,
        method: 'PUT'
      }, function(){
        superagent.get('http://localhost:7000/inspect')
        .end(function(_, res) {
          res.body['PUT']['/myPath'].should.deep.equal({
            path: '/myPath',
            headers: {},
            method: 'PUT',
            status: 400,
            response: {}
          });
          done()
        });
      });
    });
  });

  describe('HTTP DELETE', function() {
    it('should show mocks that have been primed', function(done) {
      Simulado.mock({
        path:'/myPath',
        method: 'DELETE'
      }, function(){
        superagent.get('http://localhost:7000/inspect')
        .end(function(_, res) {
          res.body['DELETE'].should.include.key('/myPath');
          done()
        });
      });
    });

    it('should include the details of the mock', function(done) {
      Simulado.mock({
        path:'/myPath',
        status: 400,
        method: 'DELETE'
      }, function(){
        superagent.get('http://localhost:7000/inspect')
        .end(function(_, res) {
          res.body['DELETE']['/myPath'].should.deep.equal({
            path: '/myPath',
            headers: {},
            method: 'DELETE',
            status: 400,
            response: {}
          });
          done()
        });
      });
    });
  });
});
