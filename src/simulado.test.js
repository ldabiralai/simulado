import axios from 'axios';
import {
  setRemoteServer,
  isRunning,
  addMock,
  addMocks,
  setMock,
  setMocks,
  lastRequests,
  lastRequest,
  clearResponse,
  clearResponses,
  clearRequest,
  clearRequests
} from './simulado';

describe('src/simulado', () => {
  const expectedHeaders = { 'Content-Type': 'application/json' };

  beforeEach(() => {
    setRemoteServer('http://localhost:7001');
    sinon.stub(axios, 'post').returns(Promise.resolve({ data: {} }));
    sinon.stub(axios, 'get').returns(Promise.resolve({ data: {} }));
    sinon.stub(axios, 'delete').returns(Promise.resolve());
    sinon.stub(console, 'warn');
  });

  afterEach(() => {
    axios.post.restore();
    axios.get.restore();
    axios.delete.restore();
    console.warn.restore();
  });

  describe('setRemoteServer()', () => {
    it('should update server correctly', async () => {
      const testRemoteServer = 'http://test';
      setRemoteServer(testRemoteServer);

      const responseToMock = {
        path: '/testPath',
        isRegexPath: false
      };

      await setMock(responseToMock);

      expect(axios.post).to.have.been.calledWithExactly(
        `${testRemoteServer}/simulado/response`,
        responseToMock,
        {
          headers: expectedHeaders
        }
      );
    });

    it('should strip trailing slash if present', async () => {
      const testRemoteServer = 'http://test/';
      const expectedRemoteServer = 'http://test';
      setRemoteServer(testRemoteServer);

      const responseToMock = {
        path: '/testPath',
        isRegexPath: false
      };

      await setMock(responseToMock);

      expect(axios.post).to.have.been.calledWithExactly(
        `${expectedRemoteServer}/simulado/response`,
        responseToMock,
        {
          headers: expectedHeaders
        }
      );
    });
  });

  describe('isRunning()', () => {
    it('should return true if axios resolves correctly', async () => {
      const result = await isRunning();

      expect(result).to.be.true;
    });

    it('should return false if axios throws', async () => {
      axios.get.restore();
      sinon.stub(axios, 'get').returns(Promise.reject());

      const result = await isRunning();
      expect(result).to.be.false;
    });
  });

  describe('addMock()', () => {
    it('should output a deprecation warning to the console', async () => {
      await addMock({
        path: '/test'
      });

      expect(console.warn).to.have.been.calledWithExactly(
        'Please use setMock as addMock is deprecated and will be removed in v4'
      );
    });

    it('should call setMock', async () => {
      const responseToMock = {
        path: '/test',
        isRegexPath: false
      };

      await addMock(responseToMock);

      expect(axios.post).to.have.been.calledWithExactly(
        'http://localhost:7001/simulado/response',
        responseToMock,
        {
          headers: expectedHeaders
        }
      );
    });
  });

  describe('setMock()', () => {
    it('make a request to add a mock to the store', async () => {
      const responseToMock = {
        method: 'GET',
        path: '/testPath',
        status: 200,
        isRegexPath: false,
        body: { some: 'data' }
      };

      await setMock(responseToMock);

      expect(axios.post).to.have.been.calledWithExactly(
        'http://localhost:7001/simulado/response',
        responseToMock,
        {
          headers: expectedHeaders
        }
      );
    });
  });

  describe('addMocks()', () => {
    it('should output a deprecation warning to the console', async () => {
      await addMocks([{ path: '/testPath' }]);

      expect(console.warn).to.have.been.calledWithExactly(
        'Please use setMocks as addMocks is deprecated and will be removed in v4'
      );
    });

    it('should call setMocks', async () => {
      const responsesToMock = [
        {
          method: 'GET',
          path: '/testPath'
        },
        {
          method: 'GET',
          path: '/testPath'
        }
      ];

      await addMocks(responsesToMock);

      expect(axios.post.getCall(0).args[1]).to.deep.equal({
        ...responsesToMock[0],
        isRegexPath: false
      });
      expect(axios.post.getCall(1).args[1]).to.deep.equal({
        ...responsesToMock[1],
        isRegexPath: false
      });
    });
  });

  describe('setMocks()', () => {
    it('makes multiple requests to add each mock', async () => {
      const responsesToMock = [
        {
          method: 'GET',
          path: '/testPath'
        },
        {
          method: 'GET',
          path: '/testPath'
        }
      ];

      await setMocks(responsesToMock);

      expect(axios.post.getCall(0).args[1]).to.deep.equal({
        ...responsesToMock[0],
        isRegexPath: false
      });
      expect(axios.post.getCall(1).args[1]).to.deep.equal({
        ...responsesToMock[1],
        isRegexPath: false
      });
    });
  });

  describe('lastRequests()', () => {
    it('fetches the last requests for a METHOD and PATH', async () => {
      const method = 'GET';
      const path = '/test/path';

      await lastRequests(method, path);

      expect(axios.get).to.have.been.calledWithExactly(
        `http://localhost:7001/simulado/requests?method=${method}&path=${path}`,
        {
          headers: expectedHeaders
        }
      );
    });

    it('fetches the last requests with a limit if provided', async () => {
      const method = 'GET';
      const path = '/test/path';
      const limit = 3;

      await lastRequests(method, path, limit);

      expect(axios.get).to.have.been.calledWithExactly(
        `http://localhost:7001/simulado/requests?method=${method}&path=${path}&limit=${limit}`,
        {
          headers: expectedHeaders
        }
      );
    });

    it('handles regex paths', async () => {
      const method = 'GET';
      const path = /\/actions\/.*/;

      await lastRequests(method, path);

      expect(axios.get).to.have.been.calledWithExactly(
        `http://localhost:7001/simulado/requests?method=${method}&path=${path.toString()}&isRegexPath=true`,
        {
          headers: expectedHeaders
        }
      );
    });
  });

  describe('lastRequest()', () => {
    it('fetches the last request for a METHOD and PATH', async () => {
      const method = 'GET';
      const path = '/test/path';

      await lastRequest(method, path);

      expect(axios.get).to.have.been.calledWithExactly(
        `http://localhost:7001/simulado/requests?method=${method}&path=${path}&limit=1`,
        {
          headers: expectedHeaders
        }
      );
    });
  });

  describe('clearResponse()', () => {
    it('makes a request to remove single response from the store', async () => {
      const method = 'DELETE';
      const path = '/testing';

      await clearResponse(method, path);

      expect(axios.delete).to.have.been.calledWithExactly(
        `http://localhost:7001/simulado/response?method=${method}&path=${path}`
      );
    });
  });
  describe('clearResponses()', () => {
    it('makes a request to remove all mocked responses from the store', async () => {
      await clearResponses();

      expect(axios.delete).to.have.been.calledWithExactly(
        `http://localhost:7001/simulado/responses`
      );
    });
  });

  describe('clearRequest()', () => {
    it('makes a request to remove single request from the store', async () => {
      const method = 'DELETE';
      const path = '/testing';

      await clearRequest(method, path);

      expect(axios.delete).to.have.been.calledWithExactly(
        `http://localhost:7001/simulado/request?method=${method}&path=${path}`
      );
    });
  });

  describe('clearRequests()', () => {
    it('makes a request to remove all requests from the store', async () => {
      await clearRequests();

      expect(axios.delete).to.have.been.calledWithExactly(
        `http://localhost:7001/simulado/requests`
      );
    });
  });
});
