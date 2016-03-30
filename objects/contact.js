var jsforce = require('jsforce');
var _ = require('underscore');
var Promise = require('bluebird');

var Contact = function contact(conn, options) {
  this.conn = conn;
  this.requiredKeys = options.requiredKeys;
  this.defaults = options.defaults;
  this.recordType = options.recordType;
  this.valueArray = options.valueArray;
  this.accountName = options.accountName;
};

Contact.prototype.create = function(properties) {
  var contact = this;

  var hasKeys = _.every(contact.requiredKeys, function(key) {
    return _.has(properties, key);
  });

  if (!hasKeys) {
    throw new Error('Required keys are not met');
  }

  properties = _.defaults(properties, contact.defaults);

  return new Promise(function (resolve, reject) {
    var recordTypeId;

    contact.getRecordTypeId()
    .then(function (data) {
      recordTypeId = data;
      
      contact.getAccountId()
        .then(function (data) {
          properties.AccountId = data;
          properties.RecordTypeId = recordTypeId;
          properties = _.pick(properties, contact.valueArray);

          contact.conn.sobject("Contact").create(properties, function (err, ret) {
            if (err || !ret.success) {
              return reject(err, ret);
            }
            contact.Id = ret.id;

            contact.find(contact.Id)
            .then(function(info) {
              _.extend(contact, info);
              resolve(contact);
            });
          });
        })

    });
  });
};

Contact.prototype.find = function(contactId) {
  var contact = this;
  return new Promise(function(resolve, reject) {
    contact.conn.sobject("Contact").retrieve(contactId, function(err, data) {
      if (err) {
        reject(err);
      }
      _.extend(contact, _.pick(data, contact.valueArray));
      resolve(contact);
    });
  });
};

Contact.prototype.update = function(values) {
  values.Id = this.Id;
  var contact = this;
  return new Promise(function(resolve, reject) {
    contact.conn.sobject("Contact").update(values, function(err, ret) {
      if (err || !ret.success) {
        return reject(err, ret);
      }
      resolve(ret);
    });
  });
};

/* This is no longer a thing. Only accounts are deleted but we aren't making accounts anymore. */
//
// Contact.prototype.delete = function() {
//   var contact = this;
//   console.warn('Cannot delete contacts. Sorry, only accounts are deleted but we aren't making accounts anymore.')
//   return new Promise(function(resolve, reject) {
//     return resolve(new Error('Cannot delete contacts. Sorry!')) //NOPE
//     contact.conn.sobject('Contact').destroy(contact.Id, function(err, ret) {
//       if (err || !ret.success) {
//         return reject(err, ret);
//       }
//       resolve(ret);
//     });
//   });
// };

Contact.prototype.all = function() {
  var contact = this;
  return new Promise(function(resolve, reject) {
    contact.getRecordTypeId(contact.recordType)
    .then(function(recordTypeId) {
      contact.conn.query("Select Id FROM Contact WHERE RecordTypeId = '" + recordTypeId + "'", function(err, result) {
        if (err) {
          return reject(err);
        }
        resolve(result.records);
      });
    });
  });
}

Contact.prototype.getRecordTypeId = function() {
  var contact = this;
  return new Promise(function(resolve, reject) {
    contact.conn.query("Select Id FROM RecordType WHERE Name = '" + contact.recordType + "'", function(err, result) {
      if (err) {
        return reject(err);
      }
      resolve(result.records[0].Id);
    })
  })
}


Contact.prototype.getAccountId = function getAccountId() {
  var contact = this;
  return new Promise(function (resolve, reject) {
    if (contact.accountId) resolve(contact.accountId)
    contact.conn.query('SELECT Id FROM Account WHERE Name = \'' + contact.accountName + '\'', function(err, data) {
      if (err) {
        return reject(err);
      }

      if (data) {
        resolve(data.records[0].Id);
      }
    })
  })
}



Contact.prototype.getRecordTypeId = function() {
  var contact = this;
  return new Promise(function(resolve, reject) {
    if (contact.recordTypeId) resolve(contact.recordTypeId)
    contact.conn.query("Select Id FROM RecordType WHERE Name = '" + contact.recordType + "'", function(err, result) {
      if (err) {
        return reject(err);
      }
      resolve(result.records[0].Id);
    })
  })
}

module.exports = Contact;
