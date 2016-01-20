var Simulado = require('../lib/embedded-api');
var chai = require('chai').should();
var expect = require('chai').expect;
var superagent = require('superagent');
var async = require('async');

describe('Simulado.default s', function() {
  it('should create multiple mocks from an array', function(done) {
    var json = [
      {
        method: 'GET',
        path: '/defaultMock',
        response: {_default: 'mock'}
      },
      {
        method: 'POST',
        path: '/defaultMock',
        response: 'OK'
      }
    ];
    Simulado.defaults(json, function() {
      superagent.get('http://localhost:7000/defaultMock').end(function(_, res) {
        expect(res.body).to.deep.equal({_default: 'mock'});
        superagent.post('http://localhost:7000/defaultMock').end(function(_, res){
          expect(res.text).to.equal('OK');
          done();
        });
      })
    })
  });

  it('should create multiple mocks from an array with separate request + response objects', function(done) {
    var json = [
      {
        method: 'GET',
        path: '/defaultMock',
        response: {_default: 'mock'},
        requestHeaders: {
          'X-Billing-Account-Number': 987654321
        }
      },
      {
        method: 'POST',
        path: '/defaultMock',
        response: 'OK',
        requestHeaders: {
          'X-UMV-TOKEN': '234567-34567-4567'
        }
      }
    ];
    Simulado.defaults(json, function() {
      async.parallel([
        function(done) {
          superagent
            .get('http://localhost:7000/defaultMock')
            .set({ 'X-Billing-Account-Number': 987654321 })
            .end(function(_, res) {
              expect(res.body).to.deep.equal({_default: 'mock'});
              done();
            })
        },
        function(done) {
          superagent
            .post('http://localhost:7000/defaultMock')
            .set({ 'X-UMV-TOKEN': '234567-34567-4567' })
            .end(function(_, res){
              expect(res.text).to.equal('OK');
              done();
            })
        },
        function(done) {
          superagent
            .get('http://localhost:7000/defaultMock')
            .end(function(_, res) {
              expect(res.status).to.deep.equal(404);
              done();
            })
        },
        function(done) {
          superagent
            .post('http://localhost:7000/defaultMock')
            .end(function(_, res){
              expect(res.status).to.equal(404);
              done();
            })
        }
      ], done)
    });
  });
});
