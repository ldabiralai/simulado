var Simulado = require('../lib/embedded-api');
var chai = require('chai').should();
var expect = require('chai').expect
var superagent = require('superagent');

describe('reset', function() {
  
  beforeEach(function(done) {
    var fixture = [
      {
        method: 'POST',
        path: '/myPath',
        response: { a : 1 }
      }, {
        method: 'GET',
        path: '/myPath',
        response: { a : 2 }
      }
    ];
    Simulado.defaults(fixture, function() { done(); })
  });
  
  it('should clear all mocks', function (done) {

    superagent.post('http://localhost:7000/reset').end(function (_, _) {
      superagent.post('http://localhost:7000/myPath')
        .end(function (err, res) {
          expect(res.status).to.equal(404);
          superagent.get('http://localhost:7000/myPath')
            .end(function (err, res) {
              expect(res.status).to.equal(404);
              done();
            });
        });
    });

  });

  describe('when given a specific method and path', function () {
    
    beforeEach(function(done) {
       superagent.post('http://localhost:7000/reset')
         .send({ method: "GET", path: "/myPath" })
         .end( done )
    })

    it('should clear the specific mock', function (done) {
      superagent.get('http://localhost:7000/myPath')
        .end(function (err, res) {
          expect(res.status).to.equal(404);
          done();
        });
    });
    
    it('should not clear other mocks', function (done) {
      superagent.post('http://localhost:7000/myPath')
        .end(function (err, res) {
          expect(res.status).to.equal(200);
          done();
        });
    });
    
  });  
  
  describe('when given a only a method and no path', function () {
    
    beforeEach(function(done) {
       superagent.post('http://localhost:7000/reset')
         .send({ method: "GET" })
         .end( done )
    })

    it('should just clear all mocks as usual', function (done) {
      superagent.post('http://localhost:7000/myPath')
        .end(function (err, res) {
          expect(res.status).to.equal(404);
          superagent.get('http://localhost:7000/myPath')
          .end(function (err, res) {
            expect(res.status).to.equal(404);
            done();
          });
        });
    });
    
  });
  
  
  describe('when given a only a path and no method', function () {
    
    beforeEach(function(done) {
       superagent.post('http://localhost:7000/reset')
         .send({ path: "/myPath" })
         .end( done )
    })

    it('should just clear all mocks as usual', function (done) {
      superagent.post('http://localhost:7000/myPath')
        .end(function (err, res) {
          expect(res.status).to.equal(404);
          superagent.get('http://localhost:7000/myPath')
          .end(function (err, res) {
            expect(res.status).to.equal(404);
            done();
          });
        });
    });
    
  });
 
});


