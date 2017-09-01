import PortStore from './PortStore';

describe('src/stores/PortStore', () => {
  describe('PortStore class', () => {
    const setup = (portNumber) => {
      new PortStore()._removeInstance();
      const portStoreInstance = new PortStore(portNumber);
      return { portStoreInstance };
    };

    describe('constructor', () => {
      it('sets initial port as 7001 by default', () => {
        const { portStoreInstance } = setup();
        expect(portStoreInstance.state).to.deep.equal({ port: 7001 });
      });

      it('sets a custom port number', () => {
        const customPortNumber = 1234;
        const { portStoreInstance } = setup(customPortNumber);
        expect(portStoreInstance.state).to.deep.equal({ port: customPortNumber });
      });

      it('is a singleton class', () => {
        const customPortNumber = 1234;
        setup(customPortNumber);
        const anotherPortStoreInstance = new PortStore();
        expect(anotherPortStoreInstance.state).to.deep.equal({ port: customPortNumber });
      });
    });

    describe('getState()', () => {
      it('returns the current store', () => {
        const { portStoreInstance } = setup();
        expect(portStoreInstance.getState()).to.deep.equal({ port: 7001 });
      });
    });
  });
});
