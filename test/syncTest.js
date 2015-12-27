var Simulado = require('../simulado.js');
var chai = require('chai').should();
var expect = require('chai').expect
var superagent = require('superagent');
var SyncServer = require('../server.js');

describe('Simulado sync', function() {
  before(function(done) {
    new SyncServer().start(7001);
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
    it('should sync to the dev mockserver', function(done) {
      var mock = {
        path:'/myPath',
        headers: {"Content-Type": "application/json"},
        method: "POST",
        status: 999,
        response: {"some": "json"},
        timeout: 0
      };

      Simulado.mock(mock, function(){
        superagent.get('http://localhost:7001/inspect')
        .end(function(_, res) {
          res.body["POST"]["/myPath"][0].should.deep.equal(mock);
          res.body["POST"]["/myPath"][1].should.deep.equal(mock);
          done()
        });
      });
    });
  });
});

