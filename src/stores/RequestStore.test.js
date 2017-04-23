import RequestStore from './RequestStore';

const setup = ({ initialState = {} } = {}) => {
  const requestStoreInstance = new RequestStore(initialState);
  return { requestStoreInstance };
};

describe('src/stores/request', () => {
  describe('constructor', () => {
    it('sets initial state as an empty store by default', () => {
      const { requestStoreInstance } = setup();
      expect(requestStoreInstance.state).to.deep.equal({});
    });

    it('sets initial state as passed value', () => {
      const initialState = 'SomeInitialState';
      const { requestStoreInstance } = setup({ initialState });
      expect(requestStoreInstance.state).to.deep.equal(initialState);
    });
  });

  describe('getState()', () => {
    it('returns the current store', () => {
      const initialState = { data: 'DummyState' };
      const { requestStoreInstance } = setup({ initialState });
      expect(requestStoreInstance.getState()).to.deep.equal(initialState);
    });
  });

  describe('add()', () => {
    it('adds a request to the store under the specified method', () => {
      const { requestStoreInstance } = setup();
      const requestToMock = {
        method: 'get',
        path: '/testPath'
      };

      requestStoreInstance.add(requestToMock);
      expect(requestStoreInstance.state).to.deep.equal({
        GET: [requestToMock]
      });
    });

    it('adds a request to the store under the specified method with any options passed to it', () => {
      const { requestStoreInstance } = setup();
      const requestToMock = {
        method: 'get',
        path: '/testPath',
        anotherKey: 'Data'
      };

      requestStoreInstance.add(requestToMock);
      expect(requestStoreInstance.state).to.deep.equal({
        GET: [requestToMock]
      });
    });

    it('adds a request to the store under a specific method and keeps existing store requests for that method', () => {
      const previouslyMockedrequest = { method: 'get', path: '/previouslyMockedPath' };
      const initialState = { GET: [previouslyMockedrequest] }
      const { requestStoreInstance } = setup({ initialState });

      const requestToMock = {
        method: 'get',
        path: '/testPath'
      };

      requestStoreInstance.add(requestToMock);
      expect(requestStoreInstance.state).to.deep.equal({
        GET: [
          previouslyMockedrequest,
          requestToMock
        ]
      });
    });

    it('adds a request to the store under a specific method and keeps existing store requests for a different method', () => {
      const previouslyMockedrequest = { method: 'post', path: '/previouslyMockedPath' };
      const initialState = { POST: [previouslyMockedrequest] }
      const { requestStoreInstance } = setup({ initialState });

      const requestToMock = {
        method: 'get',
        path: '/testPath'
      };

      requestStoreInstance.add(requestToMock);
      expect(requestStoreInstance.state).to.deep.equal({
        POST: [previouslyMockedrequest],
        GET: [requestToMock]
      });
    });
  });

  describe('removeAll()', () => {
    it('removes all requests from the store', () => {
      const mockedrequest = { method: 'post', path: '/previouslyMockedPath' };
      const initialState = { POST: [mockedrequest] }
      const { requestStoreInstance } = setup({ initialState });

      requestStoreInstance.removeAll();

      expect(requestStoreInstance.state).to.deep.equal({});
    });
  });
});
