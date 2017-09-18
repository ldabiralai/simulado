const {start, stop} = require('./server')
const {
  addMock,
  lastRequests,
  lastRequest,
  clearResponses,
  clearRequests
} = require('./simulado.js');

module.exports = {
  start,
  stop,
  addMock,
  lastRequests,
  lastRequest,
  clearResponses,
  clearRequests
};
