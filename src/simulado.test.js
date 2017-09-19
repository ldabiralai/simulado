import axios from 'axios';
import {
  addMock,
  lastRequests,
  lastRequest,
  clearResponses,
  clearRequests
} from './simulado';

describe('src/simulado', () => {
  const expectedHeaders = { 'Content-Type': 'application/json' }

  describe('addMock()', () => {
    it('make a request to add a mock to the store', sinon.test(function () {
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
        .withExactArgs(
          'http://localhost:7001/simulado/response/set',
          responseToMock,
          { headers: expectedHeaders }
        )
        .returns(Promise.resolve());

      return addMock(responseToMock).then(result => {
        expect(result).to.equal(true);
      });
    }));
  });

  describe('lastRequests()', () => {
    it('fetches the last requests for a METHOD and PATH', sinon.test(function () {
      const method = 'GET';
      const path = '/test/path';

      const expectedLastRequests = 'LAST_REQUESTS';
      this.mock(axios)
        .expects('get')
        .once()
        .withExactArgs(
          `http://localhost:7001/simulado/requests?method=${method}&path=${path}`,
          { headers: expectedHeaders }
        )
        .returns(Promise.resolve({ data: expectedLastRequests }));

      return lastRequests(method, path).then(result => {
        expect(result).to.equal(expectedLastRequests);
      });
    }));

    it('fetches the last requests with a limit if provided', sinon.test(function () {
      const method = 'GET';
      const path = '/test/path';
      const limit = 3;

      const expectedLastRequests = 'LIMITED_LAST_REQUESTS';
      this.mock(axios)
        .expects('get')
        .once()
        .withExactArgs(
          `http://localhost:7001/simulado/requests?method=${method}&path=${path}&limit=${limit}`,
          { headers: expectedHeaders }
        )
        .returns(Promise.resolve({ data: expectedLastRequests }));

      return lastRequests(method, path, limit).then(result => {
        expect(result).to.equal(expectedLastRequests);
      });
    }));
  });

  describe('lastRequest()', () => {
    it('fetches the last request for a METHOD and PATH', sinon.test(function () {
      const method = 'GET';
      const path = '/test/path';

      const expectedLastRequest = 'LAST_REQUEST';
      this.mock(axios)
        .expects('get')
        .once()
        .withExactArgs(
          `http://localhost:7001/simulado/requests?method=${method}&path=${path}&limit=1`,
          { headers: expectedHeaders }
        )
        .returns(Promise.resolve({ data: [expectedLastRequest] }));

      return lastRequest(method, path).then(result => {
        expect(result).to.equal(expectedLastRequest);
      });
    }));
  });

  describe('clearResponses()', () => {
    it('makes a request to remove all mocked responses from the store', sinon.test(function () {
      this.mock(axios)
        .expects('delete')
        .withExactArgs('http://localhost:7001/simulado/responses/clear')
        .returns(Promise.resolve());

      return clearResponses().then(result => {
        expect(result).to.equal(true);
      });
    }));
  });

  describe('clearRequests()', () => {
    it('makes a request to remove all requests from the store', sinon.test(function () {
      this.mock(axios)
        .expects('delete')
        .withExactArgs('http://localhost:7001/simulado/requests/clear')
        .returns(Promise.resolve());

      return clearRequests().then(result => {
        expect(result).to.equal(true);
      });
    }));
  });
});
