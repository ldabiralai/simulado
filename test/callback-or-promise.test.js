var chai = require('chai');
chai.use(require('chai-spies'));
var expect = chai.expect;

var callbackOrPromise = require('../lib/callback-or-promise');

function createSuccessfulSuperAgentAPI(result) {
  return chai.spy(function () {
    return {
      end: function (callback) {
        callback(null, result);
      }
    };
  });
}

function createFailingSuperAgentAPI(error) {
  return chai.spy(function () {
    return {
      end: function (callback) {
        callback(error);
      }
    };
  });
}

var success = "success";
var error = new Error("ouch!");

describe('callback-or-promise', function () {

  describe('with callback', function () {

    it('calls the function then on success calls callback with success', function () {
      var callback = chai.spy();
      var fn = createSuccessfulSuperAgentAPI(success);

      callbackOrPromise(fn, callback);

      expect(fn).to.have.been.called();
      expect(callback).to.have.been.called.with(null, success);
    });

    it('calls the function then on failure calls callback with error', function () {
      var callback = chai.spy();
      var fn = createFailingSuperAgentAPI(error);

      callbackOrPromise(fn, callback);

      expect(fn).to.have.been.called();
      expect(callback).to.have.been.called.with(error);
    });

    it('calls the function then on inner failure calls callback with error', function () {
      var callback = chai.spy();
      var fn = chai.spy(function() { throw error; });

      callbackOrPromise(fn, callback);

      expect(fn).to.have.been.called();
      expect(callback).to.have.been.called.with(error);
    });

    it('logs a deprecation warning', function() {
      var spy = chai.spy.on(console, 'warn');

      callbackOrPromise(function() {}, function() {});

      expect(spy).to.have.been.called.with("Callbacks are deprecated, we're moving towards a promise-based API.");
    });

  });

  describe('without callback', function () {

    it('calls the function then on success returns a promise that will resolve', function (done) {
      var fn = createSuccessfulSuperAgentAPI(success);

      callbackOrPromise(fn).then(function(result) {
        expect(fn).to.have.been.called();
        expect(result).to.eq(success);
        done();
      });

    });

    it('calls the function then on failure returns a promise that will be rejected', function (done) {
      var fn = createFailingSuperAgentAPI(error);

      callbackOrPromise(fn).catch(function(error) {
        expect(fn).to.have.been.called();
        expect(error).to.eq(error);
        done();
      });

    });

    it('calls the function then on inner failure returns a promise that will be rejected', function (done) {
      var fn = chai.spy(function() { throw error; });

      callbackOrPromise(fn).catch(function(error) {
        expect(fn).to.have.been.called();
        expect(error).to.eq(error);
        done();
      });
    });

    it('does not log a deprecation warning', function() {
      var spy = chai.spy.on(console, 'warn');

      callbackOrPromise(function() {}, function() {});

      expect(spy).to.have.not.been.called;
    });
  });

});
