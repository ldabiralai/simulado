import axios from 'axios';
import {
  setRemoteServer,
  addMock,
  addMocks,
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
    setRemoteServer('http://localhost:7001')
  })

  describe.only('setRemoteServer()', () => {
    it('should update server correctly', sinon.test(function() {
      const testRemoteServer = 'http://test'
      setRemoteServer(testRemoteServer)

      const responseToMock = {
        path: '/testPath',
        isRegexPath: false,
      };

      this.mock(axios)
        .expects('post')
        .once()
        .withExactArgs(`${testRemoteServer}/simulado/response`, responseToMock, {
          headers: expectedHeaders
        })
        .returns(Promise.resolve());

      return addMock(responseToMock).then(result => {
        expect(result).to.equal(true);
      });
    }))

    it('should strip trailing slash if present', sinon.test(function() {
      const testRemoteServer = 'http://test/'
      const expectedRemoteServer = 'http://test'
      setRemoteServer(testRemoteServer)

      const responseToMock = {
        path: '/testPath',
        isRegexPath: false,
      };

      this.mock(axios)
        .expects('post')
        .once()
        .withExactArgs(`${expectedRemoteServer}/simulado/response`, responseToMock, {
          headers: expectedHeaders
        })
        .returns(Promise.resolve());

      return addMock(responseToMock).then(result => {
        expect(result).to.equal(true);
      });
    }))
  })

  describe('addMock()', () => {
    it(
      'make a request to add a mock to the store',
      sinon.test(function() {
        const responseToMock = {
          method: 'GET',
          path: '/testPath',
          status: 200,
          isRegexPath: false,
          body: { some: 'data' }
        };

        this.mock(axios)
          .expects('post')
          .once()
          .withExactArgs('http://localhost:7001/simulado/response', responseToMock, {
            headers: expectedHeaders
          })
          .returns(Promise.resolve());

        return addMock(responseToMock).then(result => {
          expect(result).to.equal(true);
        });
      })
    );
  });

  describe('addMocks()', () => {
    it(
      'makes multiple requests to add each mock',
      sinon.test(function() {
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

        this.mock(axios)
          .expects('post')
          .twice()
          .returns(Promise.resolve());

        return addMocks(responsesToMock).then(result => {
          expect(result).to.deep.equal([true, true]);
        });
      })
    );
  });

  describe('lastRequests()', () => {
    it(
      'fetches the last requests for a METHOD and PATH',
      sinon.test(function() {
        const method = 'GET';
        const path = '/test/path';

        const expectedLastRequests = 'LAST_REQUESTS';
        this.mock(axios)
          .expects('get')
          .once()
          .withExactArgs(`http://localhost:7001/simulado/requests?method=${method}&path=${path}`, {
            headers: expectedHeaders
          })
          .returns(Promise.resolve({ data: expectedLastRequests }));

        return lastRequests(method, path).then(result => {
          expect(result).to.equal(expectedLastRequests);
        });
      })
    );

    it(
      'fetches the last requests with a limit if provided',
      sinon.test(function() {
        const method = 'GET';
        const path = '/test/path';
        const limit = 3;

        const expectedLastRequests = 'LIMITED_LAST_REQUESTS';
        this.mock(axios)
          .expects('get')
          .once()
          .withExactArgs(
            `http://localhost:7001/simulado/requests?method=${method}&path=${path}&limit=${limit}`,
            {
              headers: expectedHeaders
            }
          )
          .returns(Promise.resolve({ data: expectedLastRequests }));

        return lastRequests(method, path, limit).then(result => {
          expect(result).to.equal(expectedLastRequests);
        });
      })
    );
  });

  describe('lastRequest()', () => {
    it(
      'fetches the last request for a METHOD and PATH',
      sinon.test(function() {
        const method = 'GET';
        const path = '/test/path';

        const expectedLastRequest = 'LAST_REQUEST';
        this.mock(axios)
          .expects('get')
          .once()
          .withExactArgs(
            `http://localhost:7001/simulado/requests?method=${method}&path=${path}&limit=1`,
            {
              headers: expectedHeaders
            }
          )
          .returns(Promise.resolve({ data: [expectedLastRequest] }));

        return lastRequest(method, path).then(result => {
          expect(result).to.equal(expectedLastRequest);
        });
      })
    );
  });

  describe('clearResponse()', () => {
    it(
      'makes a request to remove single response from the store',
      sinon.test(function() {
        this.mock(axios)
          .expects('delete')
          .withExactArgs('http://localhost:7001/simulado/response?method=GET&path=/testing')
          .returns(Promise.resolve());

        return clearResponse('GET', '/testing').then(result => {
          expect(result).to.equal(true);
        });
      })
    );
  });
  describe('clearResponses()', () => {
    it(
      'makes a request to remove all mocked responses from the store',
      sinon.test(function() {
        this.mock(axios)
          .expects('delete')
          .withExactArgs('http://localhost:7001/simulado/responses')
          .returns(Promise.resolve());

        return clearResponses().then(result => {
          expect(result).to.equal(true);
        });
      })
    );
  });

  describe('clearRequest()', () => {
    it(
      'makes a request to remove single request from the store',
      sinon.test(function() {
        this.mock(axios)
          .expects('delete')
          .withExactArgs('http://localhost:7001/simulado/request?method=GET&path=/testing')
          .returns(Promise.resolve());

        return clearRequest('GET', '/testing').then(result => {
          expect(result).to.equal(true);
        });
      })
    );
  });

  describe('clearRequests()', () => {
    it(
      'makes a request to remove all requests from the store',
      sinon.test(function() {
        this.mock(axios)
          .expects('delete')
          .withExactArgs('http://localhost:7001/simulado/requests')
          .returns(Promise.resolve());

        return clearRequests().then(result => {
          expect(result).to.equal(true);
        });
      })
    );
  });
});
