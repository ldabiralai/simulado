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

const getServerUrl = () => {
  if (remoteServerUrl) {
    return remoteServerUrl;
  }

  return `http://localhost:${getPortNumber()}`;
};

const isRunning = () => {
  return axios
    .get(`${getServerUrl()}/simulado/status`)
    .then(response => true)
    .catch(() => false);
};

const addMock = responseToMock => {
  console.warn('Please use setMock as addMock is deprecated and will be removed in v4');
  return setMock(responseToMock);
};

const setMock = responseToMock => {
  const { path } = responseToMock;

  return axios
    .post(
      `${getServerUrl()}/simulado/response`,
      Object.assign({}, responseToMock, {
        path: path.toString(),
        isRegexPath: path instanceof RegExp
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then(() => true);
};

const addMocks = responsesToMock => {
  console.warn('Please use setMocks as addMocks is deprecated and will be removed in v4');
  return setMocks(responsesToMock);
};

const setMocks = async responsesToMock => {
  return await Promise.all(responsesToMock.map(setMock));
};

const setDefaults = async responsesToMock => {
  await clearRequests();
  await clearResponses();

  return await setMocks(responsesToMock);
};

const lastRequests = (method, path, limit) => {
  return axios
    .get(
      `${getServerUrl()}/simulado/requests?method=${method.toUpperCase()}&path=${path}${
        limit ? `&limit=${limit}` : ''
      }${path instanceof RegExp ? '&isRegexPath=true' : ''}`,
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then(response => response.data);
};

const lastRequest = async (method, path) => {
  const foundLastRequests = await lastRequests(method, path);
  return foundLastRequests[foundLastRequests.length - 1];
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
  isRunning,
  addMock,
  addMocks,
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
