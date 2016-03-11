var Simulado = require('../lib/embedded-api');
var chai = require('chai').should();
var expect = require('chai').expect
var superagent = require('superagent');


describe('mock with once parameter', function () {

    beforeEach('when set', function (done) {
        Simulado.mock({ path: '/test', once: true }, done);
    })
    
    it('should respond only once', function (done) {
       superagent.get('http://localhost:7000/test').end(function (_, res) {
           res.status.should.equal(200);
           superagent.get('http://localhost:7000/test').end(function (_, res) {
                res.status.should.equal(404);
                done();
           });

       });
    })
    
    describe('mock with conditional request body', function() {

        beforeEach(function(done){
            Simulado.mock({
                    path: '/test',
                    method: 'POST',
                    conditionalRequestBody: { "particularRequest": 1 },
                    response: "response For Request 1",
                    once: true
                }, function() {
                       Simulado.mock({
                        path: '/test',
                        method: 'POST',
                        response: "default response"
                      }, done);
                });
        });


        it('should respond only once to the conditional request', function(done) {
            superagent.post('http://localhost:7000/test')
              .send({ "particularRequest": 1 })
              .accept('json')
              .type('json').end(function(_, res) {
                res.text.should.equal('response For Request 1')

                superagent.post('http://localhost:7000/test')
                  .send({ "particularRequest": 1 })
                  .accept('json')
                  .type('json').end(function(_, res) {
                    res.text.should.equal('default response')
                    done();
                });   

            });          
        });        
        
        it('should respond as normal to mock with no once parameter', function(done) {
            superagent.post('http://localhost:7000/test').end(function(_, res) {
                res.status.should.equal(200);
                superagent.post('http://localhost:7000/test').end(function(_, res) {
                    res.status.should.equal(200);
                    done();
                });   

            });          
        });
    
    });


});
