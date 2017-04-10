import request from 'supertest';
import ResponseStore from './stores/ResponseStore';
import RequestStore from './stores/RequestStore';
import { start } from './server';

describe('src/server', () => {
  let server;
  let addResponseStub;
  let matchResponseStub;
  let removeAllResponseStub;
  let addRequestStub;
  let removeAllRequestStub;
  let getStateRequestStub;

  beforeEach(() => {
    addResponseStub = sinon.stub(ResponseStore.prototype, 'add');
    matchResponseStub = sinon.stub(ResponseStore.prototype, 'match');
    removeAllResponseStub = sinon.stub(ResponseStore.prototype, 'removeAll');
    addRequestStub = sinon.stub(RequestStore.prototype, 'add');
    removeAllRequestStub = sinon.stub(RequestStore.prototype, 'removeAll');
    getStateRequestStub = sinon.stub(RequestStore.prototype, 'getState');
    server = start();
  });

  afterEach(() => {
    addResponseStub.restore();
    matchResponseStub.restore();
    removeAllResponseStub.restore();
    addRequestStub.restore();
    removeAllRequestStub.restore();
    getStateRequestStub.restore();
    server.close();
  });

  describe('/', () => {
    it('returns index.html from the root path', (done) => {
      request(server)
        .get('/')
        .expect(200, done);
    });
  });

  describe('/*', () => {
    it('returns 404 Not Found if no matching mock is found', (done) => {
      matchResponseStub.returns(false);
      request(server)
        .get('/pathThatIsntMocked')
        .expect(404, done);
    });

    it('returns response mock status and body when matching mock is found', (done) => {
      const mockedResponse = {
        path: '/testPath',
        method: 'get',
        status: 200,
        body: { data: 'MockedResponseBody' }
      };

      matchResponseStub.returns(mockedResponse);

      request(server)
        .get(mockedResponse.path)
        .expect((res) => {
          expect(res.body).to.deep.equal(mockedResponse.body);
          expect(matchResponseStub).to.have.been.called;
          expect(addRequestStub).to.have.been.called;
        })
        .expect(200, done);
    });
  });

  describe('POST /simulado/response/set', () => {
    it('sets the mock in the response store', (done) => {
      const mockResponse = {
        method: 'GET',
        path: '/testPath',
        status: 204
      };

      request(server)
        .post('/simulado/response/set')
        .set('Content-Type', 'application/json')
        .send(mockResponse)
        .expect(() => {
          expect(addResponseStub).to.have.been.calledWith(mockResponse)
        })
        .expect(201, done);
    });
  });

  describe('GET /simulado/requests', () => {
    it('returns all of the requests from the request store', (done) => {
      const allRequests = { GET: ['Requests'] };
      getStateRequestStub.returns(allRequests);

      request(server)
        .get('/simulado/requests')
        .expect((res) => {
          expect(getStateRequestStub).to.have.been.called
          expect(res.body).to.deep.equal(allRequests);
        })
        .expect(200, done);
    });
  });

  describe('DELETE /simulado/requests/clear', () => {
    it('clears all the requests from the request store', (done) => {
      request(server)
        .del('/simulado/requests/clear')
        .expect(() => {
          expect(removeAllRequestStub).to.have.been.called
        })
        .expect(201, done);
    });
  });

  describe('DELETE /simulado/responses/clear', () => {
    it('clears all the responses from the response store', (done) => {
      request(server)
        .del('/simulado/responses/clear')
        .expect(() => {
          expect(removeAllResponseStub).to.have.been.called
        })
        .expect(201, done);
    });
  });
});
