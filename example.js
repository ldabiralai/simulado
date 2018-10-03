import simulado from './src/index';

simulado.start({
  port: 7002
});

simulado.addMock({
  method: 'GET',
  path: '/data',
  status: 200,
  body: { data: 'Some Data' }
});

simulado.addMock({
  method: 'GET',
  path: '/more-data',
  status: 200,
  body: { data: 'Some Data' }
});

simulado.addMock({
  method: 'POST',
  path: '/data',
  status: 201,
  headers: {
    'X-Header': 'blah'
  },
  conditionalHeaders: {
    'X-Header': 'X-Value'
  },
  conditionalBody: {
    some: 'data'
  },
  delay: 10
});

simulado.addMock({
  method: 'DELETE',
  path: '/boom',
  status: 204
});
