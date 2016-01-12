var superagent = require('superagent');

module.exports = {

  mock: function(opts, callback) {
    superagent.post("http://localhost:7001/syncMock")
      .type("json")
      .send(opts)
      .end(function(err, res) {
        if (callback) callback(err, res)
      });
  },

  defaults: function(opts, callback) {
    superagent.post("http://localhost:7001/syncDefaults")
      .type("json")
      .send(opts)
      .end(function(err, res) {
        if (callback) callback(err, res)
      });
  },

  lastRequest: function(method, path, callback) {
    superagent.get("http://localhost:7001/lastRequest")
      .set('method', method)
      .set('path', path)
      .end(function(err, res) {
        if (callback) callback(err, res)
      });
  }

};


