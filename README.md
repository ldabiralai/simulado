# Simulado
A simple mockserver for testing with nodejs

[![Build Status](https://travis-ci.org/ldabiralai/simulado.svg)](https://travis-ci.org/ldabiralai/simulado)

## How to use
### Install
    npm install simulado
### Require
    var Simulado = require('simulado');
### Mock
```path``` is mandatory, without it Simulado will not mock anything.

```status``` defaults to ```200``` if no status is provided.

```headers``` defaults to ```{}``` if no headers is provided.

```response``` will respond with ```{}``` if no response is provided, otherwise it will return what you give it.

```method``` defaults to ```GET``` if no method is provided. Possible values are ```GET``` ```POST``` ```PUT``` ```DELETE```

The ```callback``` will be called once Simulado has finished mocking the endpoint. You should probably put the rest of your step in a function here.
```javascript
Simulado.mock({
  path: '/account/devices',
  status: 401,
  headers: {"Content-Type": 'application/json'},
  response:
    id: 123,
    type: "MOBILE",
    name: "My work phone"
  }
}, callback)
```
### Getting the last request
You can retrive the request made to an endpoint with ```Simulado.lastRequest(httpMethod, path)```
```javascript
var lastRequestMade = Simulado.lastRequest('POST', '/postingPath')

lastRequestMade.headers // => {"Content-Type": "application/json"}
lastRequestMade.body // => {"name": "simulado"}

// http://localhost:7000/postingPath?paramName=value
lastRequestMade.params // => {"paramName": "value"}
```
### Use
After mocking, you can call the endpoint whichever way you like. Simulado starts a server on ```localhost:7000``` the path you specify is relative to this.
### Viewing mocked responses
To view all the mocked endpoints goto ```http://localhost:7000/inspect```
