var Simulado = require('../simulado.js')();
var child_process = require('child_process');
var chai = require('chai').should();

describe('Simulado assination', function() {

    it('should assinate if called', function(done) {
        Simulado.start(function() {
            Simulado.assinate(function() {
                child_process.execFile('lsof', ['-t', '-i', 'tcp:7000'], function(err, out, code) {
                    out.should.equal('')
                    done();
                });
            });
        });
    });

});
