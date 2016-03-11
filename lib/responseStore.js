var async = require('async');
var equal = require('deep-equal');

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

    defaults: function(opts, callback){
        ResponseStore.reset();
        async.each(opts, function(mock, callback) {
          ResponseStore.add(mock, callback);
        }, callback);
    },

    find: function(req, callback) {
        var possibleMocks = findByOriginalUrl(req.method, req.originalUrl)

        if (possibleMocks === undefined) {
          possibleMocks = findByPath(req.method, req.path)
        }
      
        var mock = findByConditionalRequestBody(possibleMocks, req.body);
        
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
        
        if (mock.conditionalRequestBody) {
            var idxToRemove;
            for (var i=0; i < mockStack.length; i++) {
                if (equal(mockStack[i].conditionalRequestBody, mock.conditionalRequestBody)) {
                    idxToRemove = i;
                }  
            }
            mockStack.splice(idxToRemove,1);
        }
        else {
            mockStack.pop()
        }
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

module.exports = ResponseStore;
