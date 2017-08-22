var Simulado = require('../lib/embedded-api');
var chai = require('chai').should();
var expect = require('chai').expect
var superagent = require('superagent');

describe('session', function() {
  beforeEach(function(done) {
    superagent.del('http://localhost:7000/clearLastRequests').end(done);
  });

  it('should respond to a http GET scoped by a sessionId', function (done) {
    Simulado.mock({
      path: '/test',
      method: 'GET',
      sessionId: 'uniqueSessionId'
    }, function () {
      superagent
        .get('http://localhost:7000/test')
        .set('Cookie', "X-Simulado-SessionId=uniqueSessionId")
        .end(function (_, res) {
          res.status.should.equal(200);
          done();
        });
    });
  })

  it('should respond 404 to a http GET without a primed sessionId', function (done) {
      Simulado.mock({
      path: '/test',
      method: 'GET',
      sessionId: 'uniqueSessionId'
    }, function () {
      superagent
        .get('http://localhost:7000/test').end(function (_, res) {
        res.status.should.equal(404);
        done();
      });
    });
  });

  it('should reset mocks specific to a sessionId', function (done) {
    Simulado.mock({
      path: '/test',
      method: 'GET',
      sessionId: 'uniqueSessionId'
    }, function () {
      superagent.post('http://localhost:7000/reset')
        .send({ method: "GET", path: "/myPath", sessionId: 'uniqueSessionId' })
        .end(function () {
          superagent
            .get('http://localhost:7000/myPath')
            .set('Cookie', "X-Simulado-SessionId=uniqueSessionId")
            .end(function (_, res) {
            res.status.should.equal(404);
            done();
          });
        });
      })
  });

  it('should not reset mocks specific to other sessionIds', function (done) {
    Simulado.mock({
      path: '/myPath',
      method: 'GET',
      sessionId: 'anotherUniqueSessionId'
    }, function () {
      superagent.post('http://localhost:7000/reset')
        .send({ method: "GET", path: "/myPath", sessionId: 'uniqueSessionId' })
        .end(function () {
          superagent
            .get('http://localhost:7000/myPath')
            .set('Cookie', "X-Simulado-SessionId=anotherUniqueSessionId")
            .end(function (_, res) {
            res.status.should.equal(200);
            done();
          });
        });
      })
  });
});
