# Simulado

[![Circle CI](https://circleci.com/gh/ldabiralai/simulado.svg?style=svg)](https://circleci.com/gh/ldabiralai/simulado)

### Install
```bash
npm i simulado --save-dev
```

### Basic Usage
#### ES2015
```javascript
import { start, addMock } from 'simulado';

let simuladoServer;

// Start Simulado server
simuladoServer = start();

// Mock a response
addMock({
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
