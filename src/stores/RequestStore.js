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
      if (path instanceof RegExp) {
        return path.test(request.path);
      }
      return path === request.path;
    });

    return matchedRequests.slice(0, limit);
  }

  add(request) {
    const requestMethod = request.method.toUpperCase();
    this.state = Object.assign({}, this.state, {
      [requestMethod]: (this.state[requestMethod] || []).concat(request)
    });
  }

  remove(method, path) {
    this.state = Object.assign({}, this.state, {
      [method]: (this.state[method] || []).filter(request => request.path !== path)
    });
  }

  removeAll() {
    this.state = {};
  }
}

module.exports = RequestStore;
