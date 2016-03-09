var expect = require('chai').expect;
var Student = require('../objects/student');
var Login = require('../objects/login');
var testConfig = require('./config');

describe('Login', function() {
  it ('should login', function(done) {
    Login.login(testConfig)
    .then(function(data) {
      debugger;
    });
  });
});