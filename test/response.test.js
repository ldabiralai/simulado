var Simulado = require('../lib/embedded-api');
var chai = require('chai').should();
var expect = require('chai').expect
var superagent = require('superagent');


describe('Simulado', function() {

    describe('setup', function() {
        it('should start up a webserver', function(done) {
            superagent.get('http://localhost:7000/').end(function(_, res) {
                res.status.should.equal(200)
                res.text.should.include("Simulado running..")
                done()
            });
        });
    });

    describe('responses', function() {

        it('should respond to a http GET', function(done) {
            Simulado.mock({
                path: '/test',
                method: 'GET'
            }, function() {
                superagent.get('http://localhost:7000/test').end(function(_, res) {
                    res.status.should.equal(200);
                    done();
                });
            });
        });

        it('should respond to a http POST', function(done) {
            Simulado.mock({
                path: '/test',
                method: 'POST'
            }, function() {
                superagent.post('http://localhost:7000/test').end(function(_, res) {
                    res.status.should.equal(200);
                    done();
                });
            });
        });

        it('should respond to a http PUT', function(done) {
            Simulado.mock({
                path: '/test',
                method: 'PUT'
            }, function() {
                superagent.put('http://localhost:7000/test').end(function(_, res) {
                    res.status.should.equal(200);
                    done();
                });
            });
        });

        it('should respond to a http DELETE', function(done) {
            Simulado.mock({
                path: '/test',
                method: 'DELETE'
            }, function() {
                superagent.del('http://localhost:7000/test').end(function(_, res) {
                    res.status.should.equal(200);
                    done();
                });
            });
        });

        it('should send back empty json response if no response or status is provided', function(done) {
            Simulado.mock({
                path: '/test'
            }, function() {
                superagent.get('http://localhost:7000/test').end(function(_, res) {
                    res.status.should.equal(200);
                    res.text.should.equal('{}');
                    done()
                });
            });
        });

        it('should respond with pre-set header', function(done) {
            Simulado.mock({
                path: '/test',
                headers: {'our-header': 'a value'}
            }, function() {
                superagent.get('http://localhost:7000/test').end(function(_, res) {
                    res.headers['our-header'].should.equal('a value');
                    done()
                });
            });
        });

        it('should respond with a status code with an empty json when only status is mocked', function(done) {
            Simulado.mock({
                path: '/test',
                status: 401
            }, function() {
                superagent.get('http://localhost:7000/test').end(function(_, res) {
                    res.status.should.equal(401);
                    res.text.should.equal('{}');
                    done()
                });
            });
        });

        it('should respond with a fully mocked response (status & text)', function(done) {
            Simulado.mock({
                path: '/test',
                status: 401,
                response: "401 Unauthorised"
            }, function() {
                superagent.get('http://localhost:7000/test').end(function(_, res) {
                    res.status.should.equal(401);
                    res.text.should.equal("401 Unauthorised");
                    done()
                });
            });
        });

        it('should respond to wild card path', function(done) {
            Simulado.mock({
                path: '/test/*',
                status: 200,
                response: 'some data'
            }, function() {
                superagent.get('http://localhost:7000/test/path').end(function(_, res) {
                    res.text.should.equal('some data');
                    done()
                });
            });
        });

        it('should respond to wild card and return params', function(done) {
            Simulado.mock({
                path: '/test/path?*',
                status: 200,
                response: 'some data'
            }, function() {
                superagent.get('http://localhost:7000/test/path?fred=jim').end(function(_, res) {
                    res.text.should.equal('some data');
                    done()
                });
            });
        });

        it('should respond to regexp path', function(done) {
            Simulado.mock({
                path: /[^\?].*\?[^&]*?&?fred=[^&]*/,
                status: 200,
                response: 'some data'
            }, function() {
                superagent.get('http://localhost:7000/test/path?fred=jim').end(function(_, res) {
                    res.text.should.equal('some data');
                    done()
                });
          });
        });

        it('should respond to more exact matches over regex', function (done) {
            Simulado.mock({
                path: '/test/path',
                response: 'some data',
            }, function() {
                Simulado.mock({
                    path: /(.*)/,
                    response: 'more data'
                }, function () {
                    superagent.get('http://localhost:7000/test/path').end(function (_, res) {
                        res.text.should.equal('some data')
                        superagent.get('http://localhost:7000/another/path').end(function (_, res) {
                            res.text.should.equal('more data')
                            done()
                        })
                    })
                })
            })
        })

        it('should mock a url with params', function(done) {
            Simulado.mock({
                path: '/test?param=blah',
                status: 200
            }, function() {
                superagent.get('http://localhost:7000/test?param=blah').end(function(_, res) {
                    res.status.should.equal(200);
                    done()
                });
            });
        });

        it('should respond with the correct response when there are two mocks set', function(done) {
            Simulado.mock({
                path: '/good'
            }, function() {
                Simulado.mock({
                    path: '/bad',
                    status: 400
                }, function() {
                    superagent.get('http://localhost:7000/good').end(function(_, res) {
                        res.status.should.equal(200);
                        superagent.get('http://localhost:7000/bad').end(function(_, res) {
                            res.status.should.equal(400);
                            done()
                        });
                    });
                });
            });
        });

        describe('when multiple mocks on same HTTP method and path have been set', function(){

          beforeEach(function(done){
              Simulado.mock({ path: '/test', response: "A" }, function() {
                    Simulado.mock({ path: '/test', response: "B" }, function() {
                        Simulado.mock({ path: '/test', response: "C" }, done);
                    });
                });
          });

          it('should respond with the last set response', function(done) {
            superagent.get('http://localhost:7000/test').end(function(_, res) {
                res.text.should.equal('C');
                done();
            });
          });

        });

        describe('when mock has been set with conditional request body', function() {

          beforeEach(function(done){
            Simulado.mock({
                path: '/test',
                method: 'POST',
                conditionalRequestBody: { "particularRequest": true },
                response: "responseForParticularRequest"
              }, done)
          });

          it('should not respond when not called with the right request', function(done) {
              superagent.post('http://localhost:7000/test')
                .send({ "particularRequest": false })
                .end(function(_, res) {
                  res.status.should.equal(404);
                  done();
              });
          });

          it('should respond when called with the right request', function(done) {
              superagent.post('http://localhost:7000/test')
                .send({ "particularRequest": true })
                .end(function(_, res) {
                  res.status.should.equal(200);
                  done();
              });
          });

        describe('when two mocks on same HTTP method and path have been set, one with conditional request body and just normal', function(){

            it('should respond with the correct response when called with the right request', function(done) {
                Simulado.mock({
                    path: '/test',
                    method: 'POST',
                    response: "responseForAllOtherRequests"
                }, function() {
                      superagent.post('http://localhost:7000/test')
                        .send({ "particularRequest": true })
                        .end(function(_, res) {
                          res.text.should.equal('responseForParticularRequest')
                          done();
                        });
                    });
              });

            it('should respond with the other response when not called with the right request', function(done) {

                Simulado.mock({
                    path: '/test',
                    method: 'POST',
                    response: "responseForAllOtherRequests"
                }, function() {
                      superagent.post('http://localhost:7000/test')
                        .accept('json')
                        .type('json').end(function(_, res) {
                          res.text.should.equal('responseForAllOtherRequests')
                          done();
                        });
                    });
              });
          })

        });

        describe('when multiple mocks on same HTTP method and path have been set with conditional request bodies', function() {

         beforeEach(function(done){
            Simulado.mock({
                    path: '/test',
                    method: 'POST',
                    conditionalRequestBody: { "particularRequest": 1 },
                    response: "response For Request 1"
                }, function() {
                    Simulado.mock({
                      path: '/test',
                      method: 'POST',
                      conditionalRequestBody: { "particularRequest": 2 },
                      response: "response For Request 2"
                    }, function() {
                       Simulado.mock({
                        path: '/test',
                        method: 'POST',
                        response: "default response"
                      }, done);
                    });
                });
         });

         it('should respond with the correct response when called the right conditional request', function(done) {

            superagent.post('http://localhost:7000/test')
              .send({ "particularRequest": 1 })
              .accept('json')
              .type('json').end(function(_, res) {
                res.text.should.equal('response For Request 1')

                superagent.post('http://localhost:7000/test')
                  .send({ "particularRequest": 2 })
                  .accept('json')
                  .type('json').end(function(_, res) {
                    res.text.should.equal('response For Request 2')
                    done();
                });
            });

        });

      });

        describe('when mock has been set with conditional request header', function() {

          beforeEach(function(done){
            Simulado.mock({
                path: '/test',
                method: 'POST',
                conditionalRequestHeaders: { 'Authorization': 'Custom: ==test==' },
                response: "responseForParticularRequest"
              }, done)
          });

          it('should not respond when called without the expected header', function(done) {
              superagent.post('http://localhost:7000/test')
                .end(function(_, res) {
                  res.status.should.equal(404);
                  done();
              });
          });

          it('should not respond when called with unexpected header value', function(done) {
              superagent.post('http://localhost:7000/test')
                .set({ 'Authorization': 'Custom: ==wrong=='})
                .end(function(_, res) {
                  res.status.should.equal(404);
                  done();
              });
          });

          it('should respond when called with the correct header', function(done) {
              superagent.post('http://localhost:7000/test')
                .set({ 'Authorization': 'Custom: ==test=='})
                .end(function(_, res) {
                  res.status.should.equal(200);
                  done();
              });
          });

          it('should respond when called with the lower-case but correct header name', function(done) {
              superagent.post('http://localhost:7000/test')
                .set({ 'authorization': 'Custom: ==test=='})
                .end(function(_, res) {
                  res.status.should.equal(200);
                  done();
              });
          });
        });

        describe('when mock has been set with multiple conditional request headers', function() {

          beforeEach(function(done){
            Simulado.mock({
                path: '/test',
                method: 'POST',
                conditionalRequestHeaders: { 'Authorization': 'Custom: ==test==', 'X-Custom': 'blah' },
                response: "responseForParticularRequest"
              }, done)
          });

          it('should not respond when called without all the expected header', function(done) {
              superagent.post('http://localhost:7000/test')
                .set({ 'X-Custom': 'blah' })
                .end(function(_, res) {
                  res.status.should.equal(404);
                  done();
              });
          });

          it('should not respond when only one header matches', function(done) {
              superagent.post('http://localhost:7000/test')
                .set({ 'Authorization': 'Custom: ==wrong==', 'X-Custom': 'blah' })
                .end(function(_, res) {
                  res.status.should.equal(404);
                  done();
              });
          });

          it('should respond when called with the correct headers', function(done) {
              superagent.post('http://localhost:7000/test')
                .set({ 'Authorization': 'Custom: ==test==', 'X-Custom': 'blah' })
                .end(function(_, res) {
                  res.status.should.equal(200);
                  done();
              });
          });

          it('should respond when called with the lower-case but correct header name', function(done) {
              superagent.post('http://localhost:7000/test')
                .set({ 'authorization': 'Custom: ==test==', 'x-custom': 'blah' })
                .end(function(_, res) {
                  res.status.should.equal(200);
                  done();
              });
          });
        });

        describe('when multiple mocks on same HTTP method and path have been set with conditional request headers', function() {

         beforeEach(function(done){
            Simulado.mock({
                    path: '/test',
                    method: 'POST',
                    conditionalRequestHeaders: { 'Authorization': 'Custom: ==one==' },
                    response: "response For Request 1"
                }, function() {
                    Simulado.mock({
                      path: '/test',
                      method: 'POST',
                      conditionalRequestHeaders: { 'Authorization': 'Custom: ==two==' },
                      response: "response For Request 2"
                    }, function() {
                       Simulado.mock({
                        path: '/test',
                        method: 'POST',
                        response: "default response"
                      }, done);
                    });
                });
         })

         it('should respond with the correct response when called with the conditional header', function(done) {

            superagent.post('http://localhost:7000/test')
              .set({ "Authorization": 'Custom: ==one==' })
              .accept('json')
              .type('json').end(function(_, res) {
                res.text.should.equal('response For Request 1')

                superagent.post('http://localhost:7000/test')
                  .set({ "Authorization": 'Custom: ==two==' })
                  .accept('json')
                  .type('json').end(function(_, res) {
                    res.text.should.equal('response For Request 2')
                    done();
                });
            });

        });

      })

        describe('when multiple mocks on same HTTP method and path have been set with conditional request body and headers', function() {

         beforeEach(function(done){
            Simulado.mock({
                    path: '/test',
                    method: 'POST',
                    conditionalRequestHeaders: { 'Authorization': 'Custom: ==one==' },
                    response: "response 1"
                }, function() {
                    Simulado.mock({
                      path: '/test',
                      method: 'POST',
                      conditionalRequestBody: { "particularRequest": 2 },
                      response: "response 2"
                    }, function() {
                       Simulado.mock({
                        path: '/test',
                        method: 'POST',
                        conditionalRequestHeaders: { 'Authorization': 'Custom: ==A==' },
                        conditionalRequestBody: { "particularRequest": 'A'},
                        response: "response A"
                      }, done);
                    });
                });
         })

         it('should respond with the correct response when called with the conditional header', function(done) {

            superagent.post('http://localhost:7000/test')
              .set({ "Authorization": 'Custom: ==one==' })
              .send({ "particularRequest": 'A' })
              .accept('json')
              .type('json').end(function(_, res) {
                res.text.should.equal('response 1')
                done();
            });
         });

         it('should respond with the correct response when called with the conditional body', function(done) {

            superagent.post('http://localhost:7000/test')
              .set({ "Authorization": 'Custom: ==A==' })
              .send({ "particularRequest": 2 })
              .accept('json')
              .type('json').end(function(_, res) {
                res.text.should.equal('response 2')
                done();
            });
         });

         it('should respond with the correct response when called with the conditional header and body', function(done) {

            superagent.post('http://localhost:7000/test')
              .set({ "Authorization": 'Custom: ==A==' })
              .send({ "particularRequest": 'A' })
              .accept('json')
              .type('json').end(function(_, res) {
                res.text.should.equal('response A')
                done();
            });
         });

      })

    });

    describe('non mocked paths', function() {
        it('should respond with a 404', function(done) {
            superagent.get('http://localhost:7000/not-mocked').end(function(_, res) {
                res.status.should.equal(404)
                done()
            });
        });
    });

    describe('client', function() {
        it('should not error if no options are provided', function(done) {
            Simulado.mock({}, function() {
                superagent.get('http://localhost:7000/').end(function(_, res) {
                    res.status.should.equal(200)
                    res.text.should.include('Simulado running..')
                    done()
                });
            });
        });

        it('should not require a callback function', function() {
          expect(Simulado.mock).to.not.throw(TypeError)
        });
    });
});
