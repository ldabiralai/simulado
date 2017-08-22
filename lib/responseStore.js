var async = require('async');
var equal = require('deep-equal');
var _ = require('lodash');

var mocksStore = {};
var scopedMocksStore = {};

var ResponseStore = {
    add: function(opts, callback) {
        opts = opts || {};
        var baseMock = {
            path: opts.path || '',
            headers: opts.headers || {},
            method: opts.method || 'GET',
            status: opts.status || 200,
            response: opts.response || {},
            timeout: opts.timeout || 0,
            sessionId: opts.sessionId
        }

        var mocks = getMocks(baseMock.sessionId)

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
        ResponseStore.reset(opts.sessionId);
        ResponseStore.addMocks(opts, callback);
    },

    find: function(req, callback) {
        var sessionId = getSessionId(req)

        var possibleMocks = findByOriginalUrl(req.method, req.originalUrl, sessionId)

        if (possibleMocks === undefined) {
          possibleMocks = findByPath(req.method, req.path, sessionId)
        }
      
        var mock = findByConditionalRequest(possibleMocks, req, sessionId);
        
        callback(mock);
    },

    getAll: function() {
      return mocksStore;
    },

    reset: function (opts, callback) {
      var mocks = getMocks(opts.sessionId)

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
      var mocks = getMocks(mock.sessionId)

      var mockStack = mocks[mock.method][mock.path]
      var idxToRemove;
      for (var i in mockStack) {
        if (equal(mockStack[i], mock)) idxToRemove = i;
      }
      if (idxToRemove) mockStack.splice(idxToRemove,1) 
    }
};


function findByOriginalUrl(httpMethod, originalUrl, sessionId){
  var mocks = getMocks(sessionId)
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

function findByPath(httpMethod, requestedPath, sessionId) {
  var mocks = getMocks(sessionId)
  for (var mockPath in mocks[httpMethod]) {
    if (requestedPathMatchesMockPath(requestedPath, mockPath)) {
      return mocks[httpMethod][mockPath];
    }
  }
}

function requestedPathMatchesMockPath(requestedPath, mockPath) {
  var mockPathRegex = mockPath;
  if(!_.isRegExp(mockPathRegex) && _.isString(mockPathRegex)) {
    mockPathRegex = new RegExp(mockPathRegex.replace(/\//g, '\/').replace(/\?/g, '\\?').replace('*', '.*'));
  }
  return mockPathRegex.test(requestedPath);
}

function findByConditionalRequest(possibleMocks, request, sessionId) {
  var mocks = getMocks(sessionId)
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

function getSessionId(req) {
  return req.headers.cookie ? req.headers.cookie.split(';')
    .map(function(el) { return el.split('=') })
    .find(function(el) {
      return el[0] === 'X-Simulado-SessionId'
    })[1] : null;
}

function getMocks(sessionId) {
  var mocks = mocksStore
  if (sessionId) {
    if (!scopedMocksStore[sessionId]) {
      scopedMocksStore[sessionId] = {}
    }

    mocks = scopedMocksStore[sessionId]
  }

  return mocks
}


module.exports = ResponseStore;
