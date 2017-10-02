const axios = require('axios');
const PortStore = require('./stores/PortStore');

const getPortNumber = () => {
  const portStoreInstance = new PortStore();
  return portStoreInstance.getState().port;
};

const addMock = responseToMock => {
  const { path } = responseToMock;

  return axios
    .post(
      `http://localhost:${getPortNumber()}/simulado/response/set`,
      Object.assign({}, responseToMock, {
        path: path.toString(),
        isRegexPath: typeof path === 'object'
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then(() => true);
};

const addMocks = async responsesToMock => {
  return await Promise.all(responsesToMock.map(addMock));
};

const setDefaults = async responsesToMock => {
  await clearRequests();
  await clearResponses();

  return await addMocks(responsesToMock);
};

const lastRequests = (method, path, limit) => {
  return axios
    .get(
      `http://localhost:${getPortNumber()}/simulado/requests?method=${method.toUpperCase()}&path=${path}${limit
        ? `&limit=${limit}`
        : ''}`,
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then(response => response.data);
};

const lastRequest = async (method, path) => {
  const lastRequest = await lastRequests(method, path, 1);
  return lastRequest[0];
};

const clearResponses = () => {
  return axios
    .delete(`http://localhost:${getPortNumber()}/simulado/responses/clear`)
    .then(() => true);
};

const clearRequests = () => {
  return axios
    .delete(`http://localhost:${getPortNumber()}/simulado/requests/clear`)
    .then(() => true);
};

module.exports = {
  addMock,
  addMocks,
  setDefaults,
  lastRequests,
  lastRequest,
  clearResponses,
  clearRequests
};
