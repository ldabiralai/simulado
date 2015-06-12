var app = require('express')();
var bodyParser = require('body-parser');
var cors = require('cors');
var responseStore = require('./lib/responseStore');
var requestStore = require('./lib/requestStore');

app.use(cors());
app.use(bodyParser.json());

var Simulado = function() {
    app.get('/', function(_, res) {
        res.send("Simulado running..");
    });

    app.get('/inspect', function(_, res) {
      res.send(responseStore.getAll());
    });

    app.all('*', function(req, res) {
        responseStore.find(req, function(mock) {
            if(mock) {
                requestStore.add(req);
                for(var header in mock.headers) {
                    res.header(header, mock.headers[header]);
                }
                res.status(mock.status).send(mock.response);
            } else {
                res.status(404).send({});
            }
        });
    });

    app.listen(7000);
};

Simulado.prototype.mock = responseStore.add;
Simulado.prototype.lastRequest = requestStore.find;

module.exports = new Simulado();
