var Simulado = require('../simulado.js');
var chai = require('chai').should();
var expect = require('chai').expect
var superagent = require('superagent');

describe('Simulado requests', function() {
  it('should accept a timeout option and timeout after that amount of time', function(done) {
      Simulado.mock({
          path:'/myPath',
          timeout: 10
      }, function(){
          superagent.get('http://localhost:7000/myPath')
          .timeout(500)
          .end(function(err, res) {
            expect(err.timeout).to.equal(500);
            done();
          });
      });
  });
});


