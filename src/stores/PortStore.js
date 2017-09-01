let instance;

export default class PortStore {
  constructor(portNumber = 7001) {
    if (!instance) {
      this.state = { port: portNumber };
      instance = this;
    }

    return instance;
  }

  getState() {
    return this.state;
  }

  _removeInstance() {
    instance = null;
  }
}

