class RequestStore {
  constructor(initialState = {}) {
    this.state = initialState;
  }

  getState() {
    return this.state;
  }

  get(method, path, limit) {
    const allRequests = this.getState();
    const requestsForMethod = allRequests[method.toUpperCase()] || [];

    const matchedRequests = requestsForMethod.filter(request => {
      return request.path === path;
    });

    if (limit) {
      return matchedRequests.slice(0, limit);
    }

    return matchedRequests;
  }

  add(request) {
    const requestMethod = request.method.toUpperCase();
    this.state = Object.assign({}, this.state, {
      [requestMethod]: (this.state[requestMethod] || []).concat(request)
    });
  }

  removeAll() {
    this.state = {};
  }
}

module.exports = RequestStore;
