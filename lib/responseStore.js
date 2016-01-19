var async = require('async');
var equal = require('deep-equal');
var _ = require('lodash');

var mocks = {};
var defaultOptions = {
  path: '',
  headers: {},
  method: 'GET',
  status: 200,
  response: {},
  timeout:  0
};

var ResponseStore = {
  add: function(opts, callback) {
    var requestToMock = Object.assign({}, defaultOptions, opts);

    if (requestToMock.requestHeaders) {
      requestToMock.requestHeaders = _.mapKeys(requestToMock.requestHeaders, function(value, header){
        return header.toLowerCase()
      })
    }

    if (mocks[requestToMock.method] == undefined) {
      mocks[requestToMock.method] = {}
    }

    if (mocks[requestToMock.method][requestToMock.path] == undefined) {
      mocks[requestToMock.method][requestToMock.path] = []
    }

    mocks[requestToMock.method][requestToMock.path].push(requestToMock);

    if (typeof(callback) == "function") {
      callback();
    }
  },

  defaults: function(opts, callback){
    ResponseStore.reset();
    async.each(opts, function(mock, done) {
      ResponseStore.add(mock, done);
    }, callback);
  },

  find: function(req, callback) {
    var possibleMocks = findByOriginalUrl(req.method, req.originalUrl);

    if (possibleMocks === undefined) {
      possibleMocks = findByPath(req.method, req.path)
    }

    possibleMocks = filterByRequestHeaders(possibleMocks, req.headers);

    var mock = findByConditionalRequestBody(possibleMocks, req.body);
    callback(mock);
  },

  getAll: function() {
    return mocks;
  },

  reset: function() {
    mocks = {};
  }

};

function findByOriginalUrl(httpMethod, originalUrl){
  return (mocks[httpMethod] || {}) [originalUrl];
}

function findByPath(httpMethod, requestedPath) {
  for (var mockPath in mocks[httpMethod]) {
    if (requestedPathMatchesMockPath(requestedPath, mockPath)) {
      return mocks[httpMethod][mockPath];
    }
  }
}

function requestedPathMatchesMockPath(requestedPath, mockPath) {
  var mockPathRegex = new RegExp(mockPath.replace(/\//g, '\/').replace(/\?/g, '\?').replace('*', '.*'));
  return mockPathRegex.test(requestedPath);
}

function findByConditionalRequestBody(possibleMocks, requestBody) {
  var mockWithNoCondition;
  for (var i in possibleMocks) {
    var mock = possibleMocks[i];
    if (equal(mock.conditionalRequestBody, requestBody)) {
      return mock;
    }
    if (!mock.conditionalRequestBody)  {
      mockWithNoCondition = mock;
    }
  }
  return mockWithNoCondition;
}

function filterByRequestHeaders(possibleMocks, requestHeaders) {
  return (possibleMocks || []).filter(function(mock) {
    if (!mock.requestHeaders) return true;
    return Object.keys(mock.requestHeaders).reduce(function(acc, header){
      header = header.toLowerCase();
      return acc && mock.requestHeaders[header] == requestHeaders[header];
    }, true)
  })
}

module.exports = ResponseStore;
