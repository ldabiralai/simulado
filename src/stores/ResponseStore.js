const deepEqual = require('deep-equal');
const merge = require('lodash.merge');
let instance;

class ResponseStore {
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
    const defaults = {
      method: 'GET',
      status: 200
    };
    const mergedMock = merge({}, defaults, responseToMock);
    const responseMethod = mergedMock.method.toUpperCase();

    this.state = Object.assign({}, this.state, {
      [responseMethod]: (this.state[responseMethod] || []).concat(mergedMock)
    });
  }

  remove(method, path) {
    const responseToRemoveMethod = method.toUpperCase();
    this.state = Object.assign({}, this.state, {
      [responseToRemoveMethod]: this.state[responseToRemoveMethod].filter(
        response => response.path !== path
      )
    });
  }

  match(method, path, requestHeaders = {}, requestBody) {
    const requestMethod = method.toUpperCase();
    const responsesForMethod = this.state[requestMethod];

    if (Boolean(responsesForMethod)) {
      const matchedResponses =
        this.state[requestMethod].filter(mockedResponse => {
          const isPathMatch = this._isPathMatch(mockedResponse, path);
          const isConditionalHeadersMatch = this._isConditionalHeadersMatch(
            mockedResponse,
            requestHeaders
          );
          const isConditionalBodyMatch = this._isConditionalBodyMatch(
            mockedResponse,
            requestBody
          );

          return (
            isPathMatch && isConditionalHeadersMatch && isConditionalBodyMatch
          );
        }) || [];

      return matchedResponses[matchedResponses.length - 1] || false;
    }

    return false;
  }

  removeAll() {
    this.state = {};
  }

  _isPathMatch(mockedResponse, pathToMatch) {
    const { path, isRegexPath } = mockedResponse;

    if (typeof path === 'object' || isRegexPath) {
      const pathRegex = typeof path === 'object' ? path : path.slice(1, -1);
      const pathRegExp = new RegExp(pathRegex);
      return pathRegExp.test(pathToMatch);
    }

    return pathToMatch === path;
  }

  _isConditionalHeadersMatch(mockedResponse, requestHeaders) {
    const { conditionalHeaders = {} } = mockedResponse;
    return Object.keys(
      conditionalHeaders
    ).reduce((hasMatched, conditionalHeaderName) => {
      if (hasMatched) {
        const lowerCaseConditionalHeaderName = conditionalHeaderName.toLowerCase();
        const lowerCaseRequestHeaders = this._lowerCaseRequestHeaders(
          requestHeaders
        );
        const matchedHeader =
          lowerCaseRequestHeaders[lowerCaseConditionalHeaderName];

        return matchedHeader === conditionalHeaders[conditionalHeaderName];
      }

      return hasMatched;
    }, true);
  }

  _lowerCaseRequestHeaders(requestHeaders) {
    const lowerCaseRequestHeaders = {};
    Object.keys(requestHeaders).forEach(headerName => {
      lowerCaseRequestHeaders[headerName.toLowerCase()] =
        requestHeaders[headerName];
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

module.exports = ResponseStore;
