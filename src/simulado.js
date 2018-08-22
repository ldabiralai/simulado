const axios = require('axios');
const PortStore = require('./stores/PortStore');

const getPortNumber = () => {
  const portStoreInstance = new PortStore();
  return portStoreInstance.getState().port;
};

let remoteServerUrl;
const setRemoteServer = url => {
  if (url.endsWith('/')) {
    remoteServerUrl = url.slice(0, -1);
  } else {
    remoteServerUrl = url;
  }
};

let getServerUrl = () => {
  if (remoteServerUrl) {
    return remoteServerUrl;
  }

  return `http://localhost:${getPortNumber()}`;
};

const addMock = responseToMock => {
  const { path } = responseToMock;

  return axios
    .post(
      `${getServerUrl()}/simulado/response`,
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
      `${getServerUrl()}/simulado/requests?method=${method.toUpperCase()}&path=${path}${
        limit ? `&limit=${limit}` : ''
      }`,
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then(response => response.data);
};

const lastRequest = async (method, path) => {
  const lastRequest = await lastRequests(method, path, 1);
  return lastRequest[0];
};

const clearResponse = (method, path) => {
  return axios
    .delete(`${getServerUrl()}/simulado/response?method=${method.toUpperCase()}&path=${path}`)
    .then(() => true);
};

const clearResponses = () => {
  return axios.delete(`${getServerUrl()}/simulado/responses`).then(() => true);
};

const clearRequest = (method, path) => {
  return axios
    .delete(`${getServerUrl()}/simulado/request?method=${method.toUpperCase()}&path=${path}`)
    .then(() => true);
};

const clearRequests = () => {
  return axios.delete(`${getServerUrl()}/simulado/requests`).then(() => true);
};

module.exports = {
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
