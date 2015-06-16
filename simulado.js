var Server = require("./lib/server.js");
var responseStore = require('./lib/responseStore');
var requestStore = require('./lib/requestStore');

var Simulado = function() {

    this.mock = responseStore.add;

    this.lastRequest = requestStore.find;

    this.reset = function() {
        responseStore.reset();
        requestStore.reset();
    }

    new Server().start(7000);

};

module.exports = new Simulado();
