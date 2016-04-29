var Simulado = require('../lib/embedded-api');
var chai = require('chai').should();
var expect = require('chai').expect
var superagent = require('superagent');

var baseUri = 'http://localhost:7000/';

describe('Simulado requests', function() {

  describe('lastRequests', function() {

    var path1 = 'path1';
    var path2 = 'path2';

    function clearLastRequests(done) {
      superagent
        .del(baseUri + 'clearLastRequests')
        .end(done);
    }

    beforeEach(function(done) {

      var mocks = [{
        path: path1
      }, {
        path: path1,
        method: 'POST'
      }, {
        path: path2
      }]

      var count = 0;

      mocks.forEach(function(mock) {
        Simulado.mock(mock, runTest.bind(this));
      });

      function runTest() {
        if (count === mocks.length - 1) {
          done()
        } else {
          count++;
        }
      }
    });

    afterEach(function(done) { clearLastRequests(done); });

    var tests = [
      {
        name: 'should return the last requests for the corresponding GET method and path',
        requests: [{ method: 'GET', path: path1 }, { method: 'GET', path: path2 }],
        lastRequestsQuery: { method: 'GET', path: path1 },
        expectations: { lastRequestsCount: 1 }
      },
      {
        name: 'should return the last requests for the corresponding POST method and path',
        requests: [{ method: 'GET', path: path1 }, { method: 'POST', path: path1 }, { method: 'POST', path: path1 }],
        lastRequestsQuery: { method: 'POST', path: path1 },
        expectations: { lastRequestsCount: 2 }
      },
      {
        name: 'should return the last requests for the corresponding method only',
        requests: [{ method: 'GET', path: path1 }, { method: 'POST', path: path1 }, { method: 'POST', path: path1 }],
        lastRequestsQuery: { method: 'POST' },
        expectations: { lastRequestsCount: 2 }
      },
      {
        name: 'should return the last requests for the corresponding path only',
        requests: [{ method: 'GET', path: path2 }, { method: 'POST', path: path1 }, { method: 'GET', path: path1 }],
        lastRequestsQuery: { path: path1 },
        expectations: { lastRequestsCount: 2 }
      },
      {
        name: 'should return all last requests',
        requests: [{ method: 'GET', path: path2 }, { method: 'POST', path: path1 }, { method: 'GET', path: path1 }],
        lastRequestsQuery: {},
        expectations: { lastRequestsCount: 3 }
      }
    ];

    tests.forEach(function(test) {

      it(test.name, function(done) {

        var count = 0;

        test.requests.forEach(function(request){
            superagent[request.method.toLowerCase()](baseUri + request.path).end(runAssertions);
        })

        function runAssertions(_, res) {
          if (count === test.requests.length - 1) {

            var requestHeaders = {};
            if (test.lastRequestsQuery.path) requestHeaders.path = test.lastRequestsQuery.path;
            if (test.lastRequestsQuery.method) requestHeaders.method = test.lastRequestsQuery.method;

            superagent
              .get(baseUri + 'lastRequests')
              .set(requestHeaders)
              .end(function(err, res) {
                res.body.length.should.eq(test.expectations.lastRequestsCount);
                done();
              });
          } else {
            count++;
          }
        }
      });
    });
  });
});
