var async = require('async');

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

        if (mocks[baseMock.method] == undefined) {
            mocks[baseMock.method] = {}
        }

        mocks[baseMock.method] [baseMock.path] = baseMock;

        if (typeof(callback) == "function") {
          callback();
        }
    },

    defaults: function(opts, callback){
        async.each(opts, function(mock, callback) {
          ResponseStore.add(mock, callback);
        }, callback);
    },

    find: function(req, callback) {
        var mock = findByOriginalUrl(req.method, req.originalUrl)

        if (mock === undefined) {
          mock = findByPath(req.method, req.path)
        }
        
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

module.exports = ResponseStore;
