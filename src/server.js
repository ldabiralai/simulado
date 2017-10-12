const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const spdy = require('spdy');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const PortStore = require('./stores/PortStore');
const ResponseStore = require('./stores/ResponseStore');
const RequestStore = require('./stores/RequestStore');

const app = express();
const responseStore = new ResponseStore();
const requestStore = new RequestStore();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use('/simulado/public', express.static(`${__dirname}/../public`));
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  const mockedResponses = responseStore.getState();
  res.render('index', { mockedResponses: JSON.stringify(mockedResponses) });
});

app.get('/simulado/requests', (req, res) => {
  const { method, path, limit } = req.query;
  const requests = requestStore.get(method, path, limit);
  res.status(200).send(requests);
});

app.post('/simulado/response', (req, res) => {
  const responseToMock = req.body;
  responseStore.add(responseToMock);
  res.sendStatus(201);
});

app.delete('/simulado/response', (req, res) => {
  const { method, path } = req.query
  responseStore.remove(method, path);
  res.sendStatus(201);
});

app.delete('/simulado/responses', (req, res) => {
  responseStore.removeAll();
  res.sendStatus(201);
});

app.delete('/simulado/request', (req, res) => {
  const { method, path } = req.query
  requestStore.remove(method, path);
  res.sendStatus(201);
});

app.delete('/simulado/requests', (req, res) => {
  requestStore.removeAll();
  res.sendStatus(201);
});

app.all('*', (req, res) => {
  const matchedResponse = responseStore.match(req.method, req.url, req.headers, req.body);

  if (matchedResponse) {
    const { delay } = matchedResponse;
    const { path, method, headers, body } = req;
    const response = () =>
      res
        .set(matchedResponse.headers)
        .status(matchedResponse.status)
        .send(matchedResponse.body);

    if (delay) {
      setTimeout(() => {
        requestStore.add({ path, method, headers, body });
        return response();
      }, delay);
    } else {
      requestStore.add({ path, method, headers, body });
      return response();
    }
  } else {
    res.sendStatus(404);
  }
});

let server;
module.exports.start = (options = {}) => {
  const portStore = new PortStore(options.port);
  const portNumber = portStore.getState().port;
  const { key, cert } = options.https || {};

  if (key && cert) {
    const httpsOptions = {
      key: fs.readFileSync(path.join(__dirname, key)),
      cert: fs.readFileSync(path.join(__dirname, cert)),
      spdy: ['h2', 'http/1.1']
    };

    server = spdy.createServer(httpsOptions, app).listen(portNumber);
  } else {
    if (key) {
      console.error('* ERR: key option present, but cert was not provided');
    }

    if (cert) {
      console.error('* ERR: cert option present, but key was not provided');
    }

    server = http.createServer(app).listen(portNumber);
  }

  console.log(`SIMULADO STARTED ON PORT: ${portNumber}`);

  return server;
};

module.exports.stop = () => {
  server.close();
};
