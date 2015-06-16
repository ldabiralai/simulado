var superagent = require('superagent');
var child_process = require('child_process');
var ps = require('ps-node');

var Simulado = function() {
    this.getPid = function(callback) {
        child_process.execFile('lsof', ['-t', '-i', 'tcp:7000'], function(err, out, code) {
            callback(out);
        });
    };

    this.start = function(callback) {
        callback = callback || function() {};
        this.getPid(function(pid) {
            if(pid) {
                callback();
            } else {
                require('child_process').fork('./bin/simulado').pid;
                // Wait for it to start
                setTimeout(callback, 200)
            }
        });
    };

    this.assinate = function(callback) {
        callback = callback || function() {};
        this.getPid(function(pid) {
            if(pid) {
                ps.kill(pid, callback); 
            } else {
                callback()
            }
        });
    };

    this.url = "http://localhost:7000"

    this.mock = function(opts, callback) {
        callback = callback || function() {};
        superagent.post(this.url + '/mock')
        .accept('json')
        .type('json')
        .send(opts)
        .end(callback);
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
    };


    return this;
};

module.exports = Simulado;
