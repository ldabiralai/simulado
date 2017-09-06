describe('Simulado Mock Server', () => {
  describe('start', () => {
    it('starts server on a default port');

    it('starts server on a specified port');

    describe('https', () => {
      it('starts server on https using certificate');

      it('throws an error if no https key is supplied');

      it('throws an error if no https certificate is supplied');
    });
  }); 

  describe('stop', () => {
    it('stops the server running on the default port');

    it('stops the server on a specified port');
  });

  describe('endpoint mocking', () => {
    it('returns a 404 if an endpoint hasn\'t been mocked');

    it('responds to an endpoint with mocked path, method and status');

    it('responds to an endpoint with a mocked regex path');

    it('responds to an endpoint which is mocked with body content');

    it('responds to an endpoint that has conditional headers which the request includes');

    it('does not respond to an endpoint that has conditional headers which the request does not include');

    it('responds to an endpoint that has a conditional body which the request includes');

    it('does not respond to an endpoint that has a conditional body which the request does not include');
  });

  describe('get last requests', () => {
    it('returns a list of last requests made for an endpoint');

    it('returns a limited list of requests made for an endpoint');

    it('returns empty list if no requests have been made for an endpoint.');

    it('returns the only the last request made for an endpoint');
  });

  describe('clearing mocks', () => {
    it('clears all mocked responses');

    it('clears all requests made to mocked endpoints');
  });
});
