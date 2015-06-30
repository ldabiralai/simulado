var Simulado = require('../simulado.js');
var chai = require('chai').should();
var expect = require('chai').expect;
var superagent = require('superagent');

describe('Simulado default mocks', function() {
  it('should accept an array containing a default mock', function(done) {
    var json = [
      {
        method: 'POST',
        path: '/defaultMock',
        response: {_default: 'mock'}
      }, {
        method: 'GET',
        path: '/defaultMock',
        response: {_default: 'mock'}
      }
    ];
    Simulado.defaults(json, function() {
      superagent.get('http://localhost:7000/defaultMock').end(function(_, res) {
        expect(res.body).to.deep.equal({_default: 'mock'});
        done();
      })
    })
  });

  it('should accept an array containing multiple default mocks', function(done) {
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
});
