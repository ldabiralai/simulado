var app = require('express')();
var cors = require('cors');
var mocks = {
    'GET': {}
};

app.use(cors());

var Simulado = function() {
    app.get('/', function(_, res) {
        res.send("Simulado running..");
    });
    app.all('*', function(req, res) {
        findMock(req, function(mock) {
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

Simulado.prototype.mock = function(opts, callback) {
    opts = opts || {};
    var baseMock = {
        path: opts.path || '',
        method: opts.method || 'GET',
        status: opts.status || 200,
        response: opts.response || {}
    }

    switch(baseMock.method) {
        case 'GET': {
            mocks['GET'][baseMock.path] = baseMock;
            break;
        }
    }

    if (typeof(callback) == "function") {
      callback();
    }
}

function findMock(req, callback) {
    console.log(req.method);
    var mock = mocks[req.method][req.path];
    callback(mock);
}

module.exports = new Simulado();
