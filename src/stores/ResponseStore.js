const deepEqual = require('deep-equal');
let instance;

export default class ResponseStore {
  constructor(initialState = {}) {
    if (!instance) {
      this.state = initialState;
      instance = this;
    }

    return instance;
  }

  getState() {
    return this.state;
  }

  add(responseToMock) {
    const responseMethod = responseToMock.method.toUpperCase();
    this.state = {
      ...this.state,
      [responseMethod]: [
        ...(this.state[responseMethod] || []),
        responseToMock
      ]
    }
  }

  remove(method, path) {
    const responseToRemoveMethod = method.toUpperCase();
    this.state = {
      ...this.state,
      [responseToRemoveMethod]: this.state[responseToRemoveMethod].filter(response => response.path !== path)
    };
  }

  match(method, path, requestHeaders = {}, requestBody) {
    const requestMethod = method.toUpperCase();
    const responsesForMethod = this.state[requestMethod];

    if (Boolean(responsesForMethod)) {
      return this.state[requestMethod].find(mockedResponse => {
        const isPathMatch = this._isPathMatch(mockedResponse, path);
        const isConditionalHeadersMatch = this._isConditionalHeadersMatch(mockedResponse, requestHeaders);
        const isConditionalBodyMatch = this._isConditionalBodyMatch(mockedResponse, requestBody);

        return isPathMatch && isConditionalHeadersMatch && isConditionalBodyMatch;
      }) || false;
    }

    return false;
  }

  removeAll() {
    this.state = {};
  }

  _isPathMatch(mockedResponse, pathToMatch) {
    const { path } = mockedResponse;
    if (typeof path === 'object') {
      const pathRegExp = new RegExp(path);
      return Boolean(pathToMatch.match(pathRegExp));
    }
    return pathToMatch === path;
  }

  _isConditionalHeadersMatch(mockedResponse, requestHeaders) {
    const { conditionalHeaders = {} } = mockedResponse;
    return Object.keys(conditionalHeaders).reduce((hasMatched, conditionalHeaderName) => {
      if (hasMatched) {
        const lowerCaseConditionalHeaderName = conditionalHeaderName.toLowerCase();
        const lowerCaseRequestHeaders = this._lowerCaseRequestHeaders(requestHeaders);
        const matchedHeader = lowerCaseRequestHeaders[lowerCaseConditionalHeaderName];

        return matchedHeader === conditionalHeaders[conditionalHeaderName];
      }

      return hasMatched;
    }, true);
  }

  _lowerCaseRequestHeaders(requestHeaders) {
    const lowerCaseRequestHeaders = {};
    Object.keys(requestHeaders).forEach(headerName => {
      lowerCaseRequestHeaders[headerName.toLowerCase()] = requestHeaders[headerName];
    });
    return lowerCaseRequestHeaders;
  }

  _isConditionalBodyMatch(mockedResponse, requestBody) {
    const { conditionalBody } = mockedResponse;
    if (conditionalBody) {
      return deepEqual(conditionalBody, requestBody);
    }
    return true;
  }

  _removeInstance() {
    instance = null;
  }
}

export const addMock = responseToMock => {
  new ResponseStore().add(responseToMock);
};
