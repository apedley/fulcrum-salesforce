var _ = require('underscore');
var Promise = require('bluebird');

var Contact = function contact(conn, options) {
  if (conn == null) {
    throw new Error('Requires Connection Object');
  }

  if (options.recordType == null || options.accountName == null) {
    throw new Error('Requires recordType and accountName');
  }

  options.requiredKeys = options.requiredKeys || []
  options.valueArray = options.valueArray || []
  options.defaults = options.defaults || {}

  var sobject = conn.sobject("Contact");

  this._runQuery = Promise.promisify(conn.query, {context: conn})
  this._sObject = {
    retrieve: Promise.promisify(sobject.retrieve, {context: sobject}),
    create: Promise.promisify(sobject.create, {context: sobject}),
    update: Promise.promisify(sobject.update, {context: sobject})
  }

  _.extend(this, options)
};

Contact.prototype.create = function(properties) {
  var contact = this;

  var hasKeys = _.every(contact.requiredKeys, function(key) {
    return _.has(properties, key);
  });

  if (!hasKeys) {
    throw new Error('Required keys are not met');
  }

  function annotateProperties (results) {
    var recordTypeId = results[0]
    var accountId = results[1];

    properties = _.defaults(properties, contact.defaults);
    properties.RecordTypeId = recordTypeId;
    properties.AccountId = accountId;
    properties = _.pick(properties, contact.valueArray);

    return properties
  }

  return Promise.all([contact.getIdFor('RecordType', contact.recordType), contact.getIdFor('Account', this.accountName)])
      .then(annotateProperties)
      .then(contact._sObject.create) //Create with Properties
      .then(returnOnly('id')) // Return only id
      .then(contact.find.bind(contact)) // Find it
      .then(_.partial(_.extend, contact)) // Destructively extend contact Object
};

Contact.prototype.find = function(contactId) {
  return this._sObject.retrieve(contactId)
    .then(_.partial(flip(_.pick), this.valueArray)) //Pick only the valueArray items
};

Contact.prototype.update = function(values) {
  values.Id = this.Id;
  return this._sObject.update(values)
};

Contact.prototype.all = function() {
  return this.getIdFor('RecordType', this.recordType)
    .then(template("Select Id FROM Contact WHERE RecordTypeId = '%%str%%'"))
    .then(this._runQuery)
    .then(returnOnly('records'))
}

Contact.prototype.getIdFor = function (table, name) {
  return this._runQuery("Select Id FROM " + table + " WHERE Name = '" + name + "'")
    .then(returnOnly('records.0.Id'))
}

module.exports = Contact;

/* Utilities */
function flip (fn) {
  return function _flipped (args) {
    return fn.apply(this, Array.prototype.reverse.call(arguments))
  }
}

function template (string) {
  return function _template (data) {
    return string.replace('%%str%%', data)
  }
}

function returnOnly (keys) {
  return _.partial(retrieve, keys.split('.').reverse())

  function retrieve (keys, obj) {
    if (typeof obj !== 'object' || keys.length === 0) return obj
    if (keys.length === 1) return obj[keys[0]]
    return retrieve(keys, obj[keys.pop()])
  }
}

/* END of Utilities */