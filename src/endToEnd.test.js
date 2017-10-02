import request from 'supertest';
import portscanner from 'portscanner';

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

describe('Simulado Mock Server', () => {
  let Simulado;
  let server;

  before(() => {
    Simulado = require('./index');
    server = Simulado.start();
  });

  beforeEach(async () => {
    await Simulado.clearResponses();
    await Simulado.clearRequests();
  });

  after(() => {
    Simulado.stop();
  });

  describe('endpoint mocking', () => {
    it("returns a 404 when the endpoint hasn't been mocked", () => {
      return request(server)
        .get('/pathThatIsntMocked')
        .expect(404);
    });

    it('responds to an endpoint with mocked path, method and status', async () => {
      await Simulado.addMock({
        path: '/testing',
        method: 'GET',
        status: 204
      });

      return request(server)
        .get('/testing')
        .expect(204);
    });

    it('responds to an endpoint with a mocked regex path', async () => {
      await Simulado.addMock({
        path: /test.*/,
        method: 'GET',
        status: 204
      });

      return request(server)
        .get('/testing')
        .expect(204);
    });

    it("returns a 404 when the request doesn't match the regex path", async () => {
      await Simulado.addMock({
        path: /test.*/,
        method: 'GET',
        status: 204
      });

      return request(server)
        .get('/notMatching')
        .expect(404);
    });

    it('responds to an endpoint which is mocked with body content', async () => {
      const responseBody = { content: 'Hello' };

      await Simulado.addMock({
        path: /test.*/,
        method: 'GET',
        status: 200,
        body: responseBody
      });

      return await request(server)
        .get('/testing')
        .expect(responseBody);
    });

    it('responds to an endpoint which is mocked with headers', async () => {
      const headerName = 'X-Custom-Header';
      const headerValue = 'CustomHeader';

      await Simulado.addMock({
        path: '/testing',
        method: 'GET',
        status: 200,
        headers: {
          [headerName]: headerValue
        }
      });

      return await request(server)
        .get('/testing')
        .expect(headerName, headerValue);
    });

    it('responds to an endpoint that has conditional headers which the request includes', async () => {
      const headerName = 'X-Mandatory-Header';
      const headerValue = 'CustomHeader';

      await Simulado.addMock({
        path: '/testing',
        method: 'GET',
        status: 204,
        conditionalHeaders: {
          [headerName]: headerValue
        }
      });

      return await request(server)
        .get('/testing')
        .set(headerName, headerValue)
        .expect(204);
    });

    it('does not respond to an endpoint that has conditional headers which the request does not include', async () => {
      await Simulado.addMock({
        path: '/testing',
        method: 'GET',
        status: 204,
        conditionalHeaders: {
          'X-Mandatory-Header': 'need me'
        }
      });

      return await request(server)
        .get('/testing')
        .set('X-Another-Header', 'blah')
        .expect(404);
    });

    it('responds to an endpoint that has a conditional body which the request includes', async () => {
      const mandatoryBody = { data: 'Some data I need' };

      await Simulado.addMock({
        path: '/testing',
        method: 'POST',
        status: 200,
        conditionalBody: mandatoryBody
      });

      return await request(server)
        .post('/testing')
        .set('Content-Type', 'application/json')
        .send(mandatoryBody)
        .expect(200);
    });

    it('does not respond to an endpoint that has a conditional body which the request does not include', async () => {
      await Simulado.addMock({
        path: '/testing',
        method: 'POST',
        status: 200,
        conditionalBody: { data: 'Some data I need' }
      });

      return await request(server)
        .post('/testing')
        .send({ data: 'This is not the data your looking for' })
        .expect(404);
    });

    it('responds to an endpoint with a delay when specified', async () => {
      await Simulado.addMock({
        path: '/testing',
        method: 'GET',
        status: 200,
        delay: 100
      });

      const startTime = new Date();
      await request(server).get('/testing');
      const endTime = new Date();

      const timeTaken = endTime - startTime;
      expect(timeTaken).to.be.above(100);
    });
  });

  describe('setting default mocks', () => {
    it('should setup mocks from an array', async () => {
      const responsesToMock = [
        {
          method: 'GET',
          path: '/testPath1',
          status: 200
        },
        {
          method: 'GET',
          path: '/testPath2',
          status: 200
        }
      ];

      await Simulado.setDefaults(responsesToMock);

      await request(server)
        .get('/testPath1')
        .expect(200);

      return await request(server)
        .get('/testPath2')
        .expect(200);
    });

    it('should clear old mocks before setting defaults', async () => {
      await Simulado.addMock({
        method: 'GET',
        path: '/testPath',
        status: 200
      });

      await request(server)
        .get('/testPath')
        .expect(200);

      await Simulado.setDefaults([
        {
          method: 'GET',
          path: '/newTestPath',
          status: 200
        }
      ]);

      await request(server)
        .get('/testPath')
        .expect(404);

      return await request(server)
        .get('/newTestPath')
        .expect(200);
    });
  });

  describe('get last requests', () => {
    describe('lastRequests()', () => {
      it('returns a list of last requests made for an endpoint', async () => {
        await Simulado.addMock({
          path: '/testing',
          method: 'GET',
          status: 200
        });

        await request(server).get('/testing');
        await request(server).get('/testing');

        const requests = await Simulado.lastRequests('GET', '/testing');
        expect(requests.length).to.equal(2);
      });

      it('returns details of last requests made for an endpoint', async () => {
        await Simulado.addMock({
          path: '/testing',
          method: 'GET',
          status: 200
        });

        await request(server).get('/testing');

        const requests = await Simulado.lastRequests('GET', '/testing');
        expect(requests[0]).to.deep.equal({
          path: '/testing',
          method: 'GET',
          headers: requests[0].headers,
          body: {}
        });
      });

      it('returns a limited list of requests made for an endpoint', async () => {
        await Simulado.addMock({
          path: '/testing',
          method: 'GET',
          status: 200
        });

        await request(server).get('/testing');
        await request(server).get('/testing');

        const requests = await Simulado.lastRequests('GET', '/testing', 1);
        expect(requests.length).to.equal(1);
      });

      it('returns empty list if no requests have been made for an endpoint.', async () => {
        await Simulado.addMock({
          path: '/noRequests',
          method: 'GET',
          status: 200
        });

        const requests = await Simulado.lastRequests('GET', '/noRequests');
        expect(requests).to.deep.equal([]);
      });
    });

    describe('lastRequest()', () => {
      it('returns details of last request made for an endpoint', async () => {
        await Simulado.addMock({
          path: '/testing',
          method: 'GET',
          status: 200
        });

        await request(server).get('/testing');

        const lastRequest = await Simulado.lastRequest('GET', '/testing');
        expect(lastRequest).to.deep.equal({
          path: '/testing',
          method: 'GET',
          headers: lastRequest.headers,
          body: {}
        });
      });

      it('returns undefined if no requests have been made for an endpoint.', async () => {
        await Simulado.addMock({
          path: '/noRequests',
          method: 'GET',
          status: 200
        });

        const lastRequest = await Simulado.lastRequest('GET', '/noRequests');
        expect(lastRequest).to.deep.equal(undefined);
      });
    });
  });

  describe('clearing mocks', () => {
    beforeEach(async () => {
      await Simulado.addMock({
        path: '/pathThatHasBeenCleared',
        method: 'GET',
        status: 200
      });

      await request(server).get('/pathThatHasBeenCleared');
    });

    it('clears all mocked responses', async () => {
      await Simulado.clearResponses();

      return request(server)
        .get('/pathThatHasBeenCleared')
        .expect(404);
    });

    it('clears all requests made to mocked endpoints', async () => {
      await Simulado.clearRequests();

      const requests = await Simulado.lastRequests(
        'GET',
        '/pathThatHasBeenCleared'
      );
      expect(requests.length).to.equal(0);
    });
  });
});
