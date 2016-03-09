var salesforceRest = require('salesforce-rest');
var Promise = require('bluebird');
var _ = require('underscore');

var Login = function login() {

}

Login.login = function(options) {
  return new Promise(function(resolve, reject) {
    salesforceRest.setOptions(options);
    salesforceRest.login(function(data) {
      resolve();
    });
  });
}

module.exports = Login;