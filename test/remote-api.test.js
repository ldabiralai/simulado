var expect = require('chai').expect;
var nock = require('nock');
var api = require("../lib/remote-api");

describe("Remote API", function() {

  after(function() {
    nock.restore();
  });

  it("should mock", function(done) {
    var defaultsData = { path: "/", response: 200 };

    var scope = nock('http://localhost:7001').post('/syncMock', defaultsData).reply(200);

    api.mock(defaultsData).then(function() {
      scope.done();
      done();
    });
  });

  it("should add mocks", function(done) {
    var mocksData = [{ path: "/1"}, { path: "/2"}];

    var scope = nock('http://localhost:7001').post('/syncMocks', mocksData).reply(200);

    api.mocks(mocksData).then(function() {
      scope.done();
      done();
    });
  });

  it("should call defaults", function(done) {
    var defaultsData = [ { path: "/1"}, { path: "/2"}];

    var scope = nock('http://localhost:7001').post('/syncDefaults', defaultsData).reply(200);

    api.defaults(defaultsData).then(function() {
      scope.done();
      done();
    });
  });

  it("should call lastRequest", function(done) {
    var lastRequestData = {data: "info"};

    var scope = nock('http://localhost:7001', { method: "POST", path: "/" }).get('/lastRequest').reply(204, lastRequestData);

    api.lastRequest("POST", "/").then(function(res) {
      expect(res.body).to.deep.eq(lastRequestData);
      scope.done();
      done();
    });
  });

  it("should call lastRequests", function(done) {
    var lastRequestsData = {data: "info"};

    var scope = nock('http://localhost:7001',  { method: 'POST', path: '/' }).get('/lastRequests').reply(204, lastRequestsData);

    api.lastRequests("POST", "/").then(function(res) {
      expect(res.body).to.deep.eq(lastRequestsData);
      scope.done();
      done();
    });
  });

  it("should call clearLastRequests", function(done) {
    var scope = nock('http://localhost:7001').delete('/clearLastRequests').reply(204);

    api.clearLastRequests(function() {
      scope.done();
      done();
    });
  });

});
