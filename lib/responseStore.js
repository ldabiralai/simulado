var mocks = {}

var ResponseStore = {
    add: function(opts, callback) {
        opts = opts || {};
        var baseMock = {
            path: opts.path || '',
            headers: opts.headers || {},
            method: opts.method || 'GET',
            status: opts.status || 200,
            response: opts.response || {}
        }

        if (mocks[baseMock.method] == undefined) {
            mocks[baseMock.method] = {}
        }

        mocks[baseMock.method][baseMock.path] = baseMock;

        if (typeof(callback) == "function") {
          callback();
        }
    },

    find: function(req, callback) {
        var mock = mocks[req.method][req.path];
        callback(mock);
    },

    getAll: function() {
      return mocks;
    }
};

module.exports = ResponseStore;
