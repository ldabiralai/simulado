const { start, stop } = require('./server');
const {
  addMock,
  addMocks,
  setDefaults,
  lastRequests,
  lastRequest,
  clearResponses,
  clearRequests
} = require('./simulado.js');

module.exports = {
  start,
  stop,
  addMock,
  addMocks,
  setDefaults,
  lastRequests,
  lastRequest,
  clearResponses,
  clearRequests
};
