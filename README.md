# Simulado
 > A simple mockserver for testing with nodejs

[![Circle CI](https://circleci.com/gh/ldabiralai/simulado.svg?style=svg)](https://circleci.com/gh/ldabiralai/simulado)

## How to use

### Install
    npm install simulado

### Start

```bash
# If you have simulado installed gloabally run
simulado
# otherwise
./node_modules/simulado/bin/simulado
```

### Require
    var Simulado = require('simulado');


### Mock

```javascript
Simulado.mock(opts, callback)
```

`path` is mandatory, without it Simulado will not mock anything.

`method` (defaults to `GET`). Possible values are `GET`, `POST`, `PUT`or `DELETE`

`requestHeaders` if supplied, the mocks will only be returned when the request supplies these headers.

`status` (defaults to `200`) Status of the mock response.

`headers` (defaults to `{}`) Headers of the mock response.

`response` (defaults to `{}`) body of the mock response.

`timeout` (defaults to `0`, i.e. no delay) If it's specified, Simulado will wait (x seconds) and then send a response.

**callback**

The `callback` will be called once Simulado has finished mocking the endpoint. You should probably put the rest of your step in a function here.

```javascript
Simulado.mock({
    path: '/account/devices'
    requestHeaders: { "X-USER-ID" : "expected-user-id" },
    status: 401,
    headers: {"Content-Type": 'application/json'},
    response: {
      id: 123,
      type: "MOBILE",
      name: "My work phone"
    }
  }
}, callback)
```

##### Wildcards

```javascript
Simulado.mock({
  path: '/account/*',
  status: 200,
  headers: {"Content-Type": 'application/json'},
  response: {
    id: 123,
    type: "MOBILE",
    name: "My work phone"
  }
}, callback)
```

<code>GET localhost.com/account/path-here => OK 200</code>

### Getting the last request
You can retrive the request made to an endpoint with ```Simulado.lastRequest(httpMethod, path)```
```javascript
Simulado.lastRequest('POST', '/postingPath', function(err, lastRequestMade) {
  lastRequestMade.headers // => {"Content-Type": "application/json"}
  lastRequestMade.body // => {"name": "simulado"}

  // http://localhost:7000/postingPath?paramName=value
  lastRequestMade.params // => {"paramName": "value"}
})

```
or you can make a request to ```http://localhost:7000/lastRequest``` with two headers (method and path), which will respond with the last request as JSON.
Example (using superagent)
```javascript
superagent.get('http://localhost:7000/lastRequest')
  .set('method', 'POST')
  .set('path', '/postingPath')
  .end(function(_, res) {
    var lastRequestMade = res.body;
    res.body.headers // => {"paramName": "value"}
  });
```
### Use
After mocking, you can call the endpoint whichever way you like. Simulado starts a server on ```localhost:7001``` the path you specify is relative to this.
### Viewing mocked reponses
To inspect all the mocked endpoints you can goto `http://localhost:7001/inspect`. You can use these enpoints while developing your app by making an API call the `http://localhost:7001/[path]`.
