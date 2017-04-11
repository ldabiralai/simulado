import simulado from './src/index';

simulado.start();

simulado.addMock({
  method: 'GET',
  path: '/data',
  status: 200,
  body: { data: 'Some Data' }
});
