var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var responseStore = require('./lib/responseStore');
var requestStore = require('./lib/requestStore');
var path = require('path');

var Server = function() {
  app.use(cors({
    origin: 'http://localhost',
    credentials: true
  }));
  app.use(bodyParser.json({limit: '1mb'}));
  app.use(bodyParser.urlencoded({
      extended: true
  }));
  app.use(express.static(__dirname + '/public'));
  app.set('views', __dirname + '/views');
  app.engine('ejs', require('ejs').__express);
  app.set('view engine','ejs');

  app.get('/', function(_, res) {
      res.render("index.ejs", { responses: responseStore.getAll(), requests: requestStore.getAll() });
  });

  app.get('/ui', function(_, res) {
      res.sendFile(path.join(__dirname + '/views/ui.html'));
  });

  app.get('/inspect', function(_, res) {
    res.send(responseStore.getAll());
  });

  app.get('/lastRequests', function(request, res) {
    res.send(requestStore.returnLastRequests(request.headers.method, request.headers.path));
  });

  app.get('/lastRequest', function(request, res) {
    var lastRequest = requestStore.find(request.headers.method, request.headers.path)
    if (lastRequest !== undefined) {
      res.send(lastRequest);
    } else {
      res.sendStatus(204);
    }
  });

  app.get('/totalRequests', function(req, res) {
    var total = requestStore.totalRequests(req.headers.method, req.headers.path)
    res.send({ total: total });
  });

  app.post('/syncMock', function(req, res) {
    responseStore.add(req.body, function() {
      res.sendStatus(200);
    });
  });

  app.post('/syncMocks', function(req, res) {
    responseStore.addMocks(req.body, function() {
      res.sendStatus(200);
    });
  });

  app.delete('/clearLastRequests', function(request, res) {
    requestStore.reset();
    res.sendStatus(200);
  });

  app.post('/syncDefaults', function(req, res) {
    responseStore.defaults(req.body, function() {
      res.sendStatus(200);
    });
  });

  app.post('/reset', function(req, res) {
    responseStore.reset(req.body, function() {
      res.sendStatus(200);
    });
  });

  app.all('*', function(req, res) {
      res.set('Access-Control-Allow-Origin', req.get('origin'))
      responseStore.find(req, function(mock) {
          if (mock) {
              if (mock.once) { responseStore.remove(mock) }
              requestStore.add(req, mock.path);
              for(var header in mock.headers) {
                  res.header(header, mock.headers[header]);
              }
              if (mock.timeout > 0) {
                setTimeout(function() {
                  res.status(mock.status).send(mock.response);
                }, mock.timeout * 1000);
              } else {
                  res.status(mock.status).send(mock.response);
              }
          } else {
              res.status(404).send({});
          }
      });
  });

  this.start = function(port) {
    this.server = app.listen(port, function() {
      console.log('Simulado is running at http://localhost:%s', port);
    });
    return this;
  };

  this.stop = function(callback) {
    this.server.close(callback);
  };

  this.defaults = function(defaultResponses) {
    responseStore.defaults(defaultResponses);
  }
};

module.exports = Server;
