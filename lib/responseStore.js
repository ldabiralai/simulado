var async = require('async');
var equal = require('deep-equal');
var _ = require('lodash');

var mocks = {};

var ResponseStore = {
    add: function(opts, callback) {
        opts = opts || {};
        var baseMock = {
            path: opts.path || '',
            headers: opts.headers || {},
            method: opts.method || 'GET',
            status: opts.status || 200,
            response: opts.response || {},
            timeout: opts.timeout || 0
        }

        if (opts.conditionalRequestHeaders) {
          baseMock.conditionalRequestHeaders = opts.conditionalRequestHeaders;
        }

        if (opts.conditionalRequestBody) {
          baseMock.conditionalRequestBody = opts.conditionalRequestBody;
        }

        if (opts.once) {
            baseMock.once = true;
        }

        if (mocks[baseMock.method] == undefined) {
            mocks[baseMock.method] = {}
        }

        if (mocks[baseMock.method][baseMock.path] == undefined) {
            mocks[baseMock.method][baseMock.path] = []
        }

        mocks[baseMock.method][baseMock.path].push(baseMock);

        if (typeof(callback) == "function") {
          callback();
        }
    },

    addMocks: function(opts, callback){
        async.each(opts, function(mock, callback) {
            ResponseStore.add(mock, callback);
        }, callback);
    },

    defaults: function(opts, callback){
        ResponseStore.reset();
        ResponseStore.addMocks(opts, callback);
    },

    find: function(req, callback) {
        var possibleMocks = findByOriginalUrl(req.method, req.originalUrl)

        if (possibleMocks === undefined) {
          possibleMocks = findByPath(req.method, req.path)
        }

        var mock = findByConditionalRequest(possibleMocks, req);

        callback(mock);
    },

    getAll: function() {
      return mocks;
    },

    reset: function (opts, callback) {

      if (opts && opts.method && opts.path) {
        mocks[opts.method][opts.path] = []
      } else {
        mocks = {};
      }

      if (typeof(callback) == "function") {
        callback();
      }
    },

    remove: function(mock, callback) {
      var mockStack = mocks[mock.method][mock.path]
      var idxToRemove;
      for (var i in mockStack) {
        if (equal(mockStack[i], mock)) idxToRemove = i;
      }
      if (idxToRemove) mockStack.splice(idxToRemove,1)
    }
};


function findByOriginalUrl(httpMethod, originalUrl){
  var exactMatch = (mocks[httpMethod] || {})[originalUrl]
  if (exactMatch) {
    return exactMatch
  }

  for (var mockPath in mocks[httpMethod]) {
    if(mocks[httpMethod][mockPath]) {
      for (var i = 0; i < mocks[httpMethod][mockPath].length; i++) {
        if (requestedPathMatchesMockPath(originalUrl, mocks[httpMethod][mockPath][i].path)) {
          return mocks[httpMethod][mockPath];
        }
      }
    }
  }
}

function findByPath(httpMethod, requestedPath) {
  for (var mockPath in mocks[httpMethod]) {
    if (requestedPathMatchesMockPath(requestedPath, mockPath)) {
      return mocks[httpMethod][mockPath];
    }
  }
}

function requestedPathMatchesMockPath(requestedPath, mockPath) {
  var mockPathRegex;
  if(_.isRegExp(mockPath)) {
    mockPathRegex = mockPath;
  } else if(_.isString(mockPath)) {
    if(!/^\/.+\/$/.test(mockPath)) {
      mockPathRegex = new RegExp(mockPath.replace(/\//g, '\/').replace(/\?/g, '\\?').replace('*', '.*'));
    } else {
      mockPathRegex = new RegExp(mockPath.replace(/^\//, '').replace(/\/$/, ''));
    }
  }
  return mockPathRegex && mockPathRegex.test(requestedPath);
}

function findByConditionalRequest(possibleMocks, request) {
  var mockWithNoCondition;
  var mockThatMatchesACondition;
  for (var i in possibleMocks) {
    var mock = possibleMocks[i];
    if (equal(mock.conditionalRequestBody, request.body) &&
        mock.conditionalRequestHeaders && containsHeaders(mock.conditionalRequestHeaders, request.headers)) {
      return mock;
    }
    if (!mock.conditionalRequestHeaders && equal(mock.conditionalRequestBody, request.body)) {
        mockThatMatchesACondition = mock;
    }
    if (!mock.conditionalRequestBody && mock.conditionalRequestHeaders && containsHeaders(mock.conditionalRequestHeaders, request.headers)) {
        mockThatMatchesACondition = mock;
    }
    if (!mock.conditionalRequestBody && !mock.conditionalRequestHeaders)  {
      mockWithNoCondition = mock;
    }
  }

  if (mockThatMatchesACondition) {
    return mockThatMatchesACondition
  }
  return mockWithNoCondition;
}


function containsHeaders(expected, actual) {
  var result = false;
  for (var name in expected) {
    if (actual[name] === expected[name] || actual[name.toLowerCase()] === expected[name]) {
      result = true;
    } else {
       return false;
    }
  }
  return result;
}


module.exports = ResponseStore;
