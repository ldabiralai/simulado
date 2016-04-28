var requests = {};
var totalRequests = {};
var lastRequests = [];
var LAST_REQUEST_LIMIT = 10;

var RequestStore = {
    add: function(request, path, callback) {

        var baseRequest = {
            headers: request.headers || {},
            body: request.body || {},
            params: request.query || {}
        };


        if (requests[request.method] == undefined) {
            requests[request.method] = {}
        }

        requests[request.method][path] = baseRequest;
        this.incrementTotalRequests(request);

        if (lastRequests.length >= LAST_REQUEST_LIMIT) {
            lastRequests.shift();
        }

        lastRequests.push({method: request.method, path: path, request: baseRequest});


        if (typeof(callback) == "function") {
          callback();
        }
    },

    returnLastRequests: function () {
        return lastRequests;
    },

    find: function(httpMethod, path) {
      var request;

      if (requests[httpMethod] !== undefined) {
        if (requests[httpMethod][path] !== undefined) {
          request = requests[httpMethod][path];
        } else {
          for (var key in requests[httpMethod]) {
            var re = new RegExp(key);
            if (re.test(path)) {
              request = requests[httpMethod][key];
            }
          }
        }
      }
      return request;
    },

    totalRequests: function(httpMethod, path) {
      var regex = new RegExp("" + path); 

      if (totalRequests[httpMethod]) {
        return Object.keys(totalRequests[httpMethod]).filter(function(endpoint) {
          return endpoint.match(regex)
        }).length;
      }

      return 0
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
        lastRequests = [];
    },
  
    getAll: function() {
      return requests;
    }
};

module.exports = RequestStore;
