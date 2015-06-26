# Simulado
A simple mockserver for testing with nodejs

[![Build Status](https://travis-ci.org/bskyb/simulado.svg)](https://travis-ci.org/bskyb/simulado)

## How to use
### Install
    npm install simulado
### Require
    var Simulado = require('simulado');
### Mock
```path``` is mandatory, without it Simulado will not mock anything.

```status``` defaults to ```200``` if no status is provided.

```headers``` defaults to ```{}``` if no headers are provided.

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
### Viewing mocked reponses
To view the mocked reponses you will need to run `simulado` before running the tests. This will start a server up on port 7001 and will persist all the mocked endpoints that are used in the tests.
```bash
# If you have simulado installed gloabally run
simulado
# otherwise
./node_modules/simulado/bin/simulado
```
To inspect all the mocked endpoints you can goto `http://localhost:7001/inspect`. You can use these enpoints while developing your app by making an API call the `http://localhost:7001/[path]`.
### Reset 
To clear all mocked responses 
```
Simulado.reset()
```
### Stop
To stop simulado call `Simulado.stop([callback])`.
