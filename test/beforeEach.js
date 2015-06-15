var Simulado = require('../simulado.js');
before(function(done) {
    setTimeout(done, 1000);
});

beforeEach(function(done){
    Simulado.reset();
    done();
})
