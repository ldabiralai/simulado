var Simulado = require('../simulado.js');
var chai = require('chai').should();
var expect = require('chai').expect
var superagent = require('superagent');
var Browser = require('zombie');


describe('Simulado homepage', function () {


  var browser = new Browser();

  before(function (done) {
    Simulado.reset();
    done();
  });


  it('should show that a mocked GET endpoint, exists', function (done) {
    Simulado.mock({
      path: '/test',
      method: 'GET'
    }, function () {
      browser.visit('http://localhost:7000/', function () {
        browser.assert.text('.path', '/test');
        browser.assert.text('.method', 'GET');
        browser.assert.text('.status', 'Status: 200');
        done();
      });
    });
  });


  it('should show that a mocked POST endpoint, exists', function (done) {
    Simulado.mock({
      path: '/test',
      method: 'POST'
    }, function () {
      browser.visit('http://localhost:7000/', function () {
        browser.assert.text('.path', '/test');
        browser.assert.text('.method', 'POST');
        browser.assert.text('.status', 'Status: 200');
        done();
      });
    });
  });


  it('should show the mocked response body', function (done) {
    Simulado.mock({
      path: '/test',
      method: 'GET',
      response: {
        a: 1
      }
    }, function () {
      browser.visit('http://localhost:7000/', function () {
        browser.assert.text('.response-body', 'Response body: { "a": 1 }');
        done();
      });
    });
  });


  it('should show the last request to the mocked endpoint', function (done) {
    Simulado.mock({
      path: '/test',
      method: 'GET'
    }, function () {
      superagent.get('http://localhost:7000/test').end(function (_, _) {
        browser.visit('http://localhost:7000/', function () {
          browser.assert.text('.last-request', 'Last request: { "headers": { "host": "localhost:7000", "accept-encoding": "gzip, deflate", "user-agent": "node-superagent/1.6.1", "connection": "close" }, "body": {}, "params": {} }');
          done();
        });
      });
    });
  });
  

  it('should not show the last request section if no request was made to the mocked endpoint', function (done) {
    Simulado.mock({
      path: '/test',
      method: 'GET'
    }, function () {
      browser.visit('http://localhost:7000/', function () {
        browser.assert.elements('.last-request', 0);
        done();
      });

    });
  });



});
