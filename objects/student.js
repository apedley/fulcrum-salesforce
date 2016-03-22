var jsforce = require('jsforce');
var _ = require('underscore');
var Promise = require('bluebird');

var requiredKeys = [
  'FirstName',
  'LastName',
  'GitHub__c',
  'Email'
];

var defaults = {
  Partnership_Status__c: 'None',
  Remote__c: true,
  Phone: 0000000000,
  Pace__c: 'Relaxed',
  Overall_Substatus__c: 'Started',
  Fulcrum_Status__c: 'Active',
  Sponsorship__c: 'Not Sponsored'
};


var Student = function student(connection, contactId, properties) {
  this.conn = connection;
  if (contactId) {
    return this.find(contactId);
  } else {
    
    var hasKeys = _.every(requiredKeys, function(key) {
      return _.has(properties, key);
    });

    if (!hasKeys) {
      throw new Error('Required keys are not met');
    }

    properties = _.defaults(properties, defaults);

    return this.create(properties);
  }
};


Student.prototype.create = function(properties) {
  var student = this;
  return new Promise(function(resolve, reject) {
    var recordTypeId;

    Student.getRecordTypeId(student.conn)
    .then(function(data) {
      recordTypeId = data;

      student.account = {
        Partnership_Status__c: properties.Partnership_Status__c,
        Remote__c: properties.Remote__c,
        Phone: properties.Phone
      };

      if (properties.accountId) {
        student.accountId = properties.accountId;
        student.account.Id = properties.accountId;
        createContact().then(resolve).catch(reject);
      }
      else {
        createAccount().then(createContact).then(resolve).catch(reject);
      }

      function createAccount() {
        var accountProperties = _.pick(properties, 'Partnership_Status__c', 'Remote__c', 'Phone');
        accountProperties.Name = properties.FirstName + ' ' + properties.LastName;
        return new Promise(function(resolve, reject) {
          student.conn.sobject("Account").create(accountProperties, function(err, ret) {
            if (err || !ret.success) {
              reject(err, ret);
            }
            student.accountId = ret.id;
            student.account.Id = ret.id;
            resolve();
          });
        });
      }

      function createContact() {
        var contactProperties = _.pick(properties, 'FirstName', 'LastName', 'Email', 'Pace__c', 
          'GitHub__c', 'Fulcrum_Status__c', 'Overall_Substatus__c', 'Sponsorship__c');
        contactProperties.AccountId = student.accountId;
        contactProperties.RecordTypeId = recordTypeId;

        return new Promise(function(resolve, reject) {
          student.conn.sobject("Contact").create(contactProperties, function(err, ret) {
            if (err || !ret.success) {
              reject(err, ret);
              return;
            }
            else {
              student.contactId = ret.id;
              student.find(student.contactId)
              .then(function(info) {
                _.extend(student, info);
                resolve(student);
              });              
            }
          });
        });
      }
    });
  });
};

Student.prototype.find = function(contactId) {
  var student = this;
  return new Promise(function(resolve, reject) {
    student.conn.sobject("Contact").retrieve(contactId, function(err, contact) {
      if (err) {
        reject(err);
      }
      _.extend(student, contact);
      resolve(student);
    });
  });
};

Student.prototype.update = function(values) {
  values.Id = this.Id;
  var student = this;
  return new Promise(function(resolve, reject) {
    student.conn.sobject("Contact").update(values, function(err, ret) {
      if (err || !ret.success) {
        return reject(err, ret);
      }
      resolve(ret);
    });
  });
};

Student.prototype.delete = function() {
  var student = this;
  return new Promise(function(resolve, reject) {
    student.conn.sobject('Account').destroy(student.AccountId, function(err, ret) {
      if (err || !ret.success) {
        return reject(err, ret);
      }
      resolve(ret);
    });
  });
};

Student.all = function(connection) {
  return new Promise(function(resolve, reject) {
    Student.getRecordTypeId(connection)
    .then(function(recordTypeId) {
      connection.query("Select Id FROM Contact WHERE RecordTypeId = '" + recordTypeId + "'", function(err, result) {
        if (err) {
          return reject(err);
        }
        resolve(result.records);
      });
    });
  });
}

Student.getRecordTypeId = function(connection) {
  return new Promise(function(resolve, reject) {
    connection.query("Select Id FROM RecordType WHERE Name = 'Fulcrum Student'", function(err, result) {
      if (err) {
        return reject(err);
      }
      resolve(result.records[0].Id);
    })
  })
}

module.exports = Student;