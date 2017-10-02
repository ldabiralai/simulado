# Simulado

[![Circle CI](https://circleci.com/gh/ldabiralai/simulado.svg?style=svg)](https://circleci.com/gh/ldabiralai/simulado)

### Install
```bash
npm i simulado --save-dev
```

### Usage
#### CLI
```bash
./node_modules/.bin/simulado
```

This will keep the server alive until the process is killed (unlike the below).

#### Basic Usage
```javascript
import simulado from 'simulado';

// Start Simulado server
simulado.start({
  port: 1234, // Default: 7001
  https: {
    key: 'path/to/key',
    cert: 'path/to/cert'
  }
});

// Mock a response
simulado.addMock({
  method: 'GET',
  path: '/data',
  status: 200,
  body: {
    data: 'Some Data'
  }
});

// Make a request
request.get('http://localhost:1234/data')
  .then(console.log) // => { data: 'Some Data' }

// Stop Simulado server once done
simulado.close();
```

### API

#### `start([options])`
Start Simulado
  * options `<Object>`
    * `port` `<number>` - Specify the port number to start Simulado on. Default: `7001`
    * `https` `<object>` - Enable https support
      * `key` `<string>` - path to key file
      * `cert` `<string>` - path to cert file


#### `addMock(mockResponse)`
Add a mock response
  * `mockResponse` `<MockResponse>` - Add a response to the store. [Full options MockResponse](#mock-response-options).


#### `addMocks(mockResponses)`
Adds multiple mock responses
  * `mockResponses` `[<MockResponse>]` - Add responses to the store. [Full options MockResponse](#mock-response-options).


#### `setDefaults(mockResponses)`
Clears mocked responses and sets new mocked responses 
  * `mockResponses` `[<MockResponse>]` - Add responses to the store. [Full options MockResponse](#mock-response-options).


#### `lastRequests(method, path[, limit])`
Fetch the last requests for a path
  * `method` `<String>` - The request method for the requests you want to fetch
  * `path` `<String>` - The path of the requests you want to fetch
  * `limit` `<number>` - Only return the given number of last requests


#### `lastRequest(method, path)`
Fetch the last request for a path
  * `method` `<String>` - The request method for the requests you want to fetch
  * `path` `<String>` - The path of the requests you want to fetch


#### `clearResponses()`
Clear all mocked responses from the store.


#### `clearRequests()`
Clear all captured requests from the store.


#### `stop()`
Stop Simulado.

### Mock Response Options
```javascript
{
  // Path - Mandatory - The HTTP request path that you want the mock to response to.
  path: '/testPath', // String path
  path: /\/testPath/.*/, // Regex path
  
  method: 'GET', // Optional (defaults to GET if not set) - The HTTP request method that you want the mock to response to.
  
  status: 200, // Optional (defaults to 200 if not set) - The HTTP status you want to mock to response with.
  
  headers: {
    'X-Custom-Header': 'Custom Header Value'
  }, // Optional - The HTTP headers you want the mock to respond with.

  body: {
    data: 'DATA'
  }, // Optional - The HTTP response body you want the mock to respond with.

  conditionalHeaders: {
    needMe: 'true'
  }, // Optional - The mock with only response if the conditional headers are sent in the request.

  conditionalBody: {
    data: 'YouNeedThisData'
  }, // Optional - The mock will only response if the conditional body is sent in the request.
  
  delay: 5000 // the time (in milliseconds) to wait until responding to a request
}
```
