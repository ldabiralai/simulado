var app = require('express')();
var mocks = [];

var Simulado = function() {
    app.get('/', function(_, res) {
        res.send("Simulado running..");
    });
    app.all('*', function(req, res) {
        findMock(req, function(index) {
            if(index != null && index >= 0) {
                res.status(mocks[index].status).send(mocks[index].response);
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
        status: opts.status || 200,
        response: opts.response || {}
    }
    findMock(opts, function(index) {
        if(index >= 0)
            mocks.splice(index, 1);
        mocks.push(baseMock);

        if (typeof(callback) == "function") {
          callback();
        }
    });
}

function findMock(req, callback) {
    var index = mocks.map(function(m) { return m.path }).indexOf(req.path);
    if(index >= 0) {
        callback(index)
    } else {
        callback(null)
    }
}

module.exports = new Simulado();
