var requests = {}

var RequestStore = {
    add: function(request, callback) {
        var baseRequest = {
            headers: request.headers || {},
            body: request.body || {},
            params: request.query || {}
        }


        if (requests[request.method] == undefined) {
            requests[request.method] = {}
        }

        requests[request.method][request.path] = baseRequest;

        if (typeof(callback) == "function") {
          callback();
        }
    },

    find: function(httpMethod, path) {
        return requests[httpMethod][path];
    },

    reset: function() {
        requests = {};
    }
};

module.exports = RequestStore;
