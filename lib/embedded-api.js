var Server = require("../server.js");
var responseStore = require('./responseStore');
var requestStore = require('./requestStore');

var embbededApi = function() {

  this.mock = function(opts, callback) {
    responseStore.add(opts, callback);
  }

  this.lastRequest = requestStore.find;
  this.totalRequests = requestStore.totalRequests;

  this.reset = function() {
    responseStore.reset();
    requestStore.reset();
  }

  this.server = new Server().start(7000);

  this.defaults = function(opts, callback){
    responseStore.defaults(opts, callback);
  }

  return this;
};

module.exports = new embbededApi();
