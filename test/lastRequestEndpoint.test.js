var Simulado = require('../lib/embedded-api');
var chai = require('chai').should();
var expect = require('chai').expect
var superagent = require('superagent');

describe('Simulado requests', function() {

  beforeEach(function(done) {
    superagent.del('http://localhost:7000/clearLastRequests').end(done);
  });

  it('should return headers', function(done) {
      Simulado.mock({
          path:'/myPath',
      }, function(){
          superagent.get('http://localhost:7000/myPath')
          .set('my-header', 'my-value')
          .end(function(_, res) {
            superagent.get('http://localhost:7000/lastRequest')
              .set('method', 'GET')
              .set('path', '/myPath')
              .end(function(_, res) {
                res.body.headers.should.include({'my-header':'my-value'});
                done()
              });
          });
      });
  });

  it('should return 204 No Content if there is no previous request', function(done) {
    superagent.get('http://localhost:7000/lastRequest')
      .set('method', 'GET')
      .set('path', '/myPath')
      .end(function(_, res) {
        res.status.should.eq(204);
        done()
      });
  });

  it("should reset last requests", function(done) {
    Simulado.mock({
      path: "/pathToClear"
    }, function() {
      superagent.get('http://localhost:7000/pathToClear').end(function(_, res) {
        superagent.del('http://localhost:7000/clearLastRequests').end(function(_, res) {
          superagent.get('http://localhost:7000/lastRequest')
          .set('method', 'GET')
          .set('path', '/pathToClear')
          .end(function(_, res) {
            res.body.should.deep.equal({});
            done()
          });
        });
      });
    });
  });
});

