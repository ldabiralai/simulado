const { start, stop } = require('./server');
const {
  setRemoteServer,
  isRunning,
  setMock,
  setMocks,
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
  isRunning,
  setMock,
  setMocks,
  setDefaults,
  lastRequests,
  lastRequest,
  clearResponse,
  clearResponses,
  clearRequest,
  clearRequests
};
