var Simulado = require('../simulado')();

before(function(done) {
    Simulado.assinate(done);
});

beforeEach(function(done) {
    Simulado.start(done);
});

after(function(done) {
    Simulado.assinate(done);
});
