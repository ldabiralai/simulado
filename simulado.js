var Server = require("./lib/server.js");
var responseStore = require('./lib/responseStore');
var requestStore = require('./lib/requestStore');
var sync = require("./lib/sync");

var Simulado = function() {

  this.mock = function(opts, callback) {
    responseStore.add(opts, callback);
    sync.addMock(opts)
  }

  this.lastRequest = requestStore.find;

  this.reset = function() {
    responseStore.reset();
    requestStore.reset();
  }

  new Server().start(7000);

  return this;
};

module.exports = new Simulado();
