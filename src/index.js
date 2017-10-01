const {start, stop} = require('./server')
const {
  addMock,
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
  setDefaults,
  lastRequests,
  lastRequest,
  clearResponses,
  clearRequests
};
