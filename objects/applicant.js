var _ = require('underscore')
var Contact = require('./contact')

var suffix = '_Application_Status__c';
var applicantDef = {
  recordType: 'Admissions Applicant',
  accountName: 'Applicant',
  defaults: {
    Partnership_Status__c: 'None',
    Remote__c: true,
    MobilePhone: 0000000000,
    Sponsorship__c: 'Not Sponsored',
  },
  requiredKeys: ['FirstName', 'LastName', 'GitHub__c', 'Email', 'Earliest_Start_Date__c'], 
  valueArray: [
   'FirstName',
   'LastName',
   'Email',
   'GitHub__c',
   'MobilePhone',
   'Sponsorship__c',
   'AccountId',
   'RecordTypeId',
   'Id',
   'Earliest_Start_Date__c'
   ]
}

/*
  Update school array below with new schools
*/
var schools = ['MKS_ATX', 'MKS_LA', 'MKS_SF', 'MMA_CHI', 'MMA_SF', 'TGA', 'HROS', 'HRRB']
schools.forEach(function(ea) {
  applicantDef.valueArray.push(ea + suffix)
})
/*
  Update school array above with new schools to extend functionality
*/

function Applicant (conn, contactId, properties) {
  _.extend(this, new Contact(conn, applicantDef))
  
  var _create = this.create
  var _update = this.update
  
  this.create = function wrappedCreate (properties) {
    var properties = _.clone(properties);

    if (!properties.Schools || properties.Schools.length <= 0) throw new Error('Applicant must apply for a school.')
    var atLeastOne = false;
    properties.Schools.forEach(function(ea) {
      if (schools.indexOf([ea])) {
        properties[ea + suffix] = 'New'
      }
      atLeastOne = true;
    })

    if (!atLeastOne) throw new Error('Applicant must apply for a school.');
    delete properties.Schools // Clear out!
    return _create.call(this, properties)
  } 

  this.update = function wrappedUpdate (properties) {
    var contact = this;
    var properties = _.clone(properties);

    properties.Schools = properties.Schools || []
    properties.Schools.forEach(function(ea) {
      if (schools.indexOf([ea]) && !properties[ea+suffix]) {
        properties[ea + suffix] = 'New'
      }
    })
    delete properties.Schools // Clear out!

    return _update.call(contact, properties)
  } 

  if (contactId) {
    return this.find(contactId)
          .then(_.partial(_.extend, this));
  } else if (properties) {
    return this.create(properties)
  }

  return this
}

Applicant.prototype.getIdByEmail = function findByEmail (email) {
  return this._runQuery('Select Id FROM Contact WHERE Email =\'' + email + '\'')
          .then(function(data) {
            return data.records
          })
}

module.exports = Applicant
