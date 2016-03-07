var salesforceRest = require('salesforce-rest');
var Login = require('../objects/login');
var testConfig = require('../test/config')
var _ = require('underscore');

// delete all Accounts
Login.login(testConfig)
.then(function(data){
  salesforceRest.get('Select Id from Account', function(error, data) {
    var ids = _.map(data.records, function(item) {
      return item.Id;
    })
    _.each(ids, function(id) {
      salesforceRest.delete('Account', id, function(error, data) {
        console.log('Deleted Account', id);
      });
    });
  });
})
.then(function() {
  salesforceRest.get('Select Id from Contact', function(error, data) {
    var ids = _.map(data.records, function(item) {
      return item.Id;
    });
    _.each(ids, function(id) {
      salesforceRest.delete('Contact', id, function(error, data) {
        console.log('Deleted Contact ', id);
      })
    })
  });
});