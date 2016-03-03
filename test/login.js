var expect = require('chai').expect;
var Login = require('../objects/login');
var testConfig = require('./config');

describe('Login', function() {
  it('has a login function', function() {
    expect(Login.login).to.be.a('function');
  });

  it('gets the access token', function() {
    expect(Login.getAccessToken()).to.be.undefined;
  });

  it('logs in', function() {
    Login.login(testConfig)
    .then(function(data) {
      expect(data.access_token.length).to.be.gt(0);
      expect(Login.getAccessToken().length).to.be.gt(0);
    });
  });

});