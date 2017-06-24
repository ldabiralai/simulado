import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import spdy from 'spdy';
import fs from 'fs';
import path from 'path'
import ResponseStore from './stores/ResponseStore';
import RequestStore from './stores/RequestStore';

const app = express();
const responseStore = new ResponseStore();
const requestStore = new RequestStore();

app.use(bodyParser.json());
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.status(200).sendFile(`${__dirname}/../public/index.html`);
});

app.get('/simulado/requests', (req, res) => {
  const allRequests = requestStore.getState();
  res.status(200).send(allRequests);
});

app.post('/simulado/response/set', (req, res) => {
  const responseToMock = req.body;
  responseStore.add(responseToMock);
  res.sendStatus(201);
});

app.delete('/simulado/responses/clear', (req, res) => {
  responseStore.removeAll();
  res.sendStatus(201);
});

app.delete('/simulado/requests/clear', (req, res) => {
  requestStore.removeAll();
  res.sendStatus(201);
});

app.all('*', (req, res) => {
  const matchedResponse = responseStore.match(req.method, req.path, req.headers, req.body);

  if (matchedResponse) {
    const { path, method, headers, body } = req;
    requestStore.add({ path, method, headers, body });
    return res.status(matchedResponse.status).send(matchedResponse.body);
  }

  res.sendStatus(404);
});

let server

export const start = (options={}) => {
  const port = options.port || 9999
  const https = options.https

  if (https) {
    const {key, cert} = https

    if (!key || !cert) {
      throw new Error('Passed https option, but no key or cert path defined')
    }

    const httpsOptions = {
      key: fs.readFileSync(path.join(__dirname, key)),
      cert: fs.readFileSync(path.join(__dirname, cert)),
      spdy: ['h2', 'http/1.1']
    }

    server = spdy.createServer(httpsOptions, app).listen(port)
  } else {
    server = http.createServer(app).listen(port)
  }

  console.log(`SIMULADO STARTED ON PORT: ${port}`);

  return server
}

export const stop = () => {
  server.close()
}
