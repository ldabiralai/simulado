# Simulado

[![Circle CI](https://circleci.com/gh/ldabiralai/simulado.svg?style=svg)](https://circleci.com/gh/ldabiralai/simulado)

### Install
```bash
npm i simulado --save-dev
```

### Basic Usage
#### ES2015
```javascript
import simulado from 'simulado';

let simuladoServer;

// Start Simulado server
simuladoServer = simulado.start();

// Mock a response
simulado.addMock({
  method: 'GET',
  path: '/data',
  status: 200,
  body: {
    data: 'Some Data'
  }
});

// Stop Simulado server once done
simuladoServer.close();
```

Once a response is mocked you can then make a normal HTTP request to it.
```bash
curl -X GET http://localhost:9999/data #=> { "data": "Some data" }
```
