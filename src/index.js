const { start, stop } = require('./server');
const {
  setRemoteServer,
  addMock,
  addMocks,
  setDefaults,
  lastRequests,
  lastRequest,
  clearResponse,
  clearResponses,
  clearRequest,
  clearRequests
} = require('./simulado.js');

module.exports = {
  start,
  stop,
  setRemoteServer,
  addMock,
  addMocks,
  setDefaults,
  lastRequests,
  lastRequest,
  clearResponse,
  clearResponses,
  clearRequest,
  clearRequests
};
