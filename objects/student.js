var jsforce = require('jsforce');
var _ = require('underscore');
var Promise = require('bluebird');
var Contact = require('./contact')

var studentDef = {
  recordType: 'Fulcrum Student',
  accountName: 'Applicant',
  defaults: {
    Partnership_Status__c: 'None',
    Remote__c: true,
    MobilePhone: 0000000000,
    Sponsorship__c: 'Not Sponsored',
    //Fulcrum Specific
    Pace__c: 'Relaxed',
    Overall_Substatus__c: 'Started',
    Fulcrum_Status__c: 'Active',
  },
  requiredKeys: ['FirstName', 'LastName', 'GitHub__c', 'Email'], 
  valueArray: [
               'FirstName',
               'LastName',
               'Email',
               'Pace__c',
               'GitHub__c',
               'MobilePhone',
               'Fulcrum_Status__c',
               'Overall_Substatus__c',
               'Sponsorship__c',
               'AccountId',
               'RecordTypeId',
               'Id'
  ]
};

var Student = function student(conn, contactId, properties) {
  _.extend(this, new Contact(conn, studentDef));

  if (contactId) {
    return this.find(contactId)
            .then(_.partial(_.extend, this));
  } else if (properties) {
    return this.create(properties);
  }

  return this;
}

module.exports = Student

