var requests = {};
var totalRequests = {};

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
        this.incrementTotalRequests(request);

        if (typeof(callback) == "function") {
          callback();
        }
    },

    find: function(httpMethod, path) {
      var request;
      if (requests[httpMethod] !== undefined) {
        if (requests[httpMethod][path] !== undefined) {
          request = requests[httpMethod][path];
        }
      }
      return request;
    },

    totalRequests: function(httpMethod, path) {
      if (totalRequests[httpMethod] && totalRequests[httpMethod][path]) {
        return totalRequests[httpMethod][path];
      }
      return 0;
    },

    incrementTotalRequests: function(req) {
      var method = req.method
        , path = req.path;

      totalRequests[method]       = totalRequests[method] || {};
      totalRequests[method][path] = totalRequests[method][path] || 0;
      totalRequests[method][path] += 1;
    },

    reset: function() {
        requests = {};
        totalRequests = {};
    },
  
    getAll: function() {
      return requests;
    }
};

module.exports = RequestStore;
