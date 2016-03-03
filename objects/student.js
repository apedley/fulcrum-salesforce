var salesforceRest = require('salesforce-rest');
var _ = require('underscore');

/*
Creates a student. Required fields are:
*/

var Student = function student(properties, callback) {
  var complete = _.every(requiredKeys, function(key) {
    return !!properties[key];
  });

  if (!complete) {
    throw new Error('missing required fields');
  }
  _.extend(this, properties);
  var thisStudent = this;

  // Create account
  createAccount(properties)
  .then(function(data) {
    thisStudent.AccountId = data.id; 
  })
  .then(function() {
    createContact(thisStudent.AccountId, properties);
  })
  .then(function() {
    callback(thisStudent.AccountId);
  });

};

var requiredKeys = [
  'phone',
  'remote',
  'partnershipStatus',
  'lastName',
  'firstName'
]
var createAccount = function(properties) {
  var accountProperties = {
    Name: properties.firstName + ' ' + properties.lastName,
    Partnership_Status__c: properties.partnershipStatus,
    Remote__c: properties.remote.toString(),
    Phone: properties.phone.toString()
  }
  var path = '/services/data/v20.0/sobjects/Account/';
  return new Promise(function(resolve, reject) {
    salesforceRest.post(path, accountProperties, function(error, data) {
      if (error || data.status !== 201) {
        reject();
      } else {
        resolve(data.data);
      }
    });
  })
}

var createContact = function(accountId, properties1) {

}

module.exports = Student;