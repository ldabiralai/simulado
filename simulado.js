var app = require('express')();
var cors = require('cors');
var responseStore = require('./responseStore');

app.use(cors());

var Simulado = function() {
    app.get('/', function(_, res) {
        res.send("Simulado running..");
    });
    app.all('*', function(req, res) {
        responseStore.find(req, function(mock) {
            if(mock) {
                res.status(mock.status).send(mock.response);
            } else {
                res.status(404).send({});
            }
        });
    });
    app.listen(7000, function() {

    });
};

Simulado.prototype.mock = responseStore.add;

module.exports = new Simulado();
