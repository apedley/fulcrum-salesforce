var salesforceRest = require('salesforce-rest');
var _ = require('underscore');

/*
Creates a student. Required fields are:
*/

var Student = function student(properties, callback) {
  if (!properties) {
    return;
  }
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
    return data;
  })
  .then(function(data) {
    createContact(thisStudent.AccountId, properties, function(error, data) {
      thisStudent.ContactId = data.id;
      callback(thisStudent.AccountId, thisStudent.ContactId);
    });
  })
  .catch(function(e) {
    console.error(e);
  });

};

var requiredKeys = [
  'FirstName',
  'LastName',
  'Partnership_Status__c',
  'Remote__c',
  'Phone',
  'Github__c',
  'Email',
  'Pace__c',
  'Overall_Substatus__c',
  // fulcrumTuition
  // fulcrum discount amount
  'Fulcrum_Status__c',
  'Sponsorship__c'
]
var createAccount = function(properties) {
  var accountProperties = _.pick(properties, 'Partnership_Status__c', 'Remote__c', 'Phone');
  accountProperties.Name = properties.FirstName + ' ' + properties.LastName;

  // var accountProperties = {
  //   Name: properties.firstName + ' ' + properties.lastName,
  //   Partnership_Status__c: properties.partnershipStatus,
  //   Remote__c: properties.remote.toString(),
  //   Phone: properties.phone.toString()
  // }

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

var createContact = function(accountId, properties, callback) {
  var contactProperties = _.pick(properties, 'FirstName', 'LastName', 'Email', 'Pace__c', 'GitHub__c',
                                 'Fulcrum_Status__c', 'Overall_Substatus__c', 'Sponsorship__c');
  contactProperties.AccountId = accountId;
  // var contactProperties = {
  //   FirstName: properties.firstName,
  //   LastName: properties.lastName,
  //   Email: properties.email,
  //   Pace__c: properties.pace,
  //   GitHub__c: properties.github,
  //   Fulcrum_Status__c: properties.fulcrumStatus,
  //   Overall_Substatus__c: properties.fulcrumSubstatus,
  //   Sponsorship__c: properties.sponsorship,
  //   AccountId: accountId
  // }
  var path = '/services/data/v20.0/sobjects/Contact/';

  salesforceRest.post(path, contactProperties, function(error, data) {
    callback(error, data.data);
  });

  // return new Promise(function(resolve, reject) {
  //   salesforceRest.post(path, contactProperties, function(error, data) {
  //     debugger;
  //     if (error) {
  //       reject(error);
  //     } else {
  //       resolve(data);
  //     }
  //   });
  // });
}

module.exports = Student;