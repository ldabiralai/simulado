import ResponseStore from './ResponseStore';

describe('src/stores/response', () => {
  describe('ResponseStore class', () => {
    const setup = ({ initialState = {} } = {}) => {
      new ResponseStore()._removeInstance();
      const responseStoreInstance = new ResponseStore(initialState);
      return { responseStoreInstance };
    };

    describe('constructor', () => {
      it('sets initial state as an empty store by default', () => {
        const { responseStoreInstance } = setup();
        expect(responseStoreInstance.state).to.deep.equal({});
      });

      it('sets initial state as passed value', () => {
        const initialState = 'SomeInitialState';
        const { responseStoreInstance } = setup({ initialState });
        expect(responseStoreInstance.state).to.deep.equal(initialState);
      });

      it('is a singleton class', () => {
        const initialState = 'SOME STATE I WANT TO PERSIST';
        setup({ initialState });
        const anotherResponseStoreInstance = new ResponseStore();
        expect(anotherResponseStoreInstance.state).to.equal(initialState);
      });
    });

    describe('getState()', () => {
      it('returns the current store', () => {
        const initialState = { data: 'DummyState' };
        const { responseStoreInstance } = setup({ initialState });
        expect(responseStoreInstance.getState()).to.deep.equal(initialState);
      });
    });

    describe('add()', () => {
      it('adds a response to the store under the specified method', () => {
        const { responseStoreInstance } = setup();
        const responseToMock = {
          method: 'get',
          path: '/testPath',
          status: 200
        };

        responseStoreInstance.add(responseToMock);
        expect(responseStoreInstance.state).to.deep.equal({
          GET: [responseToMock]
        });
      });

      it('adds a response to the store under the specified method with any options passed to it', () => {
        const { responseStoreInstance } = setup();
        const responseToMock = {
          method: 'get',
          path: '/testPath',
          anotherKey: 'Data',
          status: 200
        };

        responseStoreInstance.add(responseToMock);
        expect(responseStoreInstance.state).to.deep.equal({
          GET: [responseToMock]
        });
      });

      it('adds a response to the store under a specific method and keeps existing store responses for that method', () => {
        const previouslyMockedResponse = { method: 'get', path: '/previouslyMockedPath' };
        const initialState = { GET: [previouslyMockedResponse] }
        const { responseStoreInstance } = setup({ initialState });

        const responseToMock = {
          method: 'get',
          path: '/testPath',
          status: 200
        };

        responseStoreInstance.add(responseToMock);
        expect(responseStoreInstance.state).to.deep.equal({
          GET: [
            previouslyMockedResponse,
            responseToMock
          ]
        });
      });

      it('adds a response to the store under a specific method and keeps existing store responses for a different method', () => {
        const previouslyMockedResponse = { method: 'post', path: '/previouslyMockedPath' };
        const initialState = { POST: [previouslyMockedResponse] }
        const { responseStoreInstance } = setup({ initialState });

        const responseToMock = {
          method: 'get',
          path: '/testPath',
          status: 200
        };

        responseStoreInstance.add(responseToMock);
        expect(responseStoreInstance.state).to.deep.equal({
          POST: [previouslyMockedResponse],
          GET: [responseToMock]
        });
      });

      describe('default behaviour', () => {
        it('adds a mock to the store with defaults', () => {
          const { responseStoreInstance } = setup();
          const responseToMock = {
            path: '/testPath',
            method: undefined,
            status: undefined
          };

          responseStoreInstance.add(responseToMock);
          expect(responseStoreInstance.state).to.deep.equal({
            GET: [{
              path: '/testPath',
              method: 'GET',
              status: 200
            }]
          });
        });

        it('should not override method when specified', () => {
          const { responseStoreInstance } = setup();
          const responseToMock = {
            path: '/testPath',
            method: 'POST'
          };

          responseStoreInstance.add(responseToMock);
          expect(responseStoreInstance.state).to.deep.equal({
            POST: [{
              path: '/testPath',
              method: 'POST',
              status: 200
            }]
          });
        });

        it('should not override status when specified', () => {
          const { responseStoreInstance } = setup();
          const responseToMock = {
            path: '/testPath',
            status: 201
          };

          responseStoreInstance.add(responseToMock);
          expect(responseStoreInstance.state).to.deep.equal({
            GET: [{
              path: '/testPath',
              method: 'GET',
              status: 201
            }]
          });
        });
      })

    });

    describe('remove()', () => {
      it('removes a response under a specific method using path', () => {
        const responseToRemove = { method: 'post', path: '/deleteMe' };
        const initialState = { POST: [responseToRemove] };
        const { responseStoreInstance } = setup({ initialState });

        responseStoreInstance.remove(responseToRemove.method, responseToRemove.path);
        expect(responseStoreInstance.state).to.deep.equal({
          POST: []
        });
      });

      it('removes a response under a specific method using path but keeps exising responses', () => {
        const previouslyMockedResponse = { method: 'get', path: '/previouslyMockedPath' };
        const responseToRemove = { method: 'post', path: '/deleteMe' };
        const initialState = {
          GET: [previouslyMockedResponse],
          POST: [responseToRemove]
        };
        const { responseStoreInstance } = setup({ initialState });

        responseStoreInstance.remove(responseToRemove.method, responseToRemove.path);
        expect(responseStoreInstance.state).to.deep.equal({
          GET: [previouslyMockedResponse],
          POST: []
        });
      });
    });

    describe('match()', () => {
      it('returns false if no match is found', () => {
        const mockedResponse = { method: 'get', path: '/mockedPath' };
        const initialState = {
          GET: [mockedResponse]
        };
        const { responseStoreInstance } = setup({ initialState });

        expect(responseStoreInstance.match(mockedResponse.method, '/pathThatDoesNotExist')).to.equal(false);
      });

      it('returns false if it cannot find the method in the store', () => {
        const mockedResponse = { method: 'get', path: '/mockedPath' };
        const initialState = {
          GET: [mockedResponse]
        };
        const { responseStoreInstance } = setup({ initialState });

        expect(responseStoreInstance.match('POST', '/pathThatDoesNotExist')).to.equal(false);
      });

      it('returns the match for the given method and path when response path is a string', () => {
        const mockedResponse = { method: 'get', path: '/mockedPath' };
        const initialState = {
          GET: [mockedResponse]
        };
        const { responseStoreInstance } = setup({ initialState });

        expect(responseStoreInstance.match(mockedResponse.method, mockedResponse.path)).to.equal(mockedResponse);
      });

      it('returns the match for the given method and path when response path is a regex', () => {
        const mockedResponse = { method: 'get', path: /mockedPath\/*/ };
        const initialState = {
          GET: [mockedResponse]
        };
        const { responseStoreInstance } = setup({ initialState });

        expect(responseStoreInstance.match(mockedResponse.method, '/mockedPath/withAddedStuff')).to.equal(mockedResponse);
      });

      it('returns false when the path regex does not match', () => {
        const mockedResponse = { method: 'get', path: /mockedPath\/*/ };
        const initialState = {
          GET: [mockedResponse]
        };
        const { responseStoreInstance } = setup({ initialState });

        expect(responseStoreInstance.match(mockedResponse.method, '/notMatching')).to.equal(false);
      });

      it('returns the match for the given method and path when response path is a regex as a string', () => {
        const mockedResponse = {
          method: 'get',
          path: (/^\/mockedPath\/*/).toString(),
          isRegexPath: true
        };
        const initialState = {
          GET: [mockedResponse]
        };
        const { responseStoreInstance } = setup({ initialState });

        expect(responseStoreInstance.match(mockedResponse.method, '/mockedPath/withAddedStuff')).to.equal(mockedResponse);
      });

      it('returns false when the path regex as a string does not match', () => {
        const mockedResponse = {
          method: 'get',
          path: (/^\/mockedPath\/*/).toString(),
          isRegexPath: true
        };
        const initialState = {
          GET: [mockedResponse]
        };
        const { responseStoreInstance } = setup({ initialState });

        expect(responseStoreInstance.match(mockedResponse.method, '/notMatching')).to.equal(false);
      });

      describe('conditional request options', () => {
        it('returns the match when conditional header is present', () => {
          const mockedResponse = {
            method: 'get',
            path: '/testPath',
            conditionalHeaders: { 'some-header': 'headerValue' }
          };
          const initialState = {
            GET: [mockedResponse]
          };
          const { responseStoreInstance } = setup({ initialState });

          const matchResult = responseStoreInstance.match(
            mockedResponse.method,
            mockedResponse.path,
            mockedResponse.conditionalHeaders
          );

          expect(matchResult).to.equal(mockedResponse);
        });

        it('returns the match when conditional header is present regardless of case sensitivity', () => {
          const mockedResponse = {
            method: 'get',
            path: '/testPath',
            conditionalHeaders: { 'SOME-HEADER': 'headerValue' }
          };
          const initialState = {
            GET: [mockedResponse]
          };
          const { responseStoreInstance } = setup({ initialState });

          const matchResult = responseStoreInstance.match(
            mockedResponse.method,
            mockedResponse.path,
            { 'some-header': 'headerValue' }
          );

          expect(matchResult).to.equal(mockedResponse);
        });

        it('returns false when the conditional header is missing', () => {
          const mockedResponse = {
            method: 'get',
            path: '/testPath',
            conditionalHeaders: { 'some-header': 'headerValue' }
          };
          const initialState = {
            GET: [mockedResponse]
          };
          const { responseStoreInstance } = setup({ initialState });

          const matchResult = responseStoreInstance.match(
            mockedResponse.method,
            mockedResponse.path,
            {}
          );

          expect(matchResult).to.equal(false);
        });

        it('returns the match the conditional body is present', () => {
          const mockedResponse = {
            method: 'get',
            path: '/testPath',
            conditionalBody: 'Body'
          };
          const initialState = {
            GET: [mockedResponse]
          };
          const { responseStoreInstance } = setup({ initialState });

          const matchResult = responseStoreInstance.match(
            mockedResponse.method,
            mockedResponse.path,
            {},
            mockedResponse.conditionalBody
          );

          expect(matchResult).to.equal(mockedResponse);
        });

        it('returns false when the conditional body is missing', () => {
          const mockedResponse = {
            method: 'get',
            path: '/testPath',
            conditionalBody: 'Body'
          };
          const initialState = {
            GET: [mockedResponse]
          };
          const { responseStoreInstance } = setup({ initialState });

          const matchResult = responseStoreInstance.match(
            mockedResponse.method,
            mockedResponse.path,
            [],
            null
          );

          expect(matchResult).to.equal(false);
        });

        it('returns the match when the conditional header and body is present', () => {
          const mockedResponse = {
            method: 'get',
            path: '/testPath',
            conditionalHeaders: { 'some-header': 'headerValue' },
            conditionalBody: 'Body'
          };
          const initialState = {
            GET: [mockedResponse]
          };
          const { responseStoreInstance } = setup({ initialState });

          const matchResult = responseStoreInstance.match(
            mockedResponse.method,
            mockedResponse.path,
            mockedResponse.conditionalHeaders,
            mockedResponse.conditionalBody
          );

          expect(matchResult).to.equal(mockedResponse);
        });

        it('returns false when the conditional header is present but the conditional body is missing', () => {
          const mockedResponse = {
            method: 'get',
            path: '/testPath',
            conditionalHeaders: { 'some-header': 'headerValue' },
            conditionalBody: 'Body'
          };
          const initialState = {
            GET: [mockedResponse]
          };
          const { responseStoreInstance } = setup({ initialState });

          const matchResult = responseStoreInstance.match(
            mockedResponse.method,
            mockedResponse.path,
            mockedResponse.conditionalHeaders,
            null
          );

          expect(matchResult).to.equal(false);
        });

        it('returns false when the conditional body is present but the conditional header is missing', () => {
          const mockedResponse = {
            method: 'get',
            path: '/testPath',
            conditionalHeaders: { 'some-header': 'headerValue' },
            conditionalBody: 'Body'
          };
          const initialState = {
            GET: [mockedResponse]
          };
          const { responseStoreInstance } = setup({ initialState });

          const matchResult = responseStoreInstance.match(
            mockedResponse.method,
            mockedResponse.path,
            {},
            mockedResponse.conditionalBody
          );

          expect(matchResult).to.equal(false);
        });
      });

      describe('removeAll()', () => {
        it('removes all responses from the store', () => {
          const mockedResponse = { method: 'get', path: '/previouslyMockedPath' };
          const initialState = { GET: [mockedResponse] }
          const { responseStoreInstance } = setup({ initialState });

          responseStoreInstance.removeAll();

          expect(responseStoreInstance.state).to.deep.equal({});

        });
      });
    });
  });
});
