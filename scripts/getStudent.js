var salesforceRest = require('salesforce-rest');
var Promise = require('bluebird');
var Login = require('../objects/login');
var Student = require('../objects/student');
var testConfig = require('../test/config')
var _ = require('underscore');

var CONTACT_ID = '003P000000hOGtQIAW';


var student;

Login.login(testConfig)
.then(function() {
  student = new Student(CONTACT_ID, {}, function(error, data) {

  });
});