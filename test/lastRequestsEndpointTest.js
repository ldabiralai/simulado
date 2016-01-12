var Simulado = require('../lib/embedded-api');
var chai = require('chai').should();
var expect = require('chai').expect
var superagent = require('superagent');

describe('Simulado requests', function() {

  beforeEach(function(done) {
    superagent.del('http://localhost:7000/clearLastRequests').end(done);
  });

  it('should return the last requests', function (done) {
      Simulado.mock({
          path:'/myPath',
      }, function(){
          superagent.get('http://localhost:7000/myPath')
          .end(function() {
            superagent.get('http://localhost:7000/myPath')
              .end(function() {
                superagent.get('http://localhost:7000/lastRequests')
                  .end(function(_, res) {
                    res.body.length.should.eq(2);
                    done()
                  });

              });
          });
      });
  });

});
