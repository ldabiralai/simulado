var superagent = require('superagent');
var callbackOrPromise = require('./callback-or-promise');

module.exports = function (options) {

  return {

    mock: function (opts, callback) {
      return callbackOrPromise(function () {
        return superagent.post(options.baseUrl + "/syncMock")
          .type("json")
          .send(opts);
      }, callback);
    },

    mocks: function (opts, callback) {
      return callbackOrPromise(function () {
        return superagent.post(options.baseUrl + "/syncMocks")
          .type("json")
          .send(opts);
      }, callback);
    },

    defaults: function (opts, callback) {
      return callbackOrPromise(function () {
        return superagent.post(options.baseUrl + "/syncDefaults")
          .type("json")
          .send(opts);
      }, callback);
    },

    lastRequest: function (method, path, callback) {
      return callbackOrPromise(function () {
        return superagent.get(options.baseUrl + "/lastRequest")
          .set('method', method)
          .set('path', path);
      }, callback);
    },

    lastRequests: function (method, path, callback) {
      return callbackOrPromise(function () {
        return superagent.get(options.baseUrl + "/lastRequests")
          .set('method', method)
          .set('path', path);
      }, callback);
    },

    clearLastRequests: function (callback) {
      return callbackOrPromise(function () {
        return superagent.delete(options.baseUrl + "/clearLastRequests");
      }, callback);
    }

  }

};
