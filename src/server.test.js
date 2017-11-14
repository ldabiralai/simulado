import request from 'supertest';
import portscanner from 'portscanner';
import sinon from 'sinon';
import PortStore from './stores/PortStore';
import ResponseStore from './stores/ResponseStore';
import RequestStore from './stores/RequestStore';
import { start, stop } from './server';

const portInUse = port => {
  return new Promise((resolve, reject) => {
    portscanner.checkPortStatus(port, '127.0.0.1', (error, status) => {
      if (error) {
        reject(error);
      }

      const inUse = status == 'open';
      resolve(inUse);
    });
  });
};

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
      server = start();
      expect(await portInUse(defaultPortNumber)).to.be.true;
    });

    it('starts on a custom port number', async () => {
      const customPortNumber = 1234;
      server = start({ port: customPortNumber });

      expect(await portInUse(customPortNumber)).to.be.true;
    });

    describe('using https', () => {
      before(() => {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      });

      it('files passed correctly', done => {
        server = start({
          https: {
            key: '../certs/localhost.key',
            cert: '../certs/localhost.crt'
          }
        });

        request(`https://localhost:${defaultPortNumber}`)
          .get('/')
          .expect(200, err => {
            done(err);
          });
      });

      it('no key path', () => {
        const consoleStub = sinon.stub(console, 'error');

        server = start({
          https: {
            cert: '../certs/localhost.crt'
          }
        });

        consoleStub.restore();
        expect(consoleStub).to.have.been.calledWith(
          '* ERR: cert option present, but key was not provided'
        );
      });

      it('no cert path', () => {
        const consoleStub = sinon.stub(console, 'error');

        server = start({
          https: {
            key: '../certs/localhost.key'
          }
        });

        consoleStub.restore();
        expect(consoleStub).to.have.been.calledWith(
          '* ERR: key option present, but cert was not provided'
        );
      });
    });
  });

  it('stop', async () => {
    start();
    stop();

    expect(await portInUse(7001)).to.be.false;
  });

  describe('endpoints', () => {
    let server;
    let addResponseStub;
    let matchResponseStub;
    let removeResponseStub;
    let removeAllResponseStub;
    let addRequestStub;
    let removeRequestStub;
    let removeAllRequestStub;
    let getRequestStub;

    beforeEach(() => {
      addResponseStub = sinon.stub(ResponseStore.prototype, 'add');
      matchResponseStub = sinon.stub(ResponseStore.prototype, 'match');
      removeResponseStub = sinon.stub(ResponseStore.prototype, 'remove');
      removeAllResponseStub = sinon.stub(ResponseStore.prototype, 'removeAll');
      addRequestStub = sinon.stub(RequestStore.prototype, 'add');
      removeRequestStub = sinon.stub(RequestStore.prototype, 'remove');
      removeAllRequestStub = sinon.stub(RequestStore.prototype, 'removeAll');
      getRequestStub = sinon.stub(RequestStore.prototype, 'get');
      server = start();
    });

    afterEach(() => {
      addResponseStub.restore();
      matchResponseStub.restore();
      removeResponseStub.restore();
      removeAllResponseStub.restore();
      addRequestStub.restore();
      removeRequestStub.restore();
      removeAllRequestStub.restore();
      getRequestStub.restore();
      server.close();
    });

    describe('/', () => {
      it('returns index.html from the root path', done => {
        request(server)
          .get('/')
          .expect(200, done);
      });
    });

    describe('/*', () => {
      it('returns 404 Not Found if no matching mock is found', done => {
        matchResponseStub.returns(false);
        request(server)
          .get('/pathThatIsntMocked')
          .expect(404, done);
      });

      it('returns response mock status and body when matching mock is found', done => {
        const mockedResponse = {
          path: '/testPath',
          method: 'get',
          status: 200,
          body: { data: 'MockedResponseBody' }
        };

        matchResponseStub.returns(mockedResponse);

        request(server)
          .get(mockedResponse.path)
          .expect(res => {
            expect(res.body).to.deep.equal(mockedResponse.body);
            expect(matchResponseStub).to.have.been.called;
            expect(addRequestStub).to.have.been.called;
          })
          .expect(200, done);
      });

      it('sets the matched mock headers', done => {
        const mockedResponse = {
          path: '/testPath',
          method: 'get',
          status: 200,
          headers: {
            'x-custom-header': 'Value'
          }
        };

        matchResponseStub.returns(mockedResponse);

        request(server)
          .get(mockedResponse.path)
          .expect(res => {
            console.log(res.headers);
            expect(res.headers['x-custom-header']).to.equal('Value');
          })
          .expect(200, done);
      });

      it('sets the Access-Control-Allow-Origin to the request origin header if present', done => {
        const mockedResponse = {
          path: '/testPath',
          method: 'get',
          status: 200
        };

        matchResponseStub.returns(mockedResponse);

        const origin = 'http://origin.com';
        request(server)
          .get(mockedResponse.path)
          .set('origin', origin)
          .expect(res => {
            expect(res.headers['access-control-allow-origin']).to.equal(origin);
          })
          .expect(200, done);
      });

      it('sets the Access-Control-Allow-Origin to * if request origin header is not present', done => {
        const mockedResponse = {
          path: '/testPath',
          method: 'get',
          status: 200
        };

        matchResponseStub.returns(mockedResponse);

        request(server)
          .get(mockedResponse.path)
          .expect(res => {
            expect(res.headers['access-control-allow-origin']).to.equal('*');
          })
          .expect(200, done);
      });

      it('sets the Access-Control-Allow-Credentials to true', done => {
        const mockedResponse = {
          path: '/testPath',
          method: 'get',
          status: 200
        };

        matchResponseStub.returns(mockedResponse);

        request(server)
          .get(mockedResponse.path)
          .expect(res => {
            expect(res.headers['access-control-allow-credentials']).to.equal('true');
          })
          .expect(200, done);
      });
    });

    describe('POST /simulado/response', () => {
      it('sets the mock in the response store', done => {
        const mockResponse = {
          method: 'GET',
          path: '/testPath',
          status: 204
        };

        request(server)
          .post('/simulado/response')
          .set('Content-Type', 'application/json')
          .send(mockResponse)
          .expect(() => {
            expect(addResponseStub).to.have.been.calledWith(mockResponse);
          })
          .expect(201, done);
      });
    });

    describe('GET /simulado/requests', () => {
      it('returns all of the requests from the request store', done => {
        const allRequests = [{ path: '/one' }, { path: '/two' }];
        getRequestStub.returns(allRequests);

        request(server)
          .get('/simulado/requests')
          .expect(res => {
            expect(getRequestStub).to.have.been.called;
            expect(res.body).to.deep.equal(allRequests);
          })
          .expect(200, done);
      });
    });

    describe('DELETE /simulado/request', () => {
      it('clears all the requests from the request store', done => {
        request(server)
          .del('/simulado/request')
          .expect(() => {
            expect(removeRequestStub).to.have.been.called;
          })
          .expect(201, done);
      });
    });

    describe('DELETE /simulado/requests', () => {
      it('clears all the requests from the request store', done => {
        request(server)
          .del('/simulado/requests')
          .expect(() => {
            expect(removeAllRequestStub).to.have.been.called;
          })
          .expect(201, done);
      });
    });

    describe('DELETE /simulado/response', () => {
      it('clears the matching response from the response store', done => {
        request(server)
          .del('/simulado/response?method=GET&path=/testing')
          .expect(() => {
            expect(removeResponseStub).to.have.been.calledWith('GET', '/testing');
          })
          .expect(201, done);
      });
    });

    describe('DELETE /simulado/responses', () => {
      it('clears all the responses from the response store', done => {
        request(server)
          .del('/simulado/responses')
          .expect(() => {
            expect(removeAllResponseStub).to.have.been.called;
          })
          .expect(201, done);
      });
    });
  });
});
