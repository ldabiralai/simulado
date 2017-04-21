var api = require('../lib/remote-api.js');
var chai = require('chai').should();
var expect = require('chai').expect;
var superagent = require('superagent');
var Server = require('../server.js');
var responseStore = require('../lib/responseStore');
var sinon = require('sinon');

describe('Simulado end to end', function() {
  before(function(done) {
    new Server().start(7001);
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
    var mock = {
      path:'/myPath',
      headers: {"Content-Type": "application/json"},
      method: "POST",
      status: 999,
      response: {"some": "json"},
      timeout: 0
    };

    it('should set default on remote mockserver', function(done) {
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

    it("should track calls to mock endpoints", function(done){
      api.mock(mock, function(){
        superagent.post('http://localhost:7001/myPath')
          .end(function() {
            api.lastRequest('POST', '/myPath', function(err, res) {
              expect(res.status).not.to.be.eq(204);
              done();
            });
          });
      });
    });

  });

  describe('CORS', function () {
    it('should set response header "Access-Control-Allow-Origin" to localhost', function (done) {
      superagent.get('http://localhost:7001')
      .end(function(_, res) {
        expect(res.header['access-control-allow-origin']).to.equal('http://localhost');
        done()
      });
    });
  });

  describe('defaults', function() {
    var sandbox, responseStoreAddStub;

    beforeEach(function() {
      sandbox = sinon.sandbox.create();
      responseStoreAddStub = sandbox.stub(responseStore, 'add');
    });

    afterEach(function() {
      sandbox.restore();
    });

    it('should add a default response to the response store', function() {
      var server = new Server();
      var defaultMocks = [{ path: '/test' }];
      server.defaults(defaultMocks);
      expect(responseStoreAddStub.calledWith(defaultMocks[0])).to.equal(true);
    });

    it('should add multiple mocks to the response store', function() {
      var server = new Server();
      var defaultMocks = [{ path: '/test' }, { path: '/anotherMock'} ];
      server.defaults(defaultMocks);
      expect(responseStoreAddStub.calledTwice).to.equal(true);
    });
  });
});

