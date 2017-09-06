import request from 'supertest';
import portscanner from 'portscanner';
import PortStore from './stores/PortStore';
import ResponseStore from './stores/ResponseStore';
import RequestStore from './stores/RequestStore';
import { start, stop } from './server';

const portInUse = (port) => {
  return new Promise((resolve, reject) => {
    portscanner.checkPortStatus(port, '127.0.0.1', (error, status) => {
      if (error) {
        reject(error)
      }

      const inUse = status == 'open'
      resolve(inUse)
    })
  })
}

describe('src/server', () => {
  const defaultPortNumber = 7001;

  describe('start()', () => {
    let server;
    afterEach(() => {
      // Remove port store as it is a singleton and does not clear
      // the port number after each test
      const portStoreInstance = new PortStore();
      portStoreInstance._removeInstance();
      server.close();
    });

    it('starts on the default port', async () => {
      server = start()
      expect(await portInUse(defaultPortNumber)).to.be.true
    })

    it('starts on a custom port number', async () => {
      const customPortNumber = 1234;
      server = start({ port: customPortNumber });

      expect(await portInUse(customPortNumber)).to.be.true
    })

    describe('using https', () => {
      before(() => {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
      });

      it('files passed correctly', (done) => {
        server = start({
          https: {
            key: '../certs/localhost.key',
            cert: '../certs/localhost.crt'
          }
        })

        request(`https://localhost:${defaultPortNumber}`)
          .get('/')
          .expect(200, (err) => {
            done(err)
          })
      })

      it('no key path', () => {
        try {
          start({
            https: {
              cert: '../certs/localhost.crt'
            }
          })
        } catch (e) {
          return
        }

        throw new Error('Should have thrown an error')
      })

      it('no cert path', () => {
        try {
          start({
            https: {
              key: '../certs/localhost.key'
            }
          })
        } catch (e) {
          return
        }

        throw new Error('Should have thrown an error')
      })
    })
  })

  it('stop', async () => {
    start()
    stop()

    expect(await portInUse(9999)).to.be.false
  })

  describe('endpoints', () => {
    let server;
    let addResponseStub;
    let matchResponseStub;
    let removeAllResponseStub;
    let addRequestStub;
    let removeAllRequestStub;
    let getRequestStub;

    beforeEach(() => {
      addResponseStub = sinon.stub(ResponseStore.prototype, 'add');
      matchResponseStub = sinon.stub(ResponseStore.prototype, 'match');
      removeAllResponseStub = sinon.stub(ResponseStore.prototype, 'removeAll');
      addRequestStub = sinon.stub(RequestStore.prototype, 'add');
      removeAllRequestStub = sinon.stub(RequestStore.prototype, 'removeAll');
      getRequestStub = sinon.stub(RequestStore.prototype, 'get');
      server = start();
    });

    afterEach(() => {
      addResponseStub.restore();
      matchResponseStub.restore();
      removeAllResponseStub.restore();
      addRequestStub.restore();
      removeAllRequestStub.restore();
      getRequestStub.restore();
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
        const allRequests = [{ path: '/one' }, { path: '/two' }];
        getRequestStub.returns(allRequests);

        request(server)
          .get('/simulado/requests')
          .expect((res) => {
            expect(getRequestStub).to.have.been.called
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
});
