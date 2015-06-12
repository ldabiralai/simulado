var requests = {
    'GET': {},
    'POST': {},
    'PUT': {},
    'DELETE': {}
}

var RequestStore = {
    add: function(request, callback) {
        var baseRequest = {
            headers: request.headers || {},
            body: request.body || {},
            params: request.query || {}
        }

        switch(request.method) {
            case 'GET': {
                requests['GET'][request.path] = baseRequest;
                break;
            }
             case 'POST': {
                requests['POST'][request.path] = baseRequest;
                break;
            }
             case 'PUT': {
                requests['PUT'][request.path] = baseRequest;
                break;
            }
             case 'DELETE': {
                requests['DELETE'][request.path] = baseRequest;
                break;
            }
        }

        if (typeof(callback) == "function") {
          callback();
        }
    },

    find: function(httpMethod, path) {
        return requests[httpMethod][path];
    }
};

module.exports = RequestStore;
