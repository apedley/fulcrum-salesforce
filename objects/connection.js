var jsforce = require('jsforce');
var Promise = require('bluebird');
var _ = require('underscore');

var Connection = function connection(url, username, password, userSecurityToken) {
  var connectionContext = this;
  return new Promise(function (resolve, reject) {
    var jsforceConn = new jsforce.Connection({
      loginUrl: url
    });
    jsforceConn.login(username, password + userSecurityToken, function(err, userInfo) {
      if (err) {
        reject(err);
        throw new Error('Error connecting: ' + err);
      }
      connectionContext.accessToken = jsforceConn.accessToken;
      connectionContext.instanceUrl = jsforceConn.instanceUrl;
      _.extend(connectionContext, jsforceConn);
      resolve(jsforceConn);
    });
  });
};

module.exports = Connection;