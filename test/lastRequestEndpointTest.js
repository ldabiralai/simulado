var Simulado = require('../simulado.js');
var chai = require('chai').should();
var expect = require('chai').expect
var superagent = require('superagent');

describe('Simulado requests', function() {
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
});

