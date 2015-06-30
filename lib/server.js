var app = require('express')();
var bodyParser = require('body-parser');
var cors = require('cors');
var responseStore = require('./responseStore');
var requestStore = require('./requestStore');

var Server = function() {
  app.use(cors());
  app.use(bodyParser.json());

  app.get('/', function(_, res) {
      res.send("Simulado running..");
  });

  app.get('/inspect', function(_, res) {
    res.send(responseStore.getAll());
  });

  app.post('/syncMock', function(req, res) {
    responseStore.add(req.body, function() {
      res.sendStatus(200);
    });
  });

  app.post('/syncDefaults', function(req, res) {
    responseStore.defaults(req.body, function() {
      res.sendStatus(200);
    });
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

  this.start = function(port) {
    this.server = app.listen(port);
    return this;
  };

  this.stop = function(callback) {
    this.server.close(callback);
  };
}

module.exports = Server;
