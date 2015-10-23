var Server = require("./server.js");
var responseStore = require('./lib/responseStore');
var requestStore = require('./lib/requestStore');
var sync = require("./lib/sync");

var Simulado = function() {

  this.mock = function(opts, callback) {
    sync.addMock(opts)
    responseStore.add(opts, callback);
  }

  this.lastRequest = requestStore.find;
  this.totalRequests = requestStore.totalRequests;

  this.reset = function() {
    responseStore.reset();
    requestStore.reset();
  }

  this.server = new Server().start(7001);

  this.stop = function() {
    this.server.stop();
  }

  this.defaults = function(opts, callback){
    responseStore.defaults(opts, callback);
    sync.addDefaults(opts)
  }

  return this;
};

module.exports = new Simulado();
