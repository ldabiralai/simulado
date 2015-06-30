var superagent = require('superagent');

var Sync = {
  addMock: function(opts) {
    superagent.post("http://localhost:7001/syncMock")
    .type("json")
    .send(opts)
    .end(function(err, res) {});
  },

  addDefaults: function(opts) {
    superagent.post("http://localhost:7001/syncDefaults")
      .type("json")
      .send(opts)
      .end(function(err, res) {});
  }
}

module.exports = Sync;
