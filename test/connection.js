var expect = require('chai').expect;
var Connection = require('../objects/connection');
var testConfig = require('./config');
var Promise = require('bluebird');


var connection;

describe('Connection', function() {
  it('has a constructor', function() {
    expect(Connection).to.be.a('function');
  });

  it('logs in when created', function(done) {
    connection = new Connection(testConfig.url, testConfig.username, testConfig.password, testConfig.userSecurityToken)
    .then(function(conn) {
      expect('sobject' in conn).to.be.true;
      done();
    });
  });

  // it('does not login with incorrect information', function(done) {
  //   var badUrl = 'http://test';
  //   var connectFunction = function() {
  //     var connection = new Connection(testConfig.url, testConfig.username, testConfig.password, testConfig.userSecurityToken)
  //     .then(function(data) {
  //       done();
  //     });
  //   }
  // });
});