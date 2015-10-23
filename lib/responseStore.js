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
        var mock = (mocks[req.method] || {}) [req.originalUrl];
        if(mock === undefined) {
          mock = (mocks[req.method] || {}) [req.path];
          if (mock === undefined) {
            for (var key in mocks[req.method]) {
              var keyAsRegex = key.replace(/\//g, '\/').replace(/\?/g, '\?').replace('*', '.*');
              var re = new RegExp(keyAsRegex);
              if (re.test(req.path)) {
                mock = mocks[req.method][key];
                mock.path = keyAsRegex;
              }
            }
          }
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

module.exports = ResponseStore;
