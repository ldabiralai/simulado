var mocks = {
    'GET': {},
    'POST': {},
    'PUT': {},
    'DELETE': {}
}

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

        switch(baseMock.method) {
            case 'GET': {
                mocks['GET'][baseMock.path] = baseMock;
                break;
            }
             case 'POST': {
                mocks['POST'][baseMock.path] = baseMock;
                break;
            }
             case 'PUT': {
                mocks['PUT'][baseMock.path] = baseMock;
                break;
            }
             case 'DELETE': {
                mocks['DELETE'][baseMock.path] = baseMock;
                break;
            }
        }

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
