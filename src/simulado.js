import axios from 'axios';

export const addMock = responseToMock => {
  return axios.post(
    'http://localhost:7001/simulado/response/set',
    responseToMock,
    { headers: { 'Content-Type': 'application/json' } }
  ).then(() => true);
};

export const lastRequests = (method, path, limit) => {
  return axios.get(
    `http://localhost:7001/simulado/requests?method=${method.toUpperCase()}&path=${path}${ limit ? `&limit=${limit}` : '' }`,
    { headers: { 'Content-Type': 'application/json' } }
  ).then(response => response.data);
};

export const lastRequest = async (method, path) => {
  const lastRequest = await lastRequests(method, path, 1);
  return lastRequest[0];
};

export const clearResponses = () => {
  return axios.delete('http://localhost:7001/simulado/responses/clear')
    .then(() => true);
};

export const clearRequests = () => {
  return axios.delete('http://localhost:7001/simulado/requests/clear')
    .then(() => true);
};
