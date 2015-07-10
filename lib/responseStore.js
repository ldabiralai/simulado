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
        var mock = (mocks[req.method] || {}) [req.path];
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
