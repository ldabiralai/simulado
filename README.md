# Simulado
A simple mockserver for testing with nodejs

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
### Default Mocks on startup
You can pass the location of a default mocks json file on startup adding them to Simulado straight away.
```
simulado ./defaultMocks.json
```
### Require
    var Simulado = require('simulado');

### API
```path``` is mandatory, without it Simulado will not mock anything.

```status``` defaults to ```200``` if no status is provided.

```headers``` defaults to ```{}``` if no headers are provided.

```response``` will respond with ```{}``` if no response is provided, otherwise it will return what you give it.

```method``` defaults to ```GET``` if no method is provided. Possible values are ```GET``` ```POST``` ```PUT``` ```DELETE```

```timeout``` defaults to ```0``` so there will be no delay, accepts seconds. If it's specified, simulado will wait and then send a response.

### Mock
The `mock` will return a promise which will be fulfilled once the Simulado has finished mocking the endpoint. 
You may chain requests using `then` or `await` the call if you're inside an `async` function (See https://babeljs.io/docs/plugins/transform-async-to-generator/).
```javascript
Simulado.mock({
  path: '/account/devices',
  status: 401,
  headers: {"Content-Type": 'application/json'},
  response: {
    id: 123,
    type: "MOBILE",
    name: "My work phone"
  }
})
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
})
```
<code>GET localhost.com/account/path-here => OK 200</code>

### Mocks
If you want to mock out multiple requests at once you can use the `mocks` function.

The API endpoint for it is `/syncMocks`

```javascript
Simulado.mocks([
    {
      path: '/account/devices',
      status: 401,
      headers: {"Content-Type": 'application/json'},
      response: {
        id: 123,
        type: "MOBILE",
        name: "My work phone"
      }
    },
    {
      path: '/interactions/basket',
      status: 201,
      headers: {"Content-Type": 'application/json'},
      response: {
        products: [
            {id: '1'}
        ]
      }
    }
])
```


### Getting the last request
You can retrive the request made to an endpoint with ```Simulado.lastRequest(httpMethod, path)```
For instance, using `async/await`
```javascript
const lastRequestMade = await Simulado.lastRequest('POST', '/postingPath');
console.log(lastRequestMade.headers); // => {"Content-Type": "application/json"}
console.log(lastRequestMade.body); // => {"name": "simulado"}

// when called with: http://localhost:7000/postingPath?paramName=value
console.log(lastRequestMade.params); // => {"paramName": "value"}
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

### Callbacks
The old style `callbacks` are still available on all calls if you prefer to use them, but are now deprecated. 
The `callback` is always the last parameter and will be called once the method has completed or failed. 
For instance:
```javascript
Simulado.lastRequest(function(error, result) {
 if (error) {
   console.error(error);
 } else {
   var lastRequestMade = result.body;
   console.log(lastRequestMade.headers); // => {"paramName": "value"}
 }
});
```

### Use
After mocking, you can call the endpoint whichever way you like. Simulado starts a server on ```localhost:7001``` the path you specify is relative to this.

### Viewing mocked reponses
To inspect all the mocked endpoints you can goto `http://localhost:7001/inspect`. You can use these enpoints while developing your app by making an API call the `http://localhost:7001/[path]`.

### Custom URL
If you want to host simulado on a remote machine, you can require the remote API implementation which allows you to customize the endpoint.
Example:
```javascript
var Simulado = require('simulado/lib/remote-api-impl')({ baseUrl: 'http://simulado.onthecloud.com' });
```
