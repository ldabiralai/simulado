var app = require('express')();
var bodyParser = require('body-parser');
var cors = require('cors');
var responseStore = require('./responseStore');
var requestStore = require('./requestStore');

app.use(cors());
app.use(bodyParser.json());

app.get('/', function(_, res) {
    res.send("Simulado running..");
});

app.get('/inspect', function(_, res) {
    res.send(responseStore.getAll());
});

app.post('/mock', function(req, res) {
    responseStore.add(req.body, function() {
        res.sendStatus(200);
    });
});

app.get('/lastRequest', function(req, res) {
    requestStore.find(req.query.httpMethod, req.query.path, function(lastRequest) {
        res.send(lastRequest);
    });
});

app.get('/reset', function(req, res) {
    responseStore.reset();
    requestStore.reset();
    res.sendStatus(200);
});

app.get('/assinate', function(req, res) {
    process.exit(0);
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

var server = app.listen(7000);
