export default class RequestStore {
  constructor(initialState = {}) {
    this.state = initialState;
  }

  getState() {
    return this.state;
  }

  add(request) {
    const requestMethod = request.method.toUpperCase();
    this.state = {
      ...this.state,
      [requestMethod]: [
        ...(this.state[requestMethod] || []),
        request
      ]
    }
  }

  removeAll() {
    this.state = {};
  }
}
