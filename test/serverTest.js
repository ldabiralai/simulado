var api = require('../lib/remote-api.js');
var chai = require('chai').should();
var expect = require('chai').expect
var superagent = require('superagent');
var server = require('../server.js');

describe('Simulado end to end', function() {
  before(function(done) {
    new server().start(7001);
    done();
  });

  describe('dev server', function() {
    it('should start on the specified port', function(done) {
      superagent.get('http://localhost:7001')
      .end(function(_, res) {
        res.status.should.equal(200);
        done()
      });
    });
  });

  describe('mock responses', function() {
    it('should set default on remote mockserver', function(done) {
      var mock = {
        path:'/myPath',
        headers: {"Content-Type": "application/json"},
        method: "POST",
        status: 999,
        response: {"some": "json"},
        timeout: 0
      };

      api.mock(mock, function(){
        superagent.get('http://localhost:7001/inspect')
        .end(function(_, res) {
          res.body.should.deep.equal({
            POST: {
              "/myPath": [mock]
            }
          });
          done();
        });
      });
    });
  });
});

