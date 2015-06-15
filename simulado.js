var superagent = require('superagent');
var child_process = require('child_process');

var Simulado = function() {

    child_process.execFile('lsof', ['-t', '-i', 'tcp:7000'], function(err, out, code) {
        if(out == '') {
            require('child_process').fork('./bin/simulado');
        }
    });

    this.url = "http://localhost:7000"

    this.mock = function(opts, callback) {
        superagent.post(this.url + '/mock')
        .accept('json')
        .type('json')
        .send(opts)
        .end(function() {
            callback();
        });
    };

    this.lastRequest = function(httpMethod, path, callback) {
        superagent.get(this.url + "/lastRequest")
        .query({"httpMethod": httpMethod})
        .query({"path": path})
        .end(function(_, res) {
            callback(res.body);
        });
    };

    this.reset = function() {
        superagent.get(this.url + "/reset");
    }
};

module.exports = new Simulado();
