var salesforceRest = require('salesforce-rest');
var Promise = require('bluebird');

var Login = function login() {
}

Login.login = function(options) {
  return new Promise(function(resolve, reject) {
    salesforceRest.setOptions(options);

    salesforceRest.login(function(error, data) {
      if (error) { 
        reject();
      } else {
        Login.accessToken = data.access_token;
        resolve(data);
      }
    });
  });
};

Login.getAccessToken = function() {
  return Login.accessToken;
}

module.exports = Login;