var superagent = require('superagent');

module.exports = function (options) {

  return {

    mock: function(opts, callback) {
      superagent.post(options.baseUrl + "/syncMock")
        .type("json")
        .send(opts)
        .end(function(err, res) {
          if (callback) callback(err, res)
        });
    },

    defaults: function(opts, callback) {
      superagent.post(options.baseUrl +"/syncDefaults")
        .type("json")
        .send(opts)
        .end(function(err, res) {
          if (callback) callback(err, res)
        });
    },

    lastRequest: function(method, path, callback) {
      superagent.get(options.baseUrl +"/lastRequest")
        .set('method', method)
        .set('path', path)
        .end(function(err, res) {
          if (callback) callback(err, res)
        });
    },

    lastRequests: function(method, path, callback) {
      superagent.get(options.baseUrl +"/lastRequests")
        .set('method', method)
        .set('path', path)
        .end(function(err, res) {
          if (callback) callback(err, res)
        });
    },

    clearLastRequests: function(callback) {
      superagent.delete(options.baseUrl +"/clearLastRequests")
        .end(function(err, res) {
          if (callback) callback(err, res)
        });
    }

  }

};
